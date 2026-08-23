/**
 * Identity & Access contracts — docs/09_PRODUCT_ARCHITECTURE.md §4.2, §8.5.
 * `UserRecord` is the persisted account. `PublicUser` is the safe session
 * projection (no password material). Project membership / owner-editor-viewer
 * ACL remains future work; isolation is owner-scoped for this milestone.
 */
import type { CreatorRole } from "@/constants/settings";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  displayName: string;
  role: CreatorRole;
  dailyTarget: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  email: string;
  displayName: string;
  role: CreatorRole;
  dailyTarget: number;
  createdAt: string;
  updatedAt: string;
};

export type SessionRecord = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    dailyTarget: user.dailyTarget,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
