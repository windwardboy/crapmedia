import manifest from "../themes/manifest.json";

export type ThemeId = "charcoal" | "stone";

export const BUNDLED_THEMES = manifest.bundled as Array<{
  id: ThemeId;
  default: boolean;
}>;

export const DEFAULT_THEME: ThemeId =
  BUNDLED_THEMES.find((t) => t.default)?.id ?? "charcoal";

export const THEME_STORAGE_KEY = "cm-theme";

export function isThemeId(value: string): value is ThemeId {
  return BUNDLED_THEMES.some((t) => t.id === value);
}

export { ThemeProvider, useTheme } from "./theme-provider";
export type { ThemeMeta } from "./theme-provider";
export { WaveBars } from "./wave-bars";
