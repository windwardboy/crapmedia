export function youtubePlayerErrorMessage(code: number): string {
  switch (code) {
    case 2:
      return "Invalid video request. Try skipping to the next track.";
    case 5:
      return "Playback failed in your browser. Try another track.";
    case 100:
      return "This video was removed or is private.";
    case 101:
    case 150:
      return "This video can't be played here (embedding is restricted by the owner).";
    default:
      return "Playback error. Try skipping to the next track.";
  }
}
