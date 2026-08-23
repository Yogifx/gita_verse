import type { PlatformCoverage } from "@/types/design-intelligence";
import { PLATFORM_META } from "@/constants/content";

type PlatformCoverageListProps = {
  coverage: PlatformCoverage[];
};

export function PlatformCoverageList({ coverage }: PlatformCoverageListProps) {
  const max = Math.max(1, ...coverage.map((entry) => entry.count));

  return (
    <div className="flex flex-col gap-2.5">
      {coverage.map((entry) => (
        <div key={entry.platform} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-caption text-foreground-secondary">
            {PLATFORM_META[entry.platform].label}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${(entry.count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-caption text-foreground-muted">
            {entry.count}
          </span>
        </div>
      ))}
    </div>
  );
}
