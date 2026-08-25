import Link from "next/link";
import type { FormatSummary } from "@/features/dashboard/types";
import { CONTENT_FORMAT_META } from "@/constants/content";
import { SectionCard } from "@/components/shared/SectionCard";

type ContentFormatGridProps = {
  summaries: FormatSummary[];
};

export function ContentFormatGrid({ summaries }: ContentFormatGridProps) {
  return (
    <SectionCard title="Content Formats" description="Every piece finds a home here.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map((summary) => {
          const meta = CONTENT_FORMAT_META[summary.format];
          const Icon = meta.icon;

          return (
            <div
              key={summary.format}
              className="flex flex-col gap-3 rounded-control border border-border bg-background p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-control bg-primary-muted text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{meta.label}</p>
                  <p className="text-small text-foreground-muted">{meta.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-caption">
                <span className="text-foreground-secondary">
                  <span className="font-medium text-foreground">{summary.pending}</span>{" "}
                  pending
                </span>
                <span className="text-foreground-secondary">
                  <span className="font-medium text-success">{summary.completed}</span>{" "}
                  completed
                </span>
              </div>

              <Link
                href={`/studio?format=${summary.format}`}
                className="mt-auto inline-flex items-center justify-center rounded-control border border-border px-3 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
              >
                View
              </Link>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
