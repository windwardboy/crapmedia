import { AppNav } from "@/components/app-nav";
import { SkinPicker } from "@/components/skin-picker";

export default function SettingsPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-cm-text-muted">
          Phase 0 — appearance only. Auth and playlists arrive in Phase 1.
        </p>

        <section className="mt-8">
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
      </main>
    </>
  );
}
