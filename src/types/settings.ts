/**
 * Session-scoped workspace preferences. Identity fields live on the
 * authenticated user (GV-012); this DTO is what `/api/settings` returns so
 * existing Dashboard/Settings stores keep the same shape.
 */
import type { CreatorRole } from "@/constants/settings";

export type AppSettings = {
  email: string;
  displayName: string;
  role: CreatorRole;
  dailyTarget: number;
  updatedAt: string;
};
