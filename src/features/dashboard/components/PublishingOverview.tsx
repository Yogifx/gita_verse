import type { PublishingSummary } from "@/features/dashboard/types";
import { SectionCard } from "@/components/shared/SectionCard";

type PublishingOverviewProps = {
  publishing: PublishingSummary;
};

export function PublishingOverview({ publishing }: PublishingOverviewProps) {
  const stats = [
    { label: "Today's target", value: publishing.dailyTarget },
    { label: "Published this week", value: publishing.publishedThisWeek },
    { label: "Scheduled", value: publishing.scheduledCount },
    { label: "Awaiting approval", value: publishing.awaitingApprovalCount },
  ];

  return (
    <SectionCard title="Publishing Overview" description="A simple weekly pulse.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-control border border-border bg-background px-3 py-3 text-center"
          >
            <p className="font-sans text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-1 text-small text-foreground-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
