import { mkdir, readFile, writeFile } from "node:fs/promises";
import { DATA_DIR, DB_FILE_PATH } from "@/server/persistence/paths";
import { createSeedDb } from "@/server/persistence/seed";
import { DB_SCHEMA_VERSION, type GitaVerseDb } from "@/server/persistence/types";
import { PersistenceError } from "@/server/persistence/errors";

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

/** Runs schema migrations in place. Currently a no-op beyond version 1. */
function migrate(db: GitaVerseDb): GitaVerseDb {
  if (db.version === DB_SCHEMA_VERSION) return db;
  // Future schema changes get an explicit migration step here, keyed off
  // db.version. For now, coerce unknown/missing versions forward safely.
  return { ...db, version: DB_SCHEMA_VERSION };
}

async function ensureDbFile(): Promise<GitaVerseDb> {
  try {
    const raw = await readFile(DB_FILE_PATH, "utf-8");
    if (!raw.trim()) throw new Error("empty file");

    let parsed: GitaVerseDb;
    try {
      parsed = JSON.parse(raw) as GitaVerseDb;
    } catch (cause) {
      throw new PersistenceError(
        "The GitaVerse data file is corrupted and could not be parsed as JSON.",
        cause,
      );
    }

    return migrate(parsed);
  } catch (error) {
    if (error instanceof PersistenceError) throw error;

    // File missing (fresh install) — initialize with seed data.
    const seeded = createSeedDb();
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DB_FILE_PATH, JSON.stringify(seeded, null, 2), "utf-8");
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
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
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
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
    } catch (cause) {
      throw new PersistenceError("Failed to write GitaVerse data file.", cause);
    }
    return result;
  });
}
