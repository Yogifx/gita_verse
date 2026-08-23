import { CalendarCheck, CalendarClock, CheckCircle2 } from "lucide-react";
import type { DailyBucket } from "@/features/content/lib/selectors";
import { cn } from "@/lib/utils/cn";

const META: Record<
  DailyBucket,
  { label: string; icon: typeof CalendarCheck; className: string }
> = {
  today: {
    label: "Today's Content",
    icon: CalendarCheck,
    className: "bg-primary-muted text-gold",
  },
  upcoming: {
    label: "Upcoming",
    icon: CalendarClock,
    className: "bg-secondary-muted text-indigo",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-success-muted text-success",
  },
};

type DailyBucketBadgeProps = {
  bucket: DailyBucket;
  className?: string;
};

export function DailyBucketBadge({ bucket, className }: DailyBucketBadgeProps) {
  const meta = META[bucket];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-small font-medium",
        meta.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}
