/**
 * Initial database contents used only when no persistence file exists yet
 * (fresh install / first run). Reuses the existing feature seed data so the
 * migrated persistent store starts identical to the previous in-memory
 * defaults — no visible change for a first-time user.
 */
import { seedContentItems } from "@/features/content/data/seed";
import { seedKnowledgeProjects } from "@/features/projects/data/seed";
import { seedAssets } from "@/features/media/data/seed";
import { DEFAULT_CREATOR_ROLE } from "@/constants/settings";
import { DAILY_TARGET } from "@/features/content/data/seed";
import { DB_SCHEMA_VERSION, type GitaVerseDb } from "@/server/persistence/types";

export function createSeedDb(): GitaVerseDb {
  const now = new Date().toISOString();

  return {
    version: DB_SCHEMA_VERSION,
    projects: seedKnowledgeProjects,
    contentItems: seedContentItems,
    assets: seedAssets,
    settings: {
      displayName: "",
      role: DEFAULT_CREATOR_ROLE,
      dailyTarget: DAILY_TARGET,
      updatedAt: now,
    },
  };
}
