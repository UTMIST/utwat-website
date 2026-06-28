import { emptyApplicationForm, portalConfig } from './portalConfig';
import { requireSupabase } from './supabaseClient';

const FORM_COLUMNS = [
  'first_name',
  'last_name',
  'phone',
  'school',
  'program',
  'level_of_study',
  'graduation_year',
  'over_18',
  'can_attend_in_person',
  'ml_skill_level',
  'hackathon_count',
  'preferred_track',
  'maple_cup_motivation',
];

const LINK_FIELDS = [
  'github_url',
  'linkedin_url',
  'portfolio_url',
  'devpost_url',
];

const RESPONSE_FIELDS = [
  'why_bots',
  'project_story',
  'future_build',
  'team_contribution',
  'anything_else',
  'joke',
];

const AGREEMENT_FIELDS = [
  'agree_code_of_conduct',
  'agree_privacy',
  'agree_accuracy',
];

function normalizeArrayFromText(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinArrayForForm(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}

async function toFunctionError(error) {
  const fallbackMessage = error?.message || 'Edge Function request failed.';

  if (!error?.context || typeof error.context.json !== 'function') {
    return new Error(fallbackMessage);
  }

  try {
    const payload = await error.context.json();
    if (payload?.error) {
      return new Error(payload.error);
    }
  } catch {
    // Ignore JSON parsing issues and fall back to the original error message.
  }

  return new Error(fallbackMessage);
}

export function applicationRecordToForm(application) {
  if (!application) {
    return { ...emptyApplicationForm };
  }

  return {
    ...emptyApplicationForm,
    ...FORM_COLUMNS.reduce((acc, key) => {
      acc[key] = application[key] ?? emptyApplicationForm[key];
      return acc;
    }, {}),
    ...LINK_FIELDS.reduce((acc, key) => {
      acc[key] = application.links?.[key] ?? '';
      return acc;
    }, {}),
    ...RESPONSE_FIELDS.reduce((acc, key) => {
      acc[key] = application.responses?.[key] ?? '';
      return acc;
    }, {}),
    ...AGREEMENT_FIELDS.reduce((acc, key) => {
      acc[key] = Boolean(application.agreements?.[key]);
      return acc;
    }, {}),
    team_intent: application.team_intent || emptyApplicationForm.team_intent,
    teammate_emails: joinArrayForForm(application.team_emails),
  };
}

// Draft-content columns only. Server-owned columns (user_id, email, status,
// submitted_at, updated_at, admin_notes, decided_*) are NOT included: the
// `authenticated` role has no column privilege to write them, and the DB
// trigger/RPC own them. See docs/admissions-security-hardening.md.
export function formToApplicationPayload(formData) {
  return {
    ...FORM_COLUMNS.reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {}),
    team_intent: formData.team_intent,
    team_emails: normalizeArrayFromText(formData.teammate_emails),
    links: LINK_FIELDS.reduce((acc, key) => {
      acc[key] = formData[key]?.trim() || null;
      return acc;
    }, {}),
    responses: RESPONSE_FIELDS.reduce((acc, key) => {
      acc[key] = formData[key]?.trim() || '';
      return acc;
    }, {}),
    agreements: AGREEMENT_FIELDS.reduce((acc, key) => {
      acc[key] = Boolean(formData[key]);
      return acc;
    }, {}),
  };
}

export async function getOrCreateApplication(user) {
  const client = requireSupabase();
  const { data: existing, error: fetchError } = await client
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    return existing;
  }

  const { data, error } = await client
    .from('applications')
    .insert({
      user_id: user.id,
      email: user.email,
      status: 'incomplete',
      school: portalConfig.allowedSchools[0],
      level_of_study: portalConfig.levelsOfStudy[0],
      graduation_year: portalConfig.graduationYears[1],
      preferred_track: portalConfig.tracks[0],
      links: {},
      responses: {},
      agreements: {},
      team_emails: [],
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveApplicationDraft(formData, application) {
  const client = requireSupabase();
  const payload = formToApplicationPayload(formData);

  const { data, error } = await client
    .from('applications')
    .update(payload)
    .eq('id', application.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function submitApplication(formData, application) {
  const client = requireSupabase();

  // Persist the latest draft content through the column-restricted update path,
  // then flip status server-side. The RPC enforces ownership, the
  // incomplete->submitted transition, and the deadline; applicants have no
  // direct write access to `status`/`submitted_at`.
  await saveApplicationDraft(formData, application);

  const { data, error } = await client.rpc('submit_application', {
    p_application_id: application.id,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadResume(file, user, applicationId) {
  const client = requireSupabase();
  const extension = file.name.split('.').pop() || 'pdf';
  const path = `${user.id}/${applicationId}/resume.${extension.toLowerCase()}`;

  const { error: uploadError } = await client.storage
    .from(portalConfig.resumeBucket)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data, error } = await client
    .from('applications')
    .update({ resume_path: path })
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function removeResume(applicationId, path) {
  const client = requireSupabase();

  if (path) {
    const { error: removeError } = await client.storage
      .from(portalConfig.resumeBucket)
      .remove([path]);

    if (removeError) {
      throw removeError;
    }
  }

  const { data, error } = await client
    .from('applications')
    .update({ resume_path: null })
    .eq('id', applicationId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listAdminApplications(filters = {}) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke(
    portalConfig.adminFunctionName,
    {
      method: 'POST',
      body: {
        action: 'list',
        filters,
      },
    },
  );

  if (error) {
    throw await toFunctionError(error);
  }

  return data.applications || [];
}

export async function updateAdminApplication(applicationId, updates) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke(
    portalConfig.adminFunctionName,
    {
      method: 'PATCH',
      body: {
        id: applicationId,
        ...updates,
      },
    },
  );

  if (error) {
    throw await toFunctionError(error);
  }

  return data.application;
}

export async function createAdminResumeUrl(path) {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke(
    portalConfig.adminFunctionName,
    {
      method: 'POST',
      body: {
        action: 'resume-url',
        resume_path: path,
      },
    },
  );

  if (error) {
    throw await toFunctionError(error);
  }

  return data.url;
}
