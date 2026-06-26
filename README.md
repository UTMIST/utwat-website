# Battle of the Schools Website

Single-page event website plus a Supabase-backed admissions portal for BOTS 2026.

## Routes

- `/` - current public landing page.
- `/apply` - applicant admissions portal.
- `/apply/admin` - organizer admissions console.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` before using the portal.

## Supabase Setup

Apply the migration in `supabase/migrations/202606200001_admissions_portal.sql`, then deploy the `admin-applications` Edge Function.

The function needs these secrets:

```bash
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL_ALLOWLIST=organizer1@example.com,organizer2@example.com
```

Applicants authenticate with passwordless email OTP. Admin access is granted only to authenticated users whose email is in `ADMIN_EMAIL_ALLOWLIST`.
