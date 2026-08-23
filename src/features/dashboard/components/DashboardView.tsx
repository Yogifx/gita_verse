"use client";

import { useMemo } from "react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { buildDashboardSnapshot } from "@/features/dashboard/lib/selectors";
import { TodayContentCard } from "@/features/dashboard/components/TodayContentCard";
import { DailyTargetCard } from "@/features/dashboard/components/DailyTargetCard";
import { ReviewQueue } from "@/features/dashboard/components/ReviewQueue";
import { ContentPipeline } from "@/features/dashboard/components/ContentPipeline";
import { ContentFormatGrid } from "@/features/dashboard/components/ContentFormatGrid";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentProjects } from "@/features/dashboard/components/RecentProjects";
import { PublishingOverview } from "@/features/dashboard/components/PublishingOverview";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

export function DashboardView() {
  const items = useContentStore((s) => s.items);
  const dailyTarget = useContentStore((s) => s.dailyTarget);
  const isHydrated = useContentStore((s) => s.isHydrated);

  const snapshot = useMemo(
    () => buildDashboardSnapshot(items, dailyTarget),
    [items, dailyTarget],
  );

  if (!isHydrated) {
    return <WorkspaceLoading label="Loading dashboard…" />;
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayContentCard item={snapshot.todayContent} />
        </div>
        <div className="lg:col-span-1">
          <DailyTargetCard publishing={snapshot.publishing} />
        </div>
      </div>

      <ReviewQueue items={snapshot.reviewQueue} />

      <ContentPipeline stages={snapshot.pipeline} />

      <ContentFormatGrid summaries={snapshot.formatSummaries} />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentProjects projects={snapshot.recentProjects} />
        </div>
        <div className="lg:col-span-1">
          <PublishingOverview publishing={snapshot.publishing} />
        </div>
      </div>
    </div>
  );
}
