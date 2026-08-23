"use client";

import { create } from "zustand";
import type { CreatorRole } from "@/constants/settings";
import { DEFAULT_CREATOR_ROLE } from "@/constants/settings";

/**
 * Profile preference — ephemeral, non-canonical client state
 * (docs/09_PRODUCT_ARCHITECTURE.md §8.5), not real authentication/identity.
 * displayName starts empty so the Header avatar keeps today's "GV" default
 * until the user deliberately sets a name here.
 */
type SettingsState = {
  displayName: string;
  role: CreatorRole;
  setDisplayName: (name: string) => void;
  setRole: (role: CreatorRole) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  displayName: "",
  role: DEFAULT_CREATOR_ROLE,

  setDisplayName: (name) => set({ displayName: name }),
  setRole: (role) => set({ role }),
}));
