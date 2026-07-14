const VIDEO_ID_RE = /^[\w-]{11}$/;

export function parseVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (VIDEO_ID_RE.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return VIDEO_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID_RE.test(v)) return v;

      const embed = url.pathname.match(/^\/embed\/([\w-]{11})/);
      if (embed) return embed[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function parsePlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const list = url.searchParams.get("list");
    if (list && list.startsWith("PL") && list.length > 10) {
      return list;
    }
  } catch {
    if (trimmed.startsWith("PL") && trimmed.length > 10) {
      return trimmed;
    }
  }

  return null;
}
