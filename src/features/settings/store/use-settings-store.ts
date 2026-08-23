"use client";

import { create } from "zustand";
import type { CreatorRole } from "@/constants/settings";
import { DEFAULT_CREATOR_ROLE } from "@/constants/settings";
import { apiGet, apiPatch } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";
import type { AppSettings } from "@/types/settings";

/**
 * Local workspace profile — persisted (GV-011), but still explicitly NOT
 * real authentication/identity (docs/09_PRODUCT_ARCHITECTURE.md §4.2, §13).
 * GitaVerse has one local workspace today, so this is a singleton record.
 */
type SettingsState = {
  displayName: string;
  role: CreatorRole;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setDisplayName: (name: string) => void;
  setRole: (role: CreatorRole) => void;
};

function reportPersistenceError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[GitaVerse] settings store failed to ${action}:`, error);
  usePersistenceStatusStore
    .getState()
    .reportError(`Couldn't save "${action}" — ${detail}. Your change may not survive a refresh.`);
}

let displayNameSaveTimeout: ReturnType<typeof setTimeout> | undefined;

export const useSettingsStore = create<SettingsState>((set, get) => ({
  displayName: "",
  role: DEFAULT_CREATOR_ROLE,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const settings = await apiGet<AppSettings>("/api/settings");
      set({ displayName: settings.displayName, role: settings.role, isHydrated: true });
    } catch (error) {
      reportPersistenceError("load your profile from the workspace data file", error);
      set({ isHydrated: true });
    }
  },

  setDisplayName: (name) => {
    set({ displayName: name });
    // Debounced so typing doesn't fire a write on every keystroke.
    if (displayNameSaveTimeout) clearTimeout(displayNameSaveTimeout);
    displayNameSaveTimeout = setTimeout(() => {
      void apiPatch("/api/settings", { displayName: name }).catch((error) =>
        reportPersistenceError("save display name", error),
      );
    }, 500);
  },

  setRole: (role) => {
    set({ role });
    void apiPatch("/api/settings", { role }).catch((error) =>
      reportPersistenceError("save role", error),
    );
  },
}));
