import path from "node:path";

/**
 * File-based persistence store. GV-011 chooses a local JSON data file over a
 * database server/ORM because:
 * - No database vendor has been decided yet (docs/09_PRODUCT_ARCHITECTURE.md
 *   §13 explicitly lists this as an open non-decision).
 * - GitaVerse today is a single local creative workspace (no auth/multi-user
 *   yet), so a lightweight embedded store is sufficient.
 * - It requires zero new runtime dependencies, no native compilation, and no
 *   credentials/secrets — important for a reproducible fresh install.
 * - The repository layer below exposes the same async CRUD contract a real
 *   database-backed implementation would, so swapping the storage engine
 *   later (Postgres/SQLite/etc.) does not require touching callers.
 */
export const DATA_DIR = path.join(process.cwd(), "data");
export const DB_FILE_PATH = path.join(DATA_DIR, "gitaverse-db.json");
