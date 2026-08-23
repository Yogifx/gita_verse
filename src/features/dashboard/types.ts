import type { ContentFormat, ContentItem, PipelineStage } from "@/types/content";

export type PipelineStageCount = {
  stage: PipelineStage;
  label: string;
  count: number;
};

export type FormatSummary = {
  format: ContentFormat;
  pending: number;
  completed: number;
};

export type PublishingSummary = {
  dailyTarget: number;
  publishedToday: number;
  publishedThisWeek: number;
  scheduledCount: number;
  awaitingApprovalCount: number;
};

export type DashboardSnapshot = {
  todayContent: ContentItem | undefined;
  pipeline: PipelineStageCount[];
  formatSummaries: FormatSummary[];
  publishing: PublishingSummary;
  recentProjects: ContentItem[];
  reviewQueue: ContentItem[];
};
