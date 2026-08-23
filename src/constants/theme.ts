import type { ThemeName } from "@/config/design-tokens";

export type ThemeSwatch = { label: string; variable: string };

export type ThemeOption = {
  id: ThemeName;
  label: string;
  description: string;
  status: "default" | "preview";
  swatches: ThemeSwatch[];
};

/**
 * Theme option metadata for the Theme Manager. Source of truth for the
 * colors themselves remains src/styles/themes/*.css — these are display
 * labels only, per docs/18_DESIGN_TOKENS.md.
 */
export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "dark",
    label: "Dark",
    description: "The default GitaVerse studio — deep ink canvases with restrained gold and indigo accents.",
    status: "default",
    swatches: [
      { label: "Background", variable: "--color-background" },
      { label: "Surface", variable: "--color-surface" },
      { label: "Gold", variable: "--color-gold" },
      { label: "Indigo", variable: "--color-indigo" },
    ],
  },
  {
    id: "light",
    label: "Light",
    description: "An early-preview daylight workspace with the same gold and indigo accent language.",
    status: "preview",
    swatches: [
      { label: "Background", variable: "--color-background" },
      { label: "Surface", variable: "--color-surface" },
      { label: "Gold", variable: "--color-gold" },
      { label: "Indigo", variable: "--color-indigo" },
    ],
  },
];

/** Semantic token reference shown in the Theme Manager, per docs/18_DESIGN_TOKENS.md. */
export const THEME_TOKEN_REFERENCE: ThemeSwatch[] = [
  { label: "Primary (Gold)", variable: "--color-primary" },
  { label: "Secondary (Indigo)", variable: "--color-secondary" },
  { label: "Background", variable: "--color-background" },
  { label: "Surface", variable: "--color-surface" },
  { label: "Border", variable: "--color-border" },
  { label: "Text Primary", variable: "--color-text-primary" },
  { label: "Text Secondary", variable: "--color-text-secondary" },
  { label: "Success", variable: "--color-success" },
  { label: "Warning", variable: "--color-warning" },
  { label: "Danger", variable: "--color-danger" },
];
