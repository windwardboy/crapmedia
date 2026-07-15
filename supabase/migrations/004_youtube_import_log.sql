-- CrapMedia: YouTube import usage logging (API quota protection)
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.youtube_import_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null check (
    action in ('add_video', 'import_playlist', 'embed_sync')
  ),
  video_count integer not null check (video_count > 0),
  created_at timestamptz not null default now()
);

create index if not exists youtube_import_log_user_created_idx
  on public.youtube_import_log (user_id, created_at desc);

create index if not exists youtube_import_log_created_idx
  on public.youtube_import_log (created_at desc);

alter table public.youtube_import_log enable row level security;

create policy "Users log own youtube imports"
  on public.youtube_import_log
  for insert
  to authenticated
  with check (auth.uid () = user_id);

create policy "Users read own import usage"
  on public.youtube_import_log
  for select
  to authenticated
  using (auth.uid () = user_id);
