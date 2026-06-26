create extension if not exists pgcrypto;

create type public.application_status as enum (
  'incomplete',
  'submitted',
  'admitted',
  'waitlisted',
  'rejected'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  status public.application_status not null default 'incomplete',
  first_name text,
  last_name text,
  phone text,
  school text,
  program text,
  level_of_study text,
  graduation_year text,
  over_18 boolean not null default false,
  can_attend_in_person boolean not null default false,
  ml_skill_level text,
  hackathon_count text,
  preferred_track text,
  maple_cup_motivation text,
  team_intent text,
  team_emails text[] not null default '{}',
  resume_path text,
  links jsonb not null default '{}'::jsonb,
  responses jsonb not null default '{}'::jsonb,
  agreements jsonb not null default '{}'::jsonb,
  admin_notes text,
  submitted_at timestamptz,
  decided_at timestamptz,
  decided_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_one_per_user unique (user_id),
  constraint applications_selected_school check (
    school is null or school in (
      'University of Toronto St. George',
      'University of Toronto Mississauga',
      'University of Toronto Scarborough',
      'University of Waterloo'
    )
  )
);

create index applications_status_idx on public.applications(status);
create index applications_school_idx on public.applications(school);
create index applications_submitted_at_idx on public.applications(submitted_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

alter table public.applications enable row level security;

create policy "Applicants can read their own application"
on public.applications
for select
to authenticated
using (user_id = auth.uid());

create policy "Applicants can create their own draft"
on public.applications
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'incomplete'
);

create policy "Applicants can update drafts before submission"
on public.applications
for update
to authenticated
using (
  user_id = auth.uid()
  and status = 'incomplete'
)
with check (
  user_id = auth.uid()
  and status in ('incomplete', 'submitted')
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 10485760, array['application/pdf'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Applicants can read their own resumes"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Applicants can upload their own resumes"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Applicants can replace their own resumes"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Applicants can remove their own resumes"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);
