"use client";

import { create } from "zustand";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";
import type { BriefAudience, BriefFormat, BriefTone, ContentBrief } from "@/types/brief";

export type BriefDraftInput = {
  projectId: string;
  verseId: string;
  meaning: string;
  keyTeaching: string;
  audience: BriefAudience;
  contentGoal: string;
  format: BriefFormat;
  hook: string;
  keyMessage: string;
  tone: BriefTone;
};

type BriefState = {
  briefs: ContentBrief[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  createBrief: (input: BriefDraftInput) => Promise<ContentBrief | undefined>;
  updateBrief: (id: string, patch: BriefDraftInput) => Promise<ContentBrief | undefined>;
};

let draftCounter = 0;

function nextBriefId(): string {
  draftCounter += 1;
  return `brief-${Date.now()}-${draftCounter}`;
}

function reportPersistenceError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[GitaVerse] brief store failed to ${action}:`, error);
  usePersistenceStatusStore
    .getState()
    .reportError(`Couldn't save "${action}" — ${detail}. Your change may not survive a refresh.`);
}

export const useBriefStore = create<BriefState>((set, get) => ({
  briefs: [],
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const briefs = await apiGet<ContentBrief[]>("/api/briefs");
      set({ briefs, isHydrated: true });
    } catch (error) {
      reportPersistenceError("load content briefs", error);
      set({ isHydrated: true });
    }
  },

  createBrief: async (input) => {
    const id = nextBriefId();
    const now = new Date().toISOString();
    const pending: ContentBrief = {
      id,
      ownerId: "",
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ briefs: [pending, ...state.briefs] }));
    try {
      const created = await apiPost<ContentBrief>("/api/briefs", pending);
      set((state) => ({
        briefs: state.briefs.map((entry) => (entry.id === id ? created : entry)),
      }));
      return created;
    } catch (error) {
      set((state) => ({ briefs: state.briefs.filter((entry) => entry.id !== id) }));
      reportPersistenceError("create content brief", error);
      return undefined;
    }
  },

  updateBrief: async (id, patch) => {
    const updatedAt = new Date().toISOString();
    set((state) => ({
      briefs: state.briefs.map((entry) => (entry.id === id ? { ...entry, ...patch, updatedAt } : entry)),
    }));
    try {
      const saved = await apiPatch<ContentBrief>(`/api/briefs/${id}`, { ...patch, updatedAt });
      set((state) => ({
        briefs: state.briefs.map((entry) => (entry.id === id ? saved : entry)),
      }));
      return saved;
    } catch (error) {
      reportPersistenceError("update content brief", error);
      return undefined;
    }
  },
}));
