import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { PLATFORM_META } from "@/constants/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { formatDayDate } from "@/lib/utils/time";

type TodayContentCardProps = {
  item: ContentItem | undefined;
};

export function TodayContentCard({ item }: TodayContentCardProps) {
  const { day, date } = formatDayDate();

  return (
    <SectionCard
      title="Today's Content"
      description="What needs your attention right now."
      className="h-full"
      action={
        <span className="flex items-center gap-2 text-caption text-foreground-muted">
          <CalendarDays className="h-4 w-4" />
          {day}, {date}
        </span>
      }
    >
      {item ? (
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-control bg-primary-muted px-2.5 py-1 text-small font-medium text-gold">
              Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
            </span>
            <FormatBadge format={item.format} />
            <StatusBadge status={item.status} />
          </div>

          <p className="text-caption text-foreground-muted">{item.reference.chapterTitle}</p>

          <blockquote className="rounded-control border border-border bg-background px-4 py-3 font-display text-body-lg leading-relaxed text-foreground">
            {item.shloka}
          </blockquote>
          <p className="text-caption italic text-foreground-secondary">
            {item.transliteration}
          </p>

          <div>
            <p className="text-caption font-medium text-foreground-secondary">
              Simplified meaning
            </p>
            <p className="mt-1 text-body text-foreground">{item.meaning}</p>
          </div>

          <div className="rounded-control border border-primary-muted bg-primary-muted/40 px-4 py-3">
            <p className="text-caption font-medium text-gold">Key learning</p>
            <p className="mt-1 text-body text-foreground">{item.keyLearning}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {item.platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-full bg-muted px-2.5 py-1 text-small text-foreground-secondary"
                >
                  {PLATFORM_META[platform].label}
                </span>
              ))}
            </div>
            <Link
              href={`/studio?format=${item.format}&item=${item.id}`}
              className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
            >
              Continue in Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-control border border-dashed border-border py-10 text-center">
          <p className="text-body text-foreground-secondary">
            Nothing is planned for today yet.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            Plan today&apos;s content
          </Link>
        </div>
      )}
    </SectionCard>
  );
}
