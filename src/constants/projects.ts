import type { KnowledgeProjectCategory, KnowledgeProjectStatus } from "@/types/project";
import type { StatusTone } from "@/constants/content";

export const PROJECT_STATUS_META: Record<
  KnowledgeProjectStatus,
  { label: string; tone: StatusTone }
> = {
  draft: { label: "Draft", tone: "neutral" },
  active: { label: "Active", tone: "info" },
  in_review: { label: "In Review", tone: "warning" },
  publish_ready: { label: "Publish Ready", tone: "success" },
  archived: { label: "Archived", tone: "neutral" },
};

export const PROJECT_STATUSES: KnowledgeProjectStatus[] = [
  "draft",
  "active",
  "in_review",
  "publish_ready",
  "archived",
];

export const PROJECT_CATEGORY_META: Record<KnowledgeProjectCategory, { label: string }> = {
  study_series: { label: "Study Series" },
  curriculum: { label: "Curriculum" },
  workshop: { label: "Workshop" },
  content_series: { label: "Content Series" },
  other: { label: "Other" },
};

export const PROJECT_CATEGORIES: KnowledgeProjectCategory[] = [
  "study_series",
  "curriculum",
  "workshop",
  "content_series",
  "other",
];
