"use client";

import { useActionState } from "react";
import {
  subscribeInterest,
  type InterestResult,
} from "@/app/actions/interest";

export function InterestForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState<
    InterestResult | null,
    FormData
  >(subscribeInterest, null);

  return (
    <div className={compact ? "" : "cm-card p-6 sm:p-8"}>
      {!compact ? (
        <div className="mb-5">
          <h2 className="text-xl font-bold">Get launch updates</h2>
          <p className="mt-2 text-sm text-cm-text-muted">
            The player is in early access. Leave your email if you want a
            heads-up when remote library support and other features land — no
            spam, no account required.
          </p>
        </div>
      ) : null}

      <form action={action} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="interest-email">
          Email address
        </label>
        <input
          id="interest-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-cm-border bg-cm-bg px-4 py-3 text-sm outline-none focus:border-cm-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="cm-btn-primary shrink-0 px-6 py-3 text-sm disabled:opacity-60"
        >
          {pending ? "Saving…" : "Notify me"}
        </button>
      </form>

      {state ? (
        <p
          role="status"
          className={`mt-3 text-sm ${state.ok ? "text-cm-accent" : "text-red-400"}`}
        >
          {state.ok ? state.message : state.error}
        </p>
      ) : null}
    </div>
  );
}
