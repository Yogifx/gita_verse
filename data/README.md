# Local workspace data

GitaVerse persists application/domain data to `gitaverse-db.json` in this folder.

The file is created automatically on first run from the existing seed data (Knowledge Projects, Content items, Assets) plus a local demo account. It is gitignored so every environment gets its own local workspace.

## Identity (GV-012)

Accounts and sessions live in this file. There is no third-party auth vendor yet (see `docs/09_PRODUCT_ARCHITECTURE.md` §13).

Seeded demo account (owns the demo content):

- Email: `creator@gitaverse.local`
- Password: `gitaverse`

Creating a new account starts an empty workspace. Sign-out clears the httpOnly session cookie.

To reset to seed data, delete `gitaverse-db.json` and restart the Next.js server.
