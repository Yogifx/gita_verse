import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { CONTENT_FORMAT_META, PLATFORM_META } from "@/constants/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { DailyBucketBadge } from "@/features/content-studio/components/DailyBucketBadge";
import { getDailyBucket } from "@/features/content/lib/selectors";
import { formatRelativeTime } from "@/lib/utils/time";

type ContentCardProps = {
  item: ContentItem;
};

export function ContentCard({ item }: ContentCardProps) {
  const Icon = CONTENT_FORMAT_META[item.format].icon;

  return (
    <article className="group flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 transition-colors duration-fast hover:border-primary-muted hover:bg-muted/40">
      <Link href={`/content/${item.id}`} className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-muted text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{item.title}</p>
              <p className="truncate text-caption text-foreground-muted">
                Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
              </p>
            </div>
          </div>
          <DailyBucketBadge bucket={getDailyBucket(item)} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <FormatBadge format={item.format} />
          <StatusBadge status={item.status} />
        </div>

        <div className="flex flex-wrap gap-1">
          {item.platforms.length === 0 ? (
            <span className="text-small text-foreground-muted">No platforms selected</span>
          ) : (
            item.platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-full bg-muted px-2 py-0.5 text-small text-foreground-secondary"
              >
                {PLATFORM_META[platform].label}
              </span>
            ))
          )}
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-caption">
        <span className="text-foreground-muted">Edited {formatRelativeTime(item.updatedAt)}</span>
        <div className="flex items-center gap-2">
          <Link
            href={`/content/${item.id}`}
            className="inline-flex items-center gap-1 font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/studio?format=${item.format}&item=${item.id}`}
            className="inline-flex items-center gap-1 font-medium text-gold transition-colors duration-fast hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}
