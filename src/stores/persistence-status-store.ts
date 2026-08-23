"use client";

import { create } from "zustand";

/**
 * Centralizes persistence write/read failures across all feature stores so
 * they can be surfaced once in the shell (see PersistenceStatusToast)
 * instead of being silently swallowed inside each store's optimistic-update
 * logic.
 */
type PersistenceStatusState = {
  message: string | null;
  reportError: (message: string) => void;
  clear: () => void;
};

export const usePersistenceStatusStore = create<PersistenceStatusState>((set) => ({
  message: null,
  reportError: (message) => set({ message }),
  clear: () => set({ message: null }),
}));
