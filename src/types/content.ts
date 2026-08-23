/**
 * Shared content contracts for the GitaVerse creative workflow.
 * Cross-module type — consumed by the dashboard, workspace, and projects
 * features. Structured so a future API/database layer can populate the same
 * shape without UI changes.
 */

export type ContentFormat = "carousel" | "post" | "reel";

export type ContentStatus =
  | "draft"
  | "ai_generated"
  | "in_review"
  | "approved"
  | "scheduled"
  | "published";

export type PipelineStage =
  | "idea"
  | "research"
  | "script"
  | "design"
  | "review"
  | "approved"
  | "scheduled"
  | "published";

export type Platform = "instagram" | "facebook" | "linkedin" | "youtube_shorts";

export type GitaReference = {
  chapter: number;
  verseLabel: string;
  chapterTitle: string;
};

export type ContentItem = {
  id: string;
  title: string;
  format: ContentFormat;
  status: ContentStatus;
  pipelineStage: PipelineStage;
  reference: GitaReference;
  shloka: string;
  transliteration: string;
  meaning: string;
  keyLearning: string;
  platforms: Platform[];
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  publishedAt?: string;
  /** Marks the single item planned for today's publishing target (demo data). */
  isToday?: boolean;
  /** Marks items published within the current week (demo data aggregate). */
  publishedThisWeek?: boolean;
  /** Soft-removed from active views; content and history are preserved. */
  archived?: boolean;
};

/**
 * Content Studio vocabulary aliases. The underlying shape is identical to
 * the types above — kept as one implementation to avoid divergent models
 * across the dashboard, content studio, and workspace features.
 */
export type ContentProject = ContentItem;
export type ContentType = ContentFormat;
export type WorkflowStage = PipelineStage;
