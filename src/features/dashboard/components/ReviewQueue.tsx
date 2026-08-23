import Link from "next/link";
import { Eye } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { CONTENT_FORMAT_META } from "@/constants/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { SectionCard } from "@/components/shared/SectionCard";

type ReviewQueueProps = {
  items: ContentItem[];
};

export function ReviewQueue({ items }: ReviewQueueProps) {
  return (
    <SectionCard
      title="Review Queue"
      description="Nothing publishes without your approval."
    >
      {items.length === 0 ? (
        <p className="py-6 text-center text-caption text-foreground-muted">
          Nothing is waiting on your review. Well ahead of schedule.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const Icon = CONTENT_FORMAT_META[item.format].icon;

            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-control border border-border bg-background p-3"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-primary-muted text-gold">
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-caption text-foreground-muted">
                    Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <FormatBadge format={item.format} />
                  <StatusBadge status={item.status} />
                  <Link
                    href={`/studio?format=${item.format}&item=${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-control bg-primary px-3 py-1.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
