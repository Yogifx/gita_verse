"use client";

import { create } from "zustand";
import type { CreatorRole } from "@/constants/settings";
import { DEFAULT_CREATOR_ROLE } from "@/constants/settings";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";
import type { AppSettings } from "@/types/settings";

/**
 * Profile + workspace preferences for the signed-in account (GV-012).
 * Canonical identity lives in persistence; this store is the client cache.
 */
type SettingsState = {
  email: string;
  displayName: string;
  role: CreatorRole;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setDisplayName: (name: string) => void;
  setRole: (role: CreatorRole) => void;
  signOut: () => Promise<void>;
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
  email: "",
  displayName: "",
  role: DEFAULT_CREATOR_ROLE,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const settings = await apiGet<AppSettings>("/api/settings");
      set({
        email: settings.email,
        displayName: settings.displayName,
        role: settings.role,
        isHydrated: true,
      });
    } catch (error) {
      reportPersistenceError("load your profile", error);
      set({ isHydrated: true });
    }
  },

  setDisplayName: (name) => {
    set({ displayName: name });
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

  signOut: async () => {
    await apiPost("/api/auth/sign-out", {});
    window.location.assign("/sign-in");
  },
}));
