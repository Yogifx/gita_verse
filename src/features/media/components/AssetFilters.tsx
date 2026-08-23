import { ASSET_LIBRARY_FILTERS, type AssetFilterKey } from "@/constants/assets";
import { cn } from "@/lib/utils/cn";

type AssetFiltersProps = {
  active: AssetFilterKey;
  onChange: (filter: AssetFilterKey) => void;
  counts: Record<string, number>;
};

export function AssetFilters({ active, onChange, counts }: AssetFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter assets by category">
      {ASSET_LIBRARY_FILTERS.map((filter) => {
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
