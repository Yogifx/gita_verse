/**
 * Shared content contracts for the GitaVerse creative workflow.
 * Cross-module type — consumed by the dashboard, workspace, and projects
 * features. Structured so a future API/database layer can populate the same
 * shape without UI changes.
 */

import type { ContentOutput } from "@/types/content-output";

/**
 * `session` is a longer-form teaching document (a class/workshop session)
 * rather than a social piece — it uses the same Creative Workspace editor and
 * the same persisted `ContentItem` shape (docs/09_PRODUCT_ARCHITECTURE.md §4.4,
 * "educational document types").
 */
export type ContentFormat = "carousel" | "post" | "reel" | "session";

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

export type {
  CarouselOutput,
  CarouselSlide,
  CarouselSlideRole,
  ContentOutput,
  PostOutput,
  ReelOutput,
  ReelScene,
} from "@/types/content-output";

export type ContentItem = {
  id: string;
  /** Owning account — Identity & Access isolation (docs §4.2, §5.6). */
  ownerId: string;
  /**
   * Optional Content Brief this piece was generated from (GV-015.2).
   * Absent on GV-013 manual/seed items. Provenance is
   * ContentItem → ContentBrief → projectId + verseId → GV-014.
   */
  briefId?: string;
  title: string;
  format: ContentFormat;
  status: ContentStatus;
  pipelineStage: PipelineStage;
  reference: GitaReference;
  shloka: string;
  transliteration: string;
  meaning: string;
  keyLearning: string;
  /**
   * Authored teaching document as HTML from the Creative Workspace editor
   * (Tiptap). Optional so GV-011 seed records remain valid until first save.
   * Not replaced by `output`; generation may project HTML here one-way.
   */
  body?: string;
  /**
   * Structured generated content (GV-015.3). Canonical for Reel / Carousel /
   * Post generation. Absent on legacy/manual items. Not a knowledge record.
   */
  output?: ContentOutput;
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
