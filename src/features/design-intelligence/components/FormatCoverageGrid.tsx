import type { FormatCoverage } from "@/types/design-intelligence";
import { CONTENT_FORMAT_META } from "@/constants/content";

type FormatCoverageGridProps = {
  coverage: FormatCoverage[];
};

export function FormatCoverageGrid({ coverage }: FormatCoverageGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {coverage.map((entry) => {
        const meta = CONTENT_FORMAT_META[entry.format];
        const Icon = meta.icon;

        return (
          <div
            key={entry.format}
            className="flex flex-col gap-3 rounded-control border border-border bg-background p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-control bg-primary-muted text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium text-foreground">{meta.label}</p>
                <p className="text-small text-foreground-muted">{entry.total} total pieces</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-caption">
              <span className="text-foreground-secondary">
                <span className="font-medium text-foreground">{entry.inProgress}</span> in progress
              </span>
              <span className="text-foreground-secondary">
                <span className="font-medium text-success">{entry.published}</span> published
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
