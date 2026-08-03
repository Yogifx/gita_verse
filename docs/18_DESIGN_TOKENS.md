# Design Tokens

GitaVerse design tokens are CSS custom properties. They are the single source of truth for color, type, space, radius, shadow, motion, breakpoints, and stacking. Tailwind and utility classes consume these variables — never hardcode values in UI.

**Default theme:** Dark (`:root` / `data-theme="dark"`)  
**Future theme:** Light (`data-theme="light"`)

**Entry file:** `src/styles/globals.css`  
**Typed references:** `src/config/design-tokens.ts`

---

## Architecture

| Layer | Path | Role |
| --- | --- | --- |
| Primitives | `src/styles/tokens/` | Raw scales (gold, indigo, ink, space, type…) |
| Themes | `src/styles/themes/` | Semantic colors per theme |
| Utilities | `src/styles/utilities/` | Reusable role classes |
| Tailwind | `tailwind.config.ts` | Maps utilities to CSS variables |

---

## Color Tokens

### Semantic (use these in UI)

| Token | CSS variable | Meaning |
| --- | --- | --- |
| `primary` | `--color-primary` | Primary accent (gold) |
| `primary-hover` | `--color-primary-hover` | Primary hover state |
| `primary-muted` | `--color-primary-muted` | Soft primary wash |
| `secondary` | `--color-secondary` | Secondary accent (indigo) |
| `secondary-hover` | `--color-secondary-hover` | Secondary hover state |
| `secondary-muted` | `--color-secondary-muted` | Soft secondary wash |
| `background` | `--color-background` | App canvas |
| `surface` | `--color-surface` | Panels, cards, rails |
| `surface-elevated` | `--color-surface-elevated` | Raised surface |
| `muted` | `--color-muted` | Subtle fill / muted blocks |
| `success` | `--color-success` | Positive feedback |
| `success-muted` | `--color-success-muted` | Soft success wash |
| `warning` | `--color-warning` | Caution feedback |
| `warning-muted` | `--color-warning-muted` | Soft warning wash |
| `danger` | `--color-danger` | Error / destructive |
| `danger-muted` | `--color-danger-muted` | Soft danger wash |
| `textPrimary` | `--color-text-primary` | Main copy |
| `textSecondary` | `--color-text-secondary` | Supporting copy |
| `textMuted` | `--color-text-muted` | Tertiary / meta copy |
| `textInverse` | `--color-text-inverse` | Text on inverted surfaces |
| `textOnPrimary` | `--color-text-on-primary` | Text on primary fills |
| `border` | `--color-border` | Default borders |
| `borderStrong` | `--color-border-strong` | Emphasized borders |
| `gold` | `--color-gold` | Brand gold pigment |
| `indigo` | `--color-indigo` | Brand indigo pigment |
| `ring` | `--color-ring` | Focus ring color |

### Tailwind usage

```
bg-background  bg-surface  bg-primary  text-primary
text-foreground  text-foreground-secondary  text-foreground-muted
border-border  border-border-strong  text-gold  text-indigo
```

`text-primary` = brand accent. Body text uses `text-foreground` or utility `fg-primary`.

### Primitives (palette only)

Defined in `src/styles/tokens/colors.css`:

- `--gv-gold-50` … `--gv-gold-900`
- `--gv-indigo-50` … `--gv-indigo-900`
- `--gv-ink-50` … `--gv-ink-900`
- `--gv-green-*`, `--gv-amber-*`, `--gv-red-*` (feedback)

Themes map semantic tokens onto these primitives. Prefer semantic names in product UI.

---

## Theme System

### Dark (default)

Applied on `:root` and `[data-theme="dark"]`.

- Canvas: deep ink (`--gv-ink-900`)
- Surfaces: `--gv-ink-800` / `--gv-ink-700`
- Accents: gold primary, indigo secondary
- Text: warm off-white primary, cool gray secondary

### Light (future)

Activated with `data-theme="light"` on `<html>`.

- Canvas: cool mist (`--gv-ink-50`)
- Surfaces: white
- Accents: deepened gold / indigo for contrast
- Text: ink primary

No React theme provider yet — attribute switching is enough for the foundation.

---

## Typography Scale

| Role | Token | Size | Family | Utility |
| --- | --- | --- | --- | --- |
| Display | `--text-display` | 3.5rem | `--font-display` (Cormorant Garamond) | `.text-display` |
| H1 | `--text-h1` | 2.5rem | Display | `.text-h1` |
| H2 | `--text-h2` | 2rem | Display | `.text-h2` |
| H3 | `--text-h3` | 1.5rem | Sans (Outfit) | `.text-h3` |
| Body Large | `--text-body-lg` | 1.125rem | Sans | `.text-body-lg` |
| Body | `--text-body` | 1rem | Sans | `.text-body` |
| Caption | `--text-caption` | 0.875rem | Sans | `.text-caption` |
| Small | `--text-small` | 0.75rem | Sans | `.text-small` |

Supporting tokens:

| Token | Purpose |
| --- | --- |
| `--leading-display` / `--leading-heading` / `--leading-body` / `--leading-tight` / `--leading-caption` | Line height |
| `--weight-regular` … `--weight-bold` | Font weight |
| `--tracking-display` / `--tracking-heading` / `--tracking-body` / `--tracking-caption` / `--tracking-wide` | Letter spacing |
| `--font-display` / `--font-sans` / `--font-mono` | Families |

Tailwind mirrors roles: `text-display`, `text-h1`, `font-display`, `font-sans`.

---

## Spacing Tokens

4px grid. Use tokens — do not hardcode rem/px in UI.

| Token | Value |
| --- | --- |
| `--space-0` | 0 |
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-7` | 1.75rem (28px) |
| `--space-8` | 2rem (32px) |
| `--space-9` | 2.25rem (36px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-14` | 3.5rem (56px) |
| `--space-16` | 4rem (64px) |
| `--space-20` | 5rem (80px) |
| `--space-24` | 6rem (96px) |
| `--space-32` | 8rem (128px) |

Semantic aliases: `--space-section`, `--space-stack`, `--space-inline`, `--space-gutter`.

Tailwind: `p-4`, `gap-6`, `p-section`, `px-gutter`, etc.

---

## Border Radius

| Token | Value | Typical use |
| --- | --- | --- |
| `--radius-none` | 0 | Flush edges |
| `--radius-sm` | 0.25rem | Chips, tight controls |
| `--radius-md` | 0.5rem | Inputs, buttons (`--radius-control`) |
| `--radius-lg` | 0.75rem | Small panels |
| `--radius-xl` | 1rem | Panels (`--radius-panel`) |
| `--radius-2xl` | 1.25rem | Overlays (`--radius-overlay`) |
| `--radius-3xl` | 1.5rem | Large shells |
| `--radius-full` | 9999px | Avatars only — use sparingly |

---

## Shadows

Soft elevation — no glow stacks.

| Token | Use |
| --- | --- |
| `--shadow-xs` … `--shadow-xl` | Elevation scale |
| `--shadow-panel` | Default panel lift |
| `--shadow-overlay` | Modals / popovers |
| `--shadow-focus` | Focus ring using primary mix |

Values adjust per theme (stronger on dark, softer on light).

---

## Animation Durations & Easing

| Token | Value |
| --- | --- |
| `--duration-instant` | 0ms |
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 400ms |
| `--duration-slower` | 600ms |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` |
| `--ease-entrance` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

Composed: `--motion-hover`, `--motion-panel`, `--motion-page`.

Tailwind: `duration-fast`, `ease-standard`, utilities `.transition-standard`, `.transition-panel`.

---

## Breakpoints

| Token | Value | Tailwind screen |
| --- | --- | --- |
| `--breakpoint-sm` | 40rem (640px) | `sm` |
| `--breakpoint-md` | 48rem (768px) | `md` |
| `--breakpoint-lg` | 64rem (1024px) | `lg` |
| `--breakpoint-xl` | 80rem (1280px) | `xl` |
| `--breakpoint-2xl` | 96rem (1536px) | `2xl` |

---

## Z-Index

| Token | Value | Use |
| --- | --- | --- |
| `--z-base` | 0 | Default |
| `--z-raised` | 10 | Slightly raised |
| `--z-dropdown` | 100 | Menus |
| `--z-sticky` | 200 | Sticky chrome |
| `--z-overlay` | 300 | Scrims |
| `--z-modal` | 400 | Dialogs |
| `--z-toast` | 500 | Toasts |
| `--z-tooltip` | 600 | Tooltips |
| `--z-max` | 9999 | Escape hatch |

Tailwind: `z-dropdown`, `z-modal`, `z-tooltip`, etc.

---

## Utility Classes

### Typography roles

`.text-display` `.text-h1` `.text-h2` `.text-h3` `.text-body-lg` `.text-body` `.text-caption` `.text-small`

### Foreground color

`.fg-primary` `.fg-secondary` `.fg-muted` `.fg-accent` `.fg-gold` `.fg-indigo` `.fg-success` `.fg-warning` `.fg-danger`

### Surfaces & color

`.bg-background` `.bg-surface` `.bg-surface-elevated` `.bg-muted` `.bg-primary` `.bg-secondary`  
`.bg-success-muted` `.bg-warning-muted` `.bg-danger-muted`  
`.border-default` `.border-strong` `.ring-focus`

### Layout

`.stack-xs|sm|md|lg|xl` — vertical flex + token gap  
`.cluster-sm|md|lg` — wrapping horizontal cluster  
`.inset-sm|md|lg|xl` — padding  
`.section-y` `.gutter-x`

### Patterns

`.surface` `.surface-elevated` `.panel` `.divider`  
`.transition-standard` `.transition-panel`

---

## Rules

1. No hardcoded colors in product CSS/TSX — use semantic tokens.
2. No hardcoded spacing — use `--space-*` / Tailwind spacing keys.
3. Prefer typography role classes over one-off sizes.
4. Switch themes only via `data-theme`.
5. Primitives (`--gv-*`) stay in token files; UI uses `--color-*`.

---

## Related

- [Design System](./05_DESIGN_SYSTEM.md)
- `src/styles/globals.css`
- `tailwind.config.ts`
- `src/config/design-tokens.ts`
