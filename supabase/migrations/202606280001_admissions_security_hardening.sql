-- Admissions portal security hardening.
-- Closes findings from the adversarial review:
--   * Applicants could write server-owned columns (email, admin_notes,
--     decided_*, submitted_at, status, arbitrary resume_path) via the REST API.
--   * Applicant-controlled `links` could carry javascript:/data: payloads that
--     execute in the admin console (stored XSS).
--   * Deadline was only enforced client-side.
--   * Unbounded text / JSONB enabled storage-abuse.
-- See docs/admissions-security-hardening.md.

-- ---------------------------------------------------------------------------
-- 1. Column-level write lockdown for the `authenticated` role.
--    RLS is row-level only; without this an applicant can PATCH any column of
--    their own row. We restrict applicant writes to draft-content columns.
--    The service_role (admin edge function) is unaffected.
-- ---------------------------------------------------------------------------
revoke insert, update on public.applications from authenticated;

-- INSERT: identity columns are accepted but overwritten by the trigger below;
-- `status` is allowed because the RLS WITH CHECK forces it to 'incomplete'.
grant insert (
  user_id,
  email,
  status,
  first_name,
  last_name,
  phone,
  school,
  program,
  level_of_study,
  graduation_year,
  over_18,
  can_attend_in_person,
  ml_skill_level,
  hackathon_count,
  preferred_track,
  maple_cup_motivation,
  team_intent,
  team_emails,
  links,
  responses,
  agreements,
  resume_path
) on public.applications to authenticated;

-- UPDATE: draft content only. No status, email, user_id, submitted_at,
-- admin_notes, decided_*, created_at, updated_at (those are server-owned).
grant update (
  first_name,
  last_name,
  phone,
  school,
  program,
  level_of_study,
  graduation_year,
  over_18,
  can_attend_in_person,
  ml_skill_level,
  hackathon_count,
  preferred_track,
  maple_cup_motivation,
  team_intent,
  team_emails,
  links,
  responses,
  agreements,
  resume_path
) on public.applications to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Enforce identity + validate links / resume_path at the DB layer.
--    Runs for every applicant insert/update. Skipped for the service_role /
--    no-JWT path (auth.uid() is null) since that path is trusted.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_application_rules()
returns trigger
language plpgsql
as $$
declare
  uid uuid := auth.uid();
  claim_email text;
  link_value text;
begin
  -- Trusted backend (service role / no JWT): skip applicant-side enforcement.
  if uid is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- Never trust client-supplied identity columns.
    new.user_id := uid;
    claim_email :=
      nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email';
    if claim_email is not null then
      new.email := claim_email;
    end if;
  end if;

  -- Every link must be empty or an http(s) URL. Blocks javascript:/data: XSS
  -- payloads that would otherwise render as anchors in the admin console.
  if new.links is not null then
    for link_value in select value from jsonb_each_text(new.links)
    loop
      if link_value is not null
         and length(btrim(link_value)) > 0
         and lower(btrim(link_value)) !~ '^https?://' then
        raise exception
          'Links must be empty or start with http:// or https://';
      end if;
    end loop;
  end if;

  -- A resume can only point at the caller's own storage folder.
  if new.resume_path is not null
     and position((uid::text || '/') in new.resume_path) <> 1 then
    raise exception 'resume_path must be within your own folder';
  end if;

  return new;
end;
$$;

create trigger applications_enforce_rules
before insert or update on public.applications
for each row
execute function public.enforce_application_rules();

-- ---------------------------------------------------------------------------
-- 3. Server-side submission: enforces ownership, status, and the deadline.
--    Applicants no longer have UPDATE on `status`/`submitted_at`, so this is
--    the only way to submit. SECURITY DEFINER bypasses the column lockdown but
--    re-checks ownership explicitly.
--    NOTE: keep `deadline` in sync with portalConfig.applicationDeadlineIso.
-- ---------------------------------------------------------------------------
create or replace function public.submit_application(p_application_id uuid)
returns public.applications
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  deadline timestamptz := '2026-07-15T23:59:00-04:00';
  result public.applications;
begin
  if uid is null then
    raise exception 'Authentication required.';
  end if;

  if now() > deadline then
    raise exception 'The application deadline has passed.';
  end if;

  update public.applications
  set status = 'submitted',
      submitted_at = now()
  where id = p_application_id
    and user_id = uid
    and status = 'incomplete'
  returning * into result;

  if not found then
    raise exception
      'Application not found, not owned by you, or already submitted.';
  end if;

  return result;
end;
$$;

revoke all on function public.submit_application(uuid) from public;
grant execute on function public.submit_application(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Size caps to curb storage-abuse via unbounded text / JSONB.
-- ---------------------------------------------------------------------------
alter table public.applications
  add constraint applications_first_name_len
    check (first_name is null or char_length(first_name) <= 200),
  add constraint applications_last_name_len
    check (last_name is null or char_length(last_name) <= 200),
  add constraint applications_phone_len
    check (phone is null or char_length(phone) <= 50),
  add constraint applications_program_len
    check (program is null or char_length(program) <= 300),
  add constraint applications_maple_cup_len
    check (maple_cup_motivation is null
           or char_length(maple_cup_motivation) <= 5000),
  add constraint applications_links_size
    check (char_length(links::text) <= 3000),
  add constraint applications_responses_size
    check (char_length(responses::text) <= 20000),
  add constraint applications_agreements_size
    check (char_length(agreements::text) <= 2000),
  add constraint applications_team_emails_count
    check (cardinality(team_emails) <= 20);
