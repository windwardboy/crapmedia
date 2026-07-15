-- CrapMedia: marketing interest sign-ups (crapmedia.com)
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.interest_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  constraint interest_signups_email_unique unique (email),
  constraint interest_signups_email_format check (
    email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  )
);

create index if not exists interest_signups_created_at_idx
  on public.interest_signups (created_at desc);

alter table public.interest_signups enable row level security;

-- Anonymous visitors can submit an email; they cannot read the list.
create policy "Anyone can subscribe"
  on public.interest_signups
  for insert
  to anon, authenticated
  with check (true);
