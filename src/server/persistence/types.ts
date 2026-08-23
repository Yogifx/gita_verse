/**
 * On-disk shape of the GitaVerse persistence file. This is the single
 * canonical record of application/domain data (docs/09_PRODUCT_ARCHITECTURE.md
 * §8.5 — "Canonical business data lives in persistence, not in ephemeral
 * client stores"). Ephemeral UI/shell state (sidebar collapsed, theme,
 * open modals, search text) is intentionally NOT represented here.
 */
import type { Asset } from "@/types/asset";
import type { ContentItem } from "@/types/content";
import type { KnowledgeProject } from "@/types/project";
import type { SessionRecord, UserRecord } from "@/types/user";

export const DB_SCHEMA_VERSION = 2;

export type GitaVerseDb = {
  /** Schema version — bump and add a migration step in migrate() on breaking changes. */
  version: number;
  users: UserRecord[];
  sessions: SessionRecord[];
  projects: KnowledgeProject[];
  contentItems: ContentItem[];
  assets: Asset[];
};
