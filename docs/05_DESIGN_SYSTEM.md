# Design System

## Brand Direction

GitaVerse is a calm, scholarly creative workspace. Visual language balances sacred restraint with modern tooling: deep ink canvases, gold as the primary accent, indigo as the secondary accent. Avoid generic purple gradients and glow-heavy effects.

## Color Palette

Semantic tokens only in UI. See [Design Tokens](./18_DESIGN_TOKENS.md).

- **Primary:** Gold
- **Secondary:** Indigo
- **Neutrals:** Ink scale
- **Feedback:** Success, Warning, Danger

Dark theme is default. Light theme is prepared via `data-theme="light"`.

## Typography

- **Display / H1 / H2:** Cormorant Garamond (`--font-display`)
- **H3 / Body / Caption / Small:** Outfit (`--font-sans`)
- **Mono:** IBM Plex Mono (`--font-mono`)

Roles: Display, H1, H2, H3, Body Large, Body, Caption, Small.

## Spacing

4px grid via `--space-*`. Semantic aliases: section, stack, inline, gutter.

## Motion

Durations: fast (150ms), normal (250ms), slow (400ms). Standard and emphasized easings. Prefer intentional presence over decorative noise.

## Components

Not built yet. Future shadcn/ui primitives must consume design tokens.

## Iconography

TBD — stroke icons aligned to indigo/gold ink, no emoji as UI.

## Accessibility

- Focus rings use `--color-ring` / `--shadow-focus`
- Text contrast targets WCAG AA on both themes
- Prefer `fg-*` / `text-foreground*` over low-contrast custom colors

## Implementation

| Asset | Path |
| --- | --- |
| Globals | `src/styles/globals.css` |
| Tokens | `src/styles/tokens/` |
| Themes | `src/styles/themes/` |
| Utilities | `src/styles/utilities/` |
| Tailwind | `tailwind.config.ts` |
| Typed map | `src/config/design-tokens.ts` |
| Token docs | [18_DESIGN_TOKENS.md](./18_DESIGN_TOKENS.md) |
