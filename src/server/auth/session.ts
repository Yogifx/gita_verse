import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/constants/auth";
import { UnauthorizedError } from "@/server/persistence/errors";
import {
  createSession,
  deleteSession,
  getUserBySessionId,
} from "@/server/repositories/users.repository";
import { toPublicUser, type PublicUser, type UserRecord } from "@/types/user";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const user = await getUserBySessionId(token);
  return user ?? null;
}

export async function getCurrentPublicUser(): Promise<PublicUser | null> {
  const user = await getCurrentUser();
  return user ? toPublicUser(user) : null;
}

export async function requireUser(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function establishSession(userId: string): Promise<PublicUser> {
  const session = await createSession(userId, SESSION_TTL_MS);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, session.id, cookieOptions());
  const user = await getUserBySessionId(session.id);
  if (!user) throw new UnauthorizedError("Session could not be created.");
  return toPublicUser(user);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
