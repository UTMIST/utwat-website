# Admissions Portal — Security Hardening Spec

Status: implementation in progress
Date: 2026-06-28
Scope: BOTS 2026 application portal (Supabase + React SPA)

This document specifies the changes made to close the findings from the
adversarial review of the admissions portal. It is the source of truth for what
was changed in code/SQL and what is left as an operational (dashboard/infra)
task that cannot be fixed in this repo.

---

## Threat model recap

- **Applicants** authenticate via Supabase magic-link OTP and get an
  `authenticated` JWT. They can call the Supabase REST/Storage API directly with
  the public anon key + their JWT — so **client-side validation is not a security
  boundary**. Everything an applicant is allowed to do must be enforced by RLS,
  column grants, triggers, and RPCs.
- **Organizers (admins)** are an email allowlist enforced inside the
  `admin-applications` edge function, which uses the service-role key. Admins are
  the only path to bulk applicant PII, so compromising an admin session = full
  PII breach.

---

## Findings being fixed in code/SQL

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | Critical | Stored XSS in admin console via applicant-controlled `links` rendered as raw `<a href>` (e.g. `javascript:`/`data:`) → admin session takeover | `safeHref()` allowlist at render (admin) **and** DB-level link scheme validation trigger |
| 2 | High | RLS `UPDATE`/`INSERT` are row-level only; applicants could write `email`, `admin_notes`, `decided_by`, `decided_at`, `submitted_at`, `status`(*), `resume_path` of any-folder | Column-level `GRANT`s restrict applicant writes to draft content columns only; identity forced by trigger; status/submit moved to RPC |
| 3 | Medium-High | Deadline enforced only client-side; late submit/edit via direct API | `submit_application` RPC enforces deadline + ownership + status server-side |
| 4 | Medium | CSV/formula injection in admin export | `csvEscape()` neutralizes leading `= + - @ \t \r` |
| 5 | Medium | Storage-abuse / oversized payloads (unbounded text + JSONB) | Length `CHECK` constraints on text/JSONB columns + team_emails cardinality cap |
| 6 | Low | PostgREST `.or` filter injection in admin search input | Strip filter metacharacters + length-cap the search term in the edge function |
| 7 | Low | Resume-path pointer spoofing (point `resume_path` at another user's folder) | Trigger enforces `resume_path` begins with caller's own `auth.uid()/` |
| 8 | Low | CORS `*` on edge function | Configurable origin allowlist via `ADMIN_ALLOWED_ORIGINS` env (falls back to `*` to avoid breakage) |

(*) Self-promotion to `admitted` was already blocked by the existing `WITH CHECK`;
the column lockdown additionally removes `status` from the applicant write surface
entirely (status now only changes via the RPC or the admin function).

---

## What is intentionally NOT changed in code (operational / your call)

These are real and were called out in the review, but they are dashboard/infra or
product-policy decisions, not repo code. They are **required before launch** but
must be done by you:

- **O-1 (launch blocker) — Production email/SMTP.** The built-in Supabase email
  sender is rate-limited and not for production. Configure a custom SMTP provider
  (Resend/SendGrid/SES) and raise the auth email rate limits before opening to
  thousands of applicants. Without this, magic links silently stop delivering
  under load.
- **O-2 — Auth CAPTCHA.** Enable Supabase Auth CAPTCHA (Cloudflare Turnstile /
  hCaptcha) to throttle Sybil/sock-puppet account creation (plus-addressing makes
  one mailbox into unlimited accounts). Requires passing a captcha token from
  `AuthPanel` to `signInWithOtp({ options: { captchaToken } })`; left out of this
  pass because it hard-breaks sign-in until the provider keys are configured.
- **O-3 — Email-domain eligibility.** The portal lets anyone pick any school. A
  hard domain allowlist would reject the many applicants who use personal emails,
  so it is a product decision and is **not** silently enforced here. If you want
  it, we add it as an explicit, documented validation.
- **O-4 — Capacity / tier.** Plan Supabase Pro: resumes (up to 10 MB each ×
  thousands) will exceed free-tier storage, and the admin page currently loads all
  rows client-side. Add admin pagination once row counts grow.
- **O-5 — Tighten CORS env.** Set `ADMIN_ALLOWED_ORIGINS` to your real Vercel
  origin(s) once known (see fix #8).

---

## Detailed changes

### A. New migration: `supabase/migrations/202606280001_admissions_security_hardening.sql`

1. **Column privilege lockdown** for the `authenticated` role on
   `public.applications`:
   - `REVOKE INSERT, UPDATE` then `GRANT` only the draft-content columns
     (`first_name … agreements`, `team_emails`, `links`, `responses`,
     `resume_path`, plus `user_id`/`email`/`status` on INSERT only).
   - Removes `admin_notes`, `decided_at`, `decided_by`, `submitted_at`,
     `created_at`, `updated_at` from the applicant write surface entirely, and
     removes `status` from UPDATE (INSERT still allowed because RLS forces it to
     `incomplete`).

2. **`enforce_application_rules()` BEFORE INSERT OR UPDATE trigger:**
   - Skips all checks when `auth.uid()` is `NULL` (service-role / admin function
     path is trusted).
   - On INSERT: forces `user_id = auth.uid()` and `email` = JWT email claim, so a
     hand-crafted insert cannot spoof identity.
   - Validates every value in `links` JSONB is empty or matches `^https?://`
     (kills `javascript:`/`data:` payloads at the DB, defense-in-depth behind
     fix #1).
   - Validates `resume_path`, when present, begins with `<auth.uid()>/` (fix #7).

3. **`submit_application(p_application_id uuid)` SECURITY DEFINER RPC** (fix #3):
   - Requires auth, rejects when `now() > deadline` (deadline constant must match
     `portalConfig.applicationDeadlineIso`), and only flips an
     `incomplete` row owned by the caller to `submitted` + sets `submitted_at`.
   - `EXECUTE` granted to `authenticated`, revoked from `public`/`anon`.

4. **Length `CHECK` constraints** (fix #5) on free-text columns
   (`first_name`, `last_name`, `phone`, `program`, `maple_cup_motivation`) and on
   the serialized size of `links`/`responses`/`agreements` JSONB, plus a
   `team_emails` cardinality cap.

### B. `src/admissions/applicationService.js` (fix #2/#3 client side)

- `formToApplicationPayload(formData)` returns **content columns only** — no
  `user_id`, `email`, `status`, or `updated_at` (those are server-owned now).
- `saveApplicationDraft(formData, application)` updates content columns only.
- `submitApplication(formData, application)` saves the draft content, then calls
  the `submit_application` RPC to transition status server-side.
- `uploadResume` / `removeResume` no longer send `updated_at` (DB trigger owns it).
- Callers in `AdmissionsPage.jsx` updated to the new signatures.

### C. `src/pages/AdmissionsAdminPage.jsx`

- Add `safeHref(value)` — returns the URL only if it parses as `http:`/`https:`,
  else `null`. Link rendering uses it: safe URLs become anchors, anything else is
  shown as inert text (fix #1).
- `csvEscape()` prefixes a leading `= + - @ \t \r` with `'` before quoting (fix #4).

### D. `supabase/functions/admin-applications/index.ts`

- Sanitize `filters.search`: strip PostgREST metacharacters (`, ( ) * \` and
  similar), trim, and cap length before building the `.or()` ilike filter (fix #6).
- CORS: build `Access-Control-Allow-Origin` from `ADMIN_ALLOWED_ORIGINS`
  (comma-separated env). If the request `Origin` matches, echo it with
  `Vary: Origin`; if the env is unset, fall back to `*` so nothing breaks before
  you configure it (fix #8).

---

## Post-deploy verification checklist

- [ ] `npm run lint` and `npm run build` pass.
- [ ] Apply migration: `supabase db push` (or run the SQL in the dashboard).
- [ ] Redeploy edge function: `supabase functions deploy admin-applications`.
- [ ] As an applicant: save draft, upload resume, submit — all succeed; the
      submitted app locks.
- [ ] Direct-API negative tests (expect failure): PATCH own `status=admitted`;
      PATCH `admin_notes`/`email`/`submitted_at`; set `links.x="javascript:1"`;
      set `resume_path="<otheruid>/x"`; submit after deadline.
- [ ] Admin console: applicant-supplied non-http link renders as inert text;
      CSV export of a `=1+1` name opens inertly in Excel/Sheets.
- [ ] Set `ADMIN_ALLOWED_ORIGINS` and (O-1) custom SMTP + (O-2) CAPTCHA before
      public launch.
