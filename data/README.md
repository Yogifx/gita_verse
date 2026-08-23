# Local workspace data

GitaVerse persists application/domain data to `gitaverse-db.json` in this folder (GV-011).

The file is created automatically on first run from the existing seed data (Knowledge Projects, Content items, Assets, and workspace settings). It is gitignored so every environment gets its own local workspace.

To reset to seed data, delete `gitaverse-db.json` and restart the Next.js server.
