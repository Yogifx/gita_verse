import { mkdir, readFile, writeFile } from "node:fs/promises";
import { DATA_DIR, DB_FILE_PATH } from "@/server/persistence/paths";
import { createDemoUser, createSeedDb } from "@/server/persistence/seed";
import { DB_SCHEMA_VERSION, type GitaVerseDb } from "@/server/persistence/types";
import { PersistenceError } from "@/server/persistence/errors";
import type { Asset } from "@/types/asset";
import type { ContentItem } from "@/types/content";
import type { KnowledgeProject } from "@/types/project";
import type { AppSettings } from "@/types/settings";

/**
 * Serializes all reads/writes through a single in-process promise chain.
 * The Next.js dev/production server is a single Node process, so this is
 * enough to prevent two concurrent API requests from interleaving a
 * read-modify-write cycle and clobbering each other's changes.
 */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task);
  // Swallow rejections in the queue chain itself so one failed operation
  // doesn't permanently block later ones; the caller still sees the error
  // via the returned `result` promise.
  queue = result.catch(() => undefined);
  return result;
}

type LegacyV1Db = {
  version: number;
  projects: Array<KnowledgeProject & { ownerId?: string }>;
  contentItems: Array<ContentItem & { ownerId?: string }>;
  assets: Array<Asset & { ownerId?: string }>;
  settings?: AppSettings;
  users?: GitaVerseDb["users"];
  sessions?: GitaVerseDb["sessions"];
};

async function migrate(raw: LegacyV1Db): Promise<{ db: GitaVerseDb; changed: boolean }> {
  if (raw.version === DB_SCHEMA_VERSION && Array.isArray(raw.users) && Array.isArray(raw.sessions)) {
    return {
      db: {
        version: DB_SCHEMA_VERSION,
        users: raw.users,
        sessions: raw.sessions,
        projects: raw.projects as KnowledgeProject[],
        contentItems: raw.contentItems as ContentItem[],
        assets: raw.assets as Asset[],
      },
      changed: false,
    };
  }

  const demoUser = await createDemoUser({
    displayName: raw.settings?.displayName || "GitaVerse Creator",
    role: raw.settings?.role,
    dailyTarget: raw.settings?.dailyTarget,
  });

  return {
    db: {
      version: DB_SCHEMA_VERSION,
      users: [demoUser],
      sessions: [],
      projects: raw.projects.map((project) => ({
        ...project,
        ownerId: project.ownerId ?? demoUser.id,
      })),
      contentItems: raw.contentItems.map((item) => ({
        ...item,
        ownerId: item.ownerId ?? demoUser.id,
      })),
      assets: raw.assets.map((asset) => ({
        ...asset,
        ownerId: asset.ownerId ?? demoUser.id,
      })),
    },
    changed: true,
  };
}

async function persist(db: GitaVerseDb): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
}

async function ensureDbFile(): Promise<GitaVerseDb> {
  try {
    const raw = await readFile(DB_FILE_PATH, "utf-8");
    if (!raw.trim()) throw new Error("empty file");

    let parsed: LegacyV1Db;
    try {
      parsed = JSON.parse(raw) as LegacyV1Db;
    } catch (cause) {
      throw new PersistenceError(
        "The GitaVerse data file is corrupted and could not be parsed as JSON.",
        cause,
      );
    }

    const { db, changed } = await migrate(parsed);
    if (changed) {
      try {
        await persist(db);
      } catch (cause) {
        throw new PersistenceError("Failed to write GitaVerse data file.", cause);
      }
    }
    return db;
  } catch (error) {
    if (error instanceof PersistenceError) throw error;

    // File missing (fresh install) — initialize with seed data.
    const seeded = await createSeedDb();
    try {
      await persist(seeded);
    } catch (cause) {
      throw new PersistenceError("Failed to write GitaVerse data file.", cause);
    }
    return seeded;
  }
}

/** Reads the full database. Initializes it with seed data on first run. */
export function readDb(): Promise<GitaVerseDb> {
  return withLock(ensureDbFile);
}

/** Persists the full database atomically relative to other queued operations. */
export function writeDb(db: GitaVerseDb): Promise<void> {
  return withLock(async () => {
    try {
      await persist(db);
    } catch (cause) {
      throw new PersistenceError("Failed to write GitaVerse data file.", cause);
    }
  });
}

/**
 * Convenience helper: read the current db, apply a mutation, persist it, and
 * return whatever the mutator returns (typically the affected record).
 */
export async function mutateDb<T>(
  mutator: (db: GitaVerseDb) => { db: GitaVerseDb; result: T },
): Promise<T> {
  return withLock(async () => {
    const current = await ensureDbFile();
    const { db, result } = mutator(current);
    try {
      await persist(db);
    } catch (cause) {
      throw new PersistenceError("Failed to write GitaVerse data file.", cause);
    }
    return result;
  });
}
