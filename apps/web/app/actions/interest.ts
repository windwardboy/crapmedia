"use server";

import { createClient } from "@/lib/supabase/server";

export type InterestResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeInterest(
  _prev: InterestResult | null,
  formData: FormData,
): Promise<InterestResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { ok: false, error: "Enter your email address." };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "That doesn’t look like a valid email." };
  }

  const supabase = createClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Sign-ups are temporarily unavailable. Try the player directly.",
    };
  }

  const { error } = await supabase.from("interest_signups").insert({
    email,
    source: "website",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: true,
        message: "You’re already on the list — we’ll be in touch.",
      };
    }
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return {
    ok: true,
    message: "Thanks — we’ll email you when there’s news worth sharing.",
  };
}
