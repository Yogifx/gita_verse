import { THEME_TOKEN_REFERENCE } from "@/constants/theme";

/** Reads live CSS variables, so it always reflects the currently active theme. */
export function ThemeTokenReference() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {THEME_TOKEN_REFERENCE.map((token) => (
        <div
          key={token.variable}
          className="flex items-center gap-3 rounded-control border border-border bg-background px-3 py-2"
        >
          <span
            className="h-6 w-6 shrink-0 rounded-control border border-border"
            style={{ backgroundColor: `var(${token.variable})` }}
            aria-hidden
          />
          <div className="min-w-0">
            <p className="truncate text-caption font-medium text-foreground">{token.label}</p>
            <p className="truncate font-mono text-small text-foreground-muted">{token.variable}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
