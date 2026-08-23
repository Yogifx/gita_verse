import type { ContentItem } from "@/types/content";
import {
  CONTENT_FORMATS,
  PIPELINE_STAGES,
  REVIEW_QUEUE_STATUSES,
} from "@/constants/content";
import type {
  DashboardSnapshot,
  FormatSummary,
  PipelineStageCount,
  PublishingSummary,
} from "@/features/dashboard/types";

export function getTodayContent(items: ContentItem[]): ContentItem | undefined {
  return items.find((item) => item.isToday);
}

export function getPipelineCounts(items: ContentItem[]): PipelineStageCount[] {
  return PIPELINE_STAGES.map(({ stage, label }) => ({
    stage,
    label,
    count: items.filter((item) => item.pipelineStage === stage).length,
  }));
}

export function getFormatSummaries(items: ContentItem[]): FormatSummary[] {
  return CONTENT_FORMATS.map((format) => {
    const formatItems = items.filter((item) => item.format === format);
    return {
      format,
      completed: formatItems.filter((item) => item.status === "published").length,
      pending: formatItems.filter((item) => item.status !== "published").length,
    };
  });
}

export function getPublishingSummary(
  items: ContentItem[],
  dailyTarget: number,
): PublishingSummary {
  return {
    dailyTarget,
    publishedToday: items.filter((item) => item.isToday && item.status === "published")
      .length,
    publishedThisWeek: items.filter((item) => item.publishedThisWeek).length,
    scheduledCount: items.filter((item) => item.status === "scheduled").length,
    awaitingApprovalCount: items.filter((item) =>
      REVIEW_QUEUE_STATUSES.includes(item.status),
    ).length,
  };
}

export function getRecentProjects(items: ContentItem[], limit = 6): ContentItem[] {
  return [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function getReviewQueue(items: ContentItem[]): ContentItem[] {
  return items
    .filter((item) => REVIEW_QUEUE_STATUSES.includes(item.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function buildDashboardSnapshot(
  items: ContentItem[],
  dailyTarget: number,
): DashboardSnapshot {
  return {
    todayContent: getTodayContent(items),
    pipeline: getPipelineCounts(items),
    formatSummaries: getFormatSummaries(items),
    publishing: getPublishingSummary(items, dailyTarget),
    recentProjects: getRecentProjects(items),
    reviewQueue: getReviewQueue(items),
  };
}
