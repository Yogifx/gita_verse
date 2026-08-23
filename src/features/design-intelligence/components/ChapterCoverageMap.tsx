import type { ChapterCoverage } from "@/types/design-intelligence";
import { CHAPTER_COVERAGE_THRESHOLDS } from "@/constants/design-intelligence";
import { cn } from "@/lib/utils/cn";

type ChapterCoverageMapProps = {
  coverage: ChapterCoverage[];
};

function toneClasses(count: number): string {
  if (count >= CHAPTER_COVERAGE_THRESHOLDS.strong) {
    return "border-primary bg-primary-muted text-gold";
  }
  if (count >= CHAPTER_COVERAGE_THRESHOLDS.light) {
    return "border-secondary-muted bg-secondary-muted text-indigo";
  }
  return "border-dashed border-border bg-background text-foreground-muted";
}

export function ChapterCoverageMap({ coverage }: ChapterCoverageMapProps) {
  const byChapter = [...coverage].sort((a, b) => a.chapter - b.chapter);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {byChapter.map((entry) => (
        <div
          key={entry.chapter}
          title={`Chapter ${entry.chapter} — ${entry.title}: ${entry.count} piece${entry.count === 1 ? "" : "s"}`}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-control border px-2 py-3 text-center transition-colors duration-fast",
            toneClasses(entry.count),
          )}
        >
          <span className="text-caption font-semibold">Ch. {entry.chapter}</span>
          <span className="text-small">
            {entry.count} {entry.count === 1 ? "piece" : "pieces"}
          </span>
        </div>
      ))}
    </div>
  );
}
