import { redirect } from "next/navigation";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { AuthSection } from "@/components/auth-section";
import { SkinPicker } from "@/components/skin-picker";
import { isAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const params = await searchParams;
  const authError = params.auth === "error";
  const nextPath =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/settings";

  if (user && params.next?.startsWith("/") && !params.next.startsWith("//")) {
    redirect(params.next);
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-cm-text-muted">
          Account, appearance, and support.
        </p>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Account</h2>
          {authError ? (
            <p className="mb-4 text-sm text-red-400">
              Sign-in failed. Please try again.
            </p>
          ) : null}
          {!user && params.next ? (
            <p className="mb-4 text-sm text-cm-text-muted">
              Sign in to continue to {params.next}.
            </p>
          ) : null}
          <AuthSection user={user} nextPath={nextPath} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Appearance</h2>
          <SkinPicker />
        </section>

        <section className="mt-10 cm-card p-6">
          <h2 className="font-semibold">Support CrapMedia</h2>
          <p className="mt-2 text-sm text-cm-text-muted">
            Free and donation-supported. Ko-fi / Buy Me a Coffee link coming in
            Phase 3.
          </p>
        </section>

        {isAdminUser(user) ? (
          <section className="mt-10">
            <Link
              href="/admin"
              className="cm-card block p-6 transition hover:border-cm-accent"
            >
              <h2 className="font-semibold">Admin dashboard</h2>
              <p className="mt-2 text-sm text-cm-text-muted">
                Users, imports, and interest sign-ups.
              </p>
            </Link>
          </section>
        ) : null}
      </main>
    </>
  );
}
