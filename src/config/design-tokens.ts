/**
 * GitaVerse Design Tokens — typed references for future app code.
 * Source of truth remains CSS variables in src/styles/tokens and themes.
 */

export const colorTokens = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  muted: "var(--color-muted)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  border: "var(--color-border)",
  gold: "var(--color-gold)",
  indigo: "var(--color-indigo)",
} as const;

export const typographyTokens = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  bodyLarge: "text-body-lg",
  body: "text-body",
  caption: "text-caption",
  small: "text-small",
} as const;

export const spacingTokens = {
  0: "var(--space-0)",
  1: "var(--space-1)",
  2: "var(--space-2)",
  3: "var(--space-3)",
  4: "var(--space-4)",
  5: "var(--space-5)",
  6: "var(--space-6)",
  8: "var(--space-8)",
  10: "var(--space-10)",
  12: "var(--space-12)",
  16: "var(--space-16)",
  20: "var(--space-20)",
  24: "var(--space-24)",
  32: "var(--space-32)",
  section: "var(--space-section)",
  stack: "var(--space-stack)",
  inline: "var(--space-inline)",
  gutter: "var(--space-gutter)",
} as const;

export const radiusTokens = {
  none: "var(--radius-none)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  full: "var(--radius-full)",
  control: "var(--radius-control)",
  panel: "var(--radius-panel)",
  overlay: "var(--radius-overlay)",
} as const;

export const shadowTokens = {
  none: "var(--shadow-none)",
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  panel: "var(--shadow-panel)",
  overlay: "var(--shadow-overlay)",
  focus: "var(--shadow-focus)",
} as const;

export const motionTokens = {
  duration: {
    instant: "var(--duration-instant)",
    fast: "var(--duration-fast)",
    normal: "var(--duration-normal)",
    slow: "var(--duration-slow)",
    slower: "var(--duration-slower)",
  },
  ease: {
    standard: "var(--ease-standard)",
    emphasized: "var(--ease-emphasized)",
    entrance: "var(--ease-entrance)",
    exit: "var(--ease-exit)",
  },
} as const;

export const breakpointTokens = {
  sm: "var(--breakpoint-sm)",
  md: "var(--breakpoint-md)",
  lg: "var(--breakpoint-lg)",
  xl: "var(--breakpoint-xl)",
  "2xl": "var(--breakpoint-2xl)",
} as const;

export const zIndexTokens = {
  base: "var(--z-base)",
  raised: "var(--z-raised)",
  dropdown: "var(--z-dropdown)",
  sticky: "var(--z-sticky)",
  overlay: "var(--z-overlay)",
  modal: "var(--z-modal)",
  toast: "var(--z-toast)",
  tooltip: "var(--z-tooltip)",
  max: "var(--z-max)",
} as const;

export const themes = ["dark", "light"] as const;
export type ThemeName = (typeof themes)[number];
export const defaultTheme: ThemeName = "dark";

export const designTokens = {
  color: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadow: shadowTokens,
  motion: motionTokens,
  breakpoint: breakpointTokens,
  zIndex: zIndexTokens,
  themes,
  defaultTheme,
} as const;

export default designTokens;
