"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthSection({
  user,
  nextPath = "/settings",
}: {
  user: User | null;
  nextPath?: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function signInWithGoogle() {
    const next = encodeURIComponent(nextPath);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0">
          <p className="font-medium truncate">{user.email}</p>
          {user.user_metadata?.full_name ? (
            <p className="text-sm text-cm-text-muted">
              {user.user_metadata.full_name}
            </p>
          ) : null}
        </div>
        <button type="button" onClick={signOut} className="cm-btn-ghost text-sm">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-cm-text-muted">
        Sign in to save playlists and sync across devices.
      </p>
      <button
        type="button"
        onClick={signInWithGoogle}
        className="cm-btn-primary px-6 py-2.5 text-sm"
      >
        Sign in with Google
      </button>
    </div>
  );
}
