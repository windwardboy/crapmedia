-- CrapMedia Phase 1: playlists + tracks
-- Run in Supabase Dashboard → SQL Editor → New query → Run

-- Playlists
create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 200),
  description text,
  is_driving_default boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists playlists_user_id_idx on public.playlists (user_id);

-- Tracks (YouTube / remote — populated in Phase 1B)
create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  position integer not null default 0 check (position >= 0),
  source_type text not null check (source_type in ('youtube', 'remote')),
  source_ref jsonb not null default '{}'::jsonb,
  title text not null default 'Untitled',
  artist text,
  duration_sec integer,
  thumbnail_url text,
  last_position_sec integer not null default 0 check (last_position_sec >= 0),
  created_at timestamptz not null default now()
);

create index if not exists playlist_tracks_playlist_id_idx
  on public.playlist_tracks (playlist_id);

create unique index if not exists playlist_tracks_playlist_position_uidx
  on public.playlist_tracks (playlist_id, position);

-- updated_at trigger
create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists playlists_set_updated_at on public.playlists;

create trigger playlists_set_updated_at
before update on public.playlists
for each row
execute function public.set_updated_at ();

-- Row Level Security
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;

-- Playlists: own rows only
create policy "Users read own playlists"
  on public.playlists for select
  using (auth.uid () = user_id);

create policy "Users insert own playlists"
  on public.playlists for insert
  with check (auth.uid () = user_id);

create policy "Users update own playlists"
  on public.playlists for update
  using (auth.uid () = user_id)
  with check (auth.uid () = user_id);

create policy "Users delete own playlists"
  on public.playlists for delete
  using (auth.uid () = user_id);

-- Tracks: via playlist ownership
create policy "Users read own playlist tracks"
  on public.playlist_tracks for select
  using (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id and p.user_id = auth.uid ()
    )
  );

create policy "Users insert own playlist tracks"
  on public.playlist_tracks for insert
  with check (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id and p.user_id = auth.uid ()
    )
  );

create policy "Users update own playlist tracks"
  on public.playlist_tracks for update
  using (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id and p.user_id = auth.uid ()
    )
  );

create policy "Users delete own playlist tracks"
  on public.playlist_tracks for delete
  using (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id and p.user_id = auth.uid ()
    )
  );
