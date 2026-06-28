import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';

// CORS origin is driven by ADMIN_ALLOWED_ORIGINS (comma-separated). If unset,
// we fall back to '*' so the function keeps working before it is configured.
// Auth is via bearer token (not cookies), so '*' is not itself a CSRF risk, but
// pinning to your real origin(s) is recommended once known.
function buildCorsHeaders(req: Request): Record<string, string> {
  const allowed = (Deno.env.get('ADMIN_ALLOWED_ORIGINS') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origin = req.headers.get('Origin') || '';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
  };

  if (allowed.length === 0) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  } else {
    headers['Access-Control-Allow-Origin'] = allowed[0];
    headers['Vary'] = 'Origin';
  }

  return headers;
}

const allowedStatuses = new Set([
  'incomplete',
  'submitted',
  'admitted',
  'waitlisted',
  'rejected',
]);

function jsonResponse(
  body: unknown,
  status = 200,
  corsHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// Strip characters that have meaning in a PostgREST `or()` / ilike filter so a
// search term cannot break out of the value position and inject filter logic.
function sanitizeSearch(raw: unknown): string {
  return String(raw ?? '')
    .replace(/[,()*\\%"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

function getAdminAllowlist() {
  return (Deno.env.get('ADMIN_EMAIL_ALLOWLIST') || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdmin(req: Request, corsHeaders: Record<string, string>) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    throw new Error('Supabase function environment is not configured.');
  }

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      error: jsonResponse({ error: 'Missing auth token.' }, 401, corsHeaders),
      adminClient: null,
      user: null,
    };
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(token);

  if (error || !user?.email) {
    return {
      error: jsonResponse({ error: 'Invalid auth token.' }, 401, corsHeaders),
      adminClient: null,
      user: null,
    };
  }

  const allowlist = getAdminAllowlist();
  if (!allowlist.includes(user.email.toLowerCase())) {
    return {
      error: jsonResponse(
        { error: 'This email is not an admissions admin.' },
        403,
        corsHeaders,
      ),
      adminClient: null,
      user: null,
    };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return { error: null, adminClient, user };
}

async function parseBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { error, adminClient, user } = await requireAdmin(req, corsHeaders);
    if (error) {
      return error;
    }

    const body = await parseBody(req);

    if (req.method === 'POST' && body.action === 'resume-url') {
      if (!body.resume_path) {
        return jsonResponse({ error: 'Missing resume_path.' }, 400, corsHeaders);
      }

      const { data, error: signedUrlError } = await adminClient.storage
        .from('resumes')
        .createSignedUrl(body.resume_path, 60 * 5);

      if (signedUrlError) {
        return jsonResponse(
          { error: signedUrlError.message },
          400,
          corsHeaders,
        );
      }

      return jsonResponse({ url: data.signedUrl }, 200, corsHeaders);
    }

    if (req.method === 'POST' && body.action === 'list') {
      const filters = body.filters || {};
      let query = adminClient
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.school && filters.school !== 'all') {
        query = query.eq('school', filters.school);
      }

      const cleanSearch = sanitizeSearch(filters.search);
      if (cleanSearch) {
        const search = `%${cleanSearch}%`;
        query = query.or(
          `email.ilike.${search},first_name.ilike.${search},last_name.ilike.${search},school.ilike.${search},program.ilike.${search}`,
        );
      }

      const { data, error: listError } = await query;
      if (listError) {
        return jsonResponse({ error: listError.message }, 400, corsHeaders);
      }

      return jsonResponse({ applications: data || [] }, 200, corsHeaders);
    }

    if (req.method === 'PATCH') {
      if (!body.id) {
        return jsonResponse(
          { error: 'Missing application id.' },
          400,
          corsHeaders,
        );
      }

      const updates: Record<string, unknown> = {};

      if (body.status) {
        if (!allowedStatuses.has(body.status)) {
          return jsonResponse({ error: 'Invalid status.' }, 400, corsHeaders);
        }
        updates.status = body.status;
        updates.decided_at = ['admitted', 'waitlisted', 'rejected'].includes(
          body.status,
        )
          ? new Date().toISOString()
          : null;
        updates.decided_by = ['admitted', 'waitlisted', 'rejected'].includes(
          body.status,
        )
          ? user.email
          : null;
      }

      if (typeof body.admin_notes === 'string') {
        updates.admin_notes = body.admin_notes;
      }

      const { data, error: updateError } = await adminClient
        .from('applications')
        .update(updates)
        .eq('id', body.id)
        .select('*')
        .single();

      if (updateError) {
        return jsonResponse({ error: updateError.message }, 400, corsHeaders);
      }

      return jsonResponse({ application: data }, 200, corsHeaders);
    }

    return jsonResponse({ error: 'Unsupported admin action.' }, 405, corsHeaders);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error.';
    return jsonResponse({ error: message }, 500, corsHeaders);
  }
});
