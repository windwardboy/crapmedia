"use client";

import Link from "next/link";
import { useTheme, type ThemeId } from "@crapmedia/ui";

export function SkinPicker() {
  const { themeId, setThemeId, themes } = useTheme();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => setThemeId(theme.id as ThemeId)}
          className={`cm-card p-4 text-left transition ring-2 ${
            themeId === theme.id
              ? "ring-cm-accent"
              : "ring-transparent hover:ring-cm-border"
          }`}
        >
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cm-accent">
            {theme.id === themeId ? "Active" : "Skin"}
          </div>
          <div className="font-semibold">{theme.name}</div>
          <p className="mt-1 text-sm text-cm-text-muted">{theme.description}</p>
        </button>
      ))}
    </div>
  );
}

export function SkinPickerLink() {
  return (
    <Link
      href="/settings"
      className="text-sm text-cm-accent hover:underline"
    >
      Change appearance →
    </Link>
  );
}
