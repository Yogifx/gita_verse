import { CONTENT_LIBRARY_FILTERS, type ContentFilterKey } from "@/constants/content";
import { cn } from "@/lib/utils/cn";

type ContentFilterBarProps = {
  active: ContentFilterKey;
  onChange: (filter: ContentFilterKey) => void;
  counts: Record<string, number>;
};

export function ContentFilterBar({ active, onChange, counts }: ContentFilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter content by type or status"
    >
      {CONTENT_LIBRARY_FILTERS.map((filter) => {
        const isActive = filter.key === active;
        const count = counts[filter.key] ?? 0;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onChange(filter.key)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-medium transition-colors duration-fast",
              isActive
                ? "border-primary bg-primary-muted text-gold"
                : "border-border bg-surface text-foreground-secondary hover:bg-muted hover:text-foreground",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-small",
                isActive ? "bg-primary/20 text-gold" : "bg-muted text-foreground-muted",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
