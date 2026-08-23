/**
 * Role labels are descriptive only — GitaVerse has no enforced permissions
 * yet. Real roles (owner/editor/viewer) and membership are future work
 * owned by Identity & Access (docs/09_PRODUCT_ARCHITECTURE.md §4.2, §13).
 */
export const CREATOR_ROLES = [
  "Creator",
  "Editor",
  "Reviewer",
  "Administrator",
] as const;

export type CreatorRole = (typeof CREATOR_ROLES)[number];

export const DEFAULT_CREATOR_ROLE: CreatorRole = "Creator";

export const DAILY_TARGET_MIN = 1;
export const DAILY_TARGET_MAX = 10;
