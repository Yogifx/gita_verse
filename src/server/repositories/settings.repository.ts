import type { AppSettings } from "@/types/settings";
import { getUserById, toAppSettings, updateUserProfile } from "@/server/repositories/users.repository";

export type SettingsPatch = Partial<Pick<AppSettings, "displayName" | "role" | "dailyTarget">>;

export async function getSettings(userId: string): Promise<AppSettings> {
  const user = await getUserById(userId);
  return toAppSettings(user);
}

export async function updateSettings(userId: string, patch: SettingsPatch): Promise<AppSettings> {
  const updated = await updateUserProfile(userId, patch);
  return toAppSettings(updated);
}
