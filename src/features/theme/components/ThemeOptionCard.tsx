import { Check } from "lucide-react";
import type { ThemeOption } from "@/constants/theme";
import { cn } from "@/lib/utils/cn";

type ThemeOptionCardProps = {
  option: ThemeOption;
  active: boolean;
  onSelect: (id: ThemeOption["id"]) => void;
};

export function ThemeOptionCard({ option, active, onSelect }: ThemeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-4 rounded-panel border p-4 text-left transition-colors duration-fast",
        active
          ? "border-primary bg-primary-muted/40"
          : "border-border bg-surface hover:bg-muted",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{option.label}</p>
          <p className="mt-1 text-caption text-foreground-secondary">{option.description}</p>
        </div>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            active ? "border-primary bg-primary text-foreground-on-primary" : "border-border text-transparent",
          )}
          aria-hidden
        >
          <Check className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* data-theme scopes the CSS variables locally so each card shows its
          true palette regardless of which theme is currently active. */}
      <div
        data-theme={option.id}
        className="flex overflow-hidden rounded-control border border-border"
      >
        {option.swatches.map((swatch) => (
          <span
            key={swatch.variable}
            title={swatch.label}
            className="h-8 flex-1"
            style={{ backgroundColor: `var(${swatch.variable})` }}
          />
        ))}
      </div>

      <span className="text-small font-medium uppercase tracking-wide text-foreground-muted">
        {option.status === "default" ? "Default" : "Early preview"}
      </span>
    </button>
  );
}
