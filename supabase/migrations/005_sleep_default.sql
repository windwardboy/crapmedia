-- Default playlist for Sleep mode (separate from driving default)
alter table public.playlists
add column if not exists is_sleep_default boolean not null default false;

create index if not exists playlists_user_sleep_default_idx
  on public.playlists (user_id)
  where is_sleep_default = true;
