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

export function formToApplicationPayload(formData, user, extra = {}) {
  return {
    user_id: user.id,
    email: user.email,
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
    ...extra,
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

export async function saveApplicationDraft(formData, user, application) {
  const client = requireSupabase();
  const payload = formToApplicationPayload(formData, user, {
    id: application.id,
    status: 'incomplete',
    updated_at: new Date().toISOString(),
  });

  const { data, error } = await client
    .from('applications')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function submitApplication(formData, user, application) {
  const client = requireSupabase();
  const payload = formToApplicationPayload(formData, user, {
    id: application.id,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { data, error } = await client
    .from('applications')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

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
    .update({
      resume_path: path,
      updated_at: new Date().toISOString(),
    })
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
    .update({
      resume_path: null,
      updated_at: new Date().toISOString(),
    })
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
    throw error;
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
    throw error;
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
    throw error;
  }

  return data.url;
}
