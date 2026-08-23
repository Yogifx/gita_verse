import { randomBytes } from "node:crypto";
import type { PublicUser, SessionRecord, UserRecord } from "@/types/user";
import { toPublicUser } from "@/types/user";
import type { AppSettings } from "@/types/settings";
import { DAILY_TARGET_MAX, DAILY_TARGET_MIN, DEFAULT_CREATOR_ROLE } from "@/constants/settings";
import { MIN_PASSWORD_LENGTH } from "@/constants/auth";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { DuplicateRecordError, NotFoundError, ValidationError } from "@/server/persistence/errors";
import { hashPassword, verifyPassword } from "@/server/auth/password";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toAppSettings(user: UserRecord): AppSettings {
  return {
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    dailyTarget: user.dailyTarget,
    updatedAt: user.updatedAt,
  };
}

export async function getUserById(id: string): Promise<UserRecord> {
  const db = await readDb();
  const user = db.users.find((entry) => entry.id === id);
  if (!user) throw new NotFoundError("User", id);
  return user;
}

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const db = await readDb();
  const normalized = normalizeEmail(email);
  return db.users.find((entry) => entry.email === normalized);
}

export async function createUser(input: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address.");
  if (!input.password || input.password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const { hash, salt } = await hashPassword(input.password);
  const now = new Date().toISOString();
  const displayName = (input.displayName ?? "").trim();

  return mutateDb((db) => {
    if (db.users.some((entry) => entry.email === email)) {
      throw new DuplicateRecordError("User", email);
    }

    const record: UserRecord = {
      id: `user-${Date.now()}-${randomBytes(4).toString("hex")}`,
      email,
      passwordHash: hash,
      passwordSalt: salt,
      displayName,
      role: DEFAULT_CREATOR_ROLE,
      dailyTarget: 1,
      createdAt: now,
      updatedAt: now,
    };

    return {
      db: { ...db, users: [...db.users, record] },
      result: toPublicUser(record),
    };
  });
}

export async function authenticateUser(email: string, password: string): Promise<UserRecord> {
  const user = await getUserByEmail(email);
  if (!user) throw new ValidationError("Email or password is incorrect.");

  const matches = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!matches) throw new ValidationError("Email or password is incorrect.");

  return user;
}

export type UserProfilePatch = Partial<Pick<UserRecord, "displayName" | "role" | "dailyTarget">>;

export async function updateUserProfile(id: string, patch: UserProfilePatch): Promise<UserRecord> {
  if (patch.dailyTarget !== undefined) {
    if (
      !Number.isFinite(patch.dailyTarget) ||
      patch.dailyTarget < DAILY_TARGET_MIN ||
      patch.dailyTarget > DAILY_TARGET_MAX
    ) {
      throw new ValidationError(
        `Daily target must be between ${DAILY_TARGET_MIN} and ${DAILY_TARGET_MAX}.`,
      );
    }
  }

  return mutateDb((db) => {
    const index = db.users.findIndex((entry) => entry.id === id);
    if (index === -1) throw new NotFoundError("User", id);

    const updated: UserRecord = {
      ...db.users[index],
      ...patch,
      displayName: patch.displayName !== undefined ? patch.displayName : db.users[index].displayName,
      updatedAt: new Date().toISOString(),
    };
    const users = [...db.users];
    users[index] = updated;
    return { db: { ...db, users }, result: updated };
  });
}

export async function createSession(userId: string, ttlMs: number): Promise<SessionRecord> {
  const now = Date.now();
  const session: SessionRecord = {
    id: randomBytes(32).toString("hex"),
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ttlMs).toISOString(),
  };

  return mutateDb((db) => {
    const active = db.sessions.filter((entry) => new Date(entry.expiresAt).getTime() > now);
    return {
      db: { ...db, sessions: [...active, session] },
      result: session,
    };
  });
}

export async function getUserBySessionId(sessionId: string): Promise<UserRecord | undefined> {
  const db = await readDb();
  const session = db.sessions.find((entry) => entry.id === sessionId);
  if (!session) return undefined;
  if (new Date(session.expiresAt).getTime() <= Date.now()) return undefined;
  return db.users.find((entry) => entry.id === session.userId);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await mutateDb((db) => ({
    db: { ...db, sessions: db.sessions.filter((entry) => entry.id !== sessionId) },
    result: undefined,
  }));
}
