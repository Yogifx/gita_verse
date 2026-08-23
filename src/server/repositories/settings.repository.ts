import type { AppSettings } from "@/types/settings";
import { DAILY_TARGET_MAX, DAILY_TARGET_MIN } from "@/constants/settings";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { ValidationError } from "@/server/persistence/errors";

export async function getSettings(): Promise<AppSettings> {
  const db = await readDb();
  return db.settings;
}

export type SettingsPatch = Partial<Pick<AppSettings, "displayName" | "role" | "dailyTarget">>;

export async function updateSettings(patch: SettingsPatch): Promise<AppSettings> {
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
    const updated: AppSettings = {
      ...db.settings,
      ...patch,
      displayName: patch.displayName !== undefined ? patch.displayName : db.settings.displayName,
      updatedAt: new Date().toISOString(),
    };
    return { db: { ...db, settings: updated }, result: updated };
  });
}
