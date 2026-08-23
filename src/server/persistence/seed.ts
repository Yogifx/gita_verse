/**
 * Initial database contents used only when no persistence file exists yet
 * (fresh install / first run). Reuses the existing feature seed data so the
 * migrated persistent store starts with the same demo workspace, now owned
 * by the local demo account (GV-012).
 */
import { seedContentItems } from "@/features/content/data/seed";
import { seedKnowledgeProjects } from "@/features/projects/data/seed";
import { seedAssets } from "@/features/media/data/seed";
import { DEFAULT_CREATOR_ROLE } from "@/constants/settings";
import { DAILY_TARGET } from "@/features/content/data/seed";
import {
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
  DEMO_USER_PASSWORD,
} from "@/constants/auth";
import { DB_SCHEMA_VERSION, type GitaVerseDb } from "@/server/persistence/types";
import { hashPassword } from "@/server/auth/password";
import type { UserRecord } from "@/types/user";

export async function createDemoUser(overrides?: {
  displayName?: string;
  role?: UserRecord["role"];
  dailyTarget?: number;
}): Promise<UserRecord> {
  const now = new Date().toISOString();
  const { hash, salt } = await hashPassword(DEMO_USER_PASSWORD);

  return {
    id: DEMO_USER_ID,
    email: DEMO_USER_EMAIL,
    passwordHash: hash,
    passwordSalt: salt,
    displayName: overrides?.displayName ?? "GitaVerse Creator",
    role: overrides?.role ?? DEFAULT_CREATOR_ROLE,
    dailyTarget: overrides?.dailyTarget ?? DAILY_TARGET,
    createdAt: now,
    updatedAt: now,
  };
}

export async function createSeedDb(): Promise<GitaVerseDb> {
  const demoUser = await createDemoUser();

  return {
    version: DB_SCHEMA_VERSION,
    users: [demoUser],
    sessions: [],
    projects: seedKnowledgeProjects.map((project) => ({
      ...project,
      ownerId: demoUser.id,
    })),
    contentItems: seedContentItems.map((item) => ({
      ...item,
      ownerId: demoUser.id,
    })),
    assets: seedAssets.map((asset) => ({
      ...asset,
      ownerId: demoUser.id,
    })),
  };
}
