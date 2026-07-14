"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import charcoalMeta from "../themes/charcoal/theme.json";
import stoneMeta from "../themes/stone/theme.json";
import {
  BUNDLED_THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "./themes";

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  description: string;
  author: string;
  version: string;
  default?: boolean;
};

const THEME_META: Record<ThemeId, ThemeMeta> = {
  charcoal: charcoalMeta as ThemeMeta,
  stone: stoneMeta as ThemeMeta,
};

type ThemeContextValue = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themes: ThemeMeta[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && isThemeId(stored)) return stored;
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setThemeIdState(readStoredTheme());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }, [themeId, ready]);

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
  }, []);

  const themes = useMemo(
    () => BUNDLED_THEMES.map((t) => THEME_META[t.id]),
    []
  );

  const value = useMemo(
    () => ({ themeId, setThemeId, themes }),
    [themeId, setThemeId, themes]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
