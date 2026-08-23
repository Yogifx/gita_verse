import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";

/**
 * Reuses real product primitives so the preview reflects exactly what the
 * rest of GitaVerse looks like under the active theme — not a mockup.
 */
export function ThemeLivePreview() {
  return (
    <div className="flex flex-col gap-4 rounded-panel border border-border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="draft" />
        <StatusBadge status="in_review" />
        <StatusBadge status="approved" />
        <StatusBadge status="published" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FormatBadge format="carousel" />
        <FormatBadge format="post" />
        <FormatBadge format="reel" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          Primary action
        </button>
        <button
          type="button"
          className="rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
        >
          Secondary action
        </button>
      </div>

      <div className="rounded-control border border-border bg-surface p-3">
        <p className="font-display text-h3 text-foreground">Duty Without Attachment</p>
        <p className="mt-1 text-caption text-foreground-secondary">
          Chapter 2, Verse 47 — a sample card exactly as it appears in Content Studio.
        </p>
      </div>
    </div>
  );
}
