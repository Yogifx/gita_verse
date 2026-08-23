/**
 * Local workspace settings — persisted (docs/09_PRODUCT_ARCHITECTURE.md §13
 * persistence stance), but explicitly NOT tied to real authentication/identity
 * yet (Identity & Access is a future milestone, §4.2). Until then GitaVerse
 * operates as a single local workspace, so this is a singleton record rather
 * than a per-user table.
 */
import type { CreatorRole } from "@/constants/settings";

export type AppSettings = {
  displayName: string;
  role: CreatorRole;
  dailyTarget: number;
  updatedAt: string;
};
