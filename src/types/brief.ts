/**
 * Content Brief — GV-015.1 bridge between the Gita Knowledge Layer and
 * later content generation (docs/09_PRODUCT_ARCHITECTURE.md §4.4 / §4.5).
 *
 * The brief is not a source of truth for scripture. It belongs to one
 * Knowledge Project (`projectId`) and stores a verse id (`bg-<chapter>-<verse>`)
 * into the GV-014 corpus. Sanskrit/IAST are read from the Knowledge Layer
 * at display time, not copied here.
 */

export type BriefAudience =
  | "beginner"
  | "spiritual_seeker"
  | "student"
  | "working_professional"
  | "general_audience";

/**
 * Intended output format for a future generation step. Kept separate from
 * `ContentFormat` so Quote / Story / Short Video can exist on a brief
 * without changing GV-013 content records.
 *
 * GV-015.2 can generate a ContentItem only when this value is also a
 * ContentFormat (`reel` | `carousel` | `post`). `quote`, `story`, and
 * `short_video` remain brief-only until ContentItem supports them.
 */
export type BriefFormat = "reel" | "carousel" | "post" | "quote" | "story" | "short_video";

export type BriefTone =
  | "simple"
  | "reflective"
  | "practical"
  | "thought_provoking"
  | "conversational";

export type ContentBrief = {
  id: string;
  ownerId: string;
  /** Knowledge Project this brief belongs to. The project is the work container. */
  projectId: string;
  /**
   * Canonical Knowledge Layer verse id, e.g. `bg-2-47`.
   * Chapter/verse are derived from this id; shloka text is not stored.
   */
  verseId: string;
  /** Creator's simplified meaning for this brief — not corpus commentary. */
  meaning: string;
  keyTeaching: string;
  audience: BriefAudience;
  contentGoal: string;
  format: BriefFormat;
  hook: string;
  keyMessage: string;
  tone: BriefTone;
  createdAt: string;
  updatedAt: string;
};
