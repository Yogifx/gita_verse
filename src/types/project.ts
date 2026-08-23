/**
 * Knowledge Project contracts — the durable container entity described in
 * docs/09_PRODUCT_ARCHITECTURE.md (§4.3, §5). Distinct from `ContentItem`:
 * a Knowledge Project is a reusable knowledge/course context, while a
 * ContentItem is an individual carousel/post/reel piece produced inside
 * Content Studio. Structured so a future API/database layer can populate
 * the same shape without UI changes.
 */

export type KnowledgeProjectStatus =
  | "draft"
  | "active"
  | "in_review"
  | "publish_ready"
  | "archived";

export type KnowledgeProjectCategory =
  | "study_series"
  | "curriculum"
  | "workshop"
  | "content_series"
  | "other";

export type KnowledgeProject = {
  id: string;
  /** Owning account — Identity & Access isolation (docs §4.2, §5.6). */
  ownerId: string;
  name: string;
  description: string;
  category?: KnowledgeProjectCategory;
  status: KnowledgeProjectStatus;
  /** Placeholder knowledge/content summary count — connects to real content in a future milestone. */
  contentCount: number;
  createdAt: string;
  updatedAt: string;
};
