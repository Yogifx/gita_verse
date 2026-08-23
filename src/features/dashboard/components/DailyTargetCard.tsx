import { Target } from "lucide-react";
import type { PublishingSummary } from "@/features/dashboard/types";
import { SectionCard } from "@/components/shared/SectionCard";

type DailyTargetCardProps = {
  publishing: PublishingSummary;
};

export function DailyTargetCard({ publishing }: DailyTargetCardProps) {
  const remaining = Math.max(publishing.dailyTarget - publishing.publishedToday, 0);
  const progress =
    publishing.dailyTarget > 0
      ? Math.min((publishing.publishedToday / publishing.dailyTarget) * 100, 100)
      : 0;
  const isMet = remaining === 0;

  return (
    <SectionCard
      title="Daily Target"
      description="GitaVerse runs on a daily publishing cadence."
      className="h-full"
      action={<Target className="h-4 w-4 text-gold" />}
    >
      <div className="flex flex-1 flex-col justify-between gap-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-sans text-4xl font-semibold text-foreground">
              {publishing.dailyTarget}
            </p>
            <p className="text-small text-foreground-muted">Today&apos;s Target</p>
          </div>
          <div>
            <p className="font-sans text-4xl font-semibold text-success">
              {publishing.publishedToday}
            </p>
            <p className="text-small text-foreground-muted">Published</p>
          </div>
          <div>
            <p className="font-sans text-4xl font-semibold text-gold">{remaining}</p>
            <p className="text-small text-foreground-muted">Remaining</p>
          </div>
        </div>

        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-slow ease-standard"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-caption text-foreground-secondary">
            {isMet
              ? "Today's target is met. Great work."
              : `${remaining} more piece${remaining === 1 ? "" : "s"} to hit today's cadence.`}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
