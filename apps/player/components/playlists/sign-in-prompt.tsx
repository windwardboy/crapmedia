import Link from "next/link";

export function SignInPrompt({ nextPath }: { nextPath: string }) {
  return (
    <div className="cm-card p-8 text-center">
      <h2 className="text-lg font-semibold">Sign in to manage playlists</h2>
      <p className="mt-2 text-sm text-cm-text-muted">
        Playlists are saved to your account and sync across devices.
      </p>
      <Link
        href={`/settings?next=${encodeURIComponent(nextPath)}`}
        className="cm-btn cm-btn-primary mt-6 inline-flex px-6 py-2.5 text-sm"
      >
        Sign in
      </Link>
    </div>
  );
}
