import type { Config } from "tailwindcss";

/**
 * GitaVerse Tailwind integration
 * All theme values resolve to CSS variables — no hardcoded colors or spacing.
 */
const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          muted: "var(--color-primary-muted)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          muted: "var(--color-secondary-muted)",
        },
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
        },
        muted: "var(--color-muted)",
        success: {
          DEFAULT: "var(--color-success)",
          muted: "var(--color-success-muted)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          muted: "var(--color-warning-muted)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          muted: "var(--color-danger-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        gold: "var(--color-gold)",
        indigo: "var(--color-indigo)",
        ring: "var(--color-ring)",
        foreground: {
          DEFAULT: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
          "on-primary": "var(--color-text-on-primary)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        display: [
          "var(--text-display)",
          {
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
            fontWeight: "var(--weight-medium)",
          },
        ],
        h1: [
          "var(--text-h1)",
          {
            lineHeight: "var(--leading-heading)",
            letterSpacing: "var(--tracking-heading)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h2: [
          "var(--text-h2)",
          {
            lineHeight: "var(--leading-heading)",
            letterSpacing: "var(--tracking-heading)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        h3: [
          "var(--text-h3)",
          {
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-heading)",
            fontWeight: "var(--weight-semibold)",
          },
        ],
        "body-lg": [
          "var(--text-body-lg)",
          {
            lineHeight: "var(--leading-body)",
            letterSpacing: "var(--tracking-body)",
          },
        ],
        body: [
          "var(--text-body)",
          {
            lineHeight: "var(--leading-body)",
            letterSpacing: "var(--tracking-body)",
          },
        ],
        caption: [
          "var(--text-caption)",
          {
            lineHeight: "var(--leading-caption)",
            letterSpacing: "var(--tracking-caption)",
          },
        ],
        small: [
          "var(--text-small)",
          {
            lineHeight: "var(--leading-caption)",
            letterSpacing: "var(--tracking-caption)",
          },
        ],
      },
      spacing: {
        0: "var(--space-0)",
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        14: "var(--space-14)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        32: "var(--space-32)",
        section: "var(--space-section)",
        stack: "var(--space-stack)",
        inline: "var(--space-inline)",
        gutter: "var(--space-gutter)",
      },
      borderRadius: {
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
      },
      boxShadow: {
        none: "var(--shadow-none)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        panel: "var(--shadow-panel)",
        overlay: "var(--shadow-overlay)",
        focus: "var(--shadow-focus)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        emphasized: "var(--ease-emphasized)",
        entrance: "var(--ease-entrance)",
        exit: "var(--ease-exit)",
      },
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
        max: "var(--z-max)",
      },
    },
  },
  plugins: [],
};

export default config;
