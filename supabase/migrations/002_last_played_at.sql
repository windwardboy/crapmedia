-- Track when each playlist item was last played (for Continue listening)
alter table public.playlist_tracks
add column if not exists last_played_at timestamptz;

create index if not exists playlist_tracks_last_played_at_idx
  on public.playlist_tracks (last_played_at desc nulls last);
