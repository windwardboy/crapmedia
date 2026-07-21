export type SourceType = "youtube" | "remote";

export type Playlist = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_driving_default: boolean;
  is_sleep_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PlaylistTrack = {
  id: string;
  playlist_id: string;
  position: number;
  source_type: SourceType;
  source_ref: Record<string, unknown>;
  title: string;
  artist: string | null;
  duration_sec: number | null;
  thumbnail_url: string | null;
  last_position_sec: number;
  last_played_at: string | null;
  created_at: string;
};

export type PlaylistWithTrackCount = Playlist & {
  track_count: number;
};
