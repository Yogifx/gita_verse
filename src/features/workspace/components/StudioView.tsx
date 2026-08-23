"use client";

import Link from "next/link";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CONTENT_FORMAT_META, CONTENT_FORMATS } from "@/constants/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import type { ContentFormat } from "@/types/content";

type StudioViewProps = {
  format?: string;
  itemId?: string;
};

function isContentFormat(value: string | undefined): value is ContentFormat {
  return !!value && (CONTENT_FORMATS as string[]).includes(value);
}

export function StudioView({ format, itemId }: StudioViewProps) {
  const items = useContentStore((s) => s.items);

  const activeItem = itemId ? items.find((item) => item.id === itemId) : undefined;
  const activeFormat = isContentFormat(format)
    ? format
    : activeItem
      ? activeItem.format
      : undefined;

  if (activeItem) {
    const meta = CONTENT_FORMAT_META[activeItem.format];

    return (
      <SectionCard
        title={activeItem.title}
        description={`${meta.label} · Chapter ${activeItem.reference.chapter}, Verse ${activeItem.reference.verseLabel}`}
        action={<StatusBadge status={activeItem.status} />}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <FormatBadge format={activeItem.format} />
            <span className="text-caption text-foreground-muted">
              {activeItem.reference.chapterTitle}
            </span>
          </div>

          {activeItem.shloka ? (
            <blockquote className="rounded-control border border-border bg-background px-4 py-3 font-display text-body-lg leading-relaxed text-foreground">
              {activeItem.shloka}
            </blockquote>
          ) : null}

          {activeItem.meaning ? (
            <p className="text-body text-foreground-secondary">{activeItem.meaning}</p>
          ) : null}

          <div className="rounded-control border border-dashed border-border bg-surface/60 px-4 py-6 text-center">
            <p className="text-caption text-foreground-muted">
              The full authoring canvas for {meta.label.toLowerCase()} content arrives
              in a future milestone. This item is opened and ready to work on.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  const formatItems = activeFormat
    ? items.filter((item) => item.format === activeFormat)
    : items;

  return (
    <SectionCard
      title={activeFormat ? `${CONTENT_FORMAT_META[activeFormat].label} Studio` : "Content Studio"}
      description={
        activeFormat
          ? CONTENT_FORMAT_META[activeFormat].description
          : "Author lessons, scripts, and structured teaching materials."
      }
    >
      {formatItems.length === 0 ? (
        <p className="py-6 text-center text-caption text-foreground-muted">
              Nothing here yet. Start from the Dashboard&apos;s Quick Actions.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {formatItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{item.title}</p>
                <p className="truncate text-caption text-foreground-muted">
                  Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FormatBadge format={item.format} />
                <StatusBadge status={item.status} />
                <Link
                  href={`/studio?format=${item.format}&item=${item.id}`}
                  className="rounded-control border border-border px-3 py-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
