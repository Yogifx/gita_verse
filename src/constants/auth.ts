/**
 * Local Identity & Access constants. Auth vendor is an explicit non-decision
 * (docs/09_PRODUCT_ARCHITECTURE.md §13), so GV-012 uses the GV-011 file store
 * plus httpOnly session cookies rather than a third-party provider.
 */

export const SESSION_COOKIE = "gv_session";

export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export const MIN_PASSWORD_LENGTH = 8;

/** Stable id for the seeded local demo account that owns seed/demo content. */
export const DEMO_USER_ID = "user-demo";

export const DEMO_USER_EMAIL = "creator@gitaverse.local";

/** Local-only demo password. Not a production secret — documented on sign-in. */
export const DEMO_USER_PASSWORD = "gitaverse";
