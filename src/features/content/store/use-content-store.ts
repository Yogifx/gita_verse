"use client";

import { create } from "zustand";
import type { ContentFormat, ContentItem, Platform } from "@/types/content";
import type { AppSettings } from "@/types/settings";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";

type ContentState = {
  items: ContentItem[];
  dailyTarget: number;
  /** True once initial data has been loaded from the persistence API. */
  isHydrated: boolean;
  /** Loads persisted content items + daily target. Safe to call multiple times. */
  hydrate: () => Promise<void>;
  /** Creates a new draft content item and returns its id. */
  createContentItem: (format?: ContentFormat, platforms?: Platform[]) => string;
  /** Clones an existing item as a fresh draft and returns the new id. */
  duplicateContentItem: (id: string) => string | undefined;
  /** Soft-removes an item from active views. History is preserved. */
  archiveContentItem: (id: string) => void;
  /** Adds or removes a target platform on an item. */
  toggleItemPlatform: (id: string, platform: Platform) => void;
  /** Updates the daily publishing target used across Dashboard widgets. */
  setDailyTarget: (target: number) => void;
};

let draftCounter = 0;

function nextDraftId(): string {
  draftCounter += 1;
  return `draft-${Date.now()}-${draftCounter}`;
}

/**
 * All writes below apply an optimistic local update first (unchanged
 * behavior from pre-GV-011), then persist through `/api/*` in the
 * background. Failures are logged and surfaced via the shared
 * persistence-status store rather than silently dropped — the local UI
 * keeps working, but the change did not survive a refresh/restart.
 */
function reportPersistenceError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[GitaVerse] content store failed to ${action}:`, error);
  usePersistenceStatusStore
    .getState()
    .reportError(`Couldn't save "${action}" — ${detail}. Your change may not survive a refresh.`);
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  dailyTarget: 1,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const [items, settings] = await Promise.all([
        apiGet<ContentItem[]>("/api/content"),
        apiGet<AppSettings>("/api/settings"),
      ]);
      set({ items, dailyTarget: settings.dailyTarget, isHydrated: true });
    } catch (error) {
      reportPersistenceError("load content from the workspace data file", error);
      set({ isHydrated: true });
    }
  },

  createContentItem: (format = "post", platforms = []) => {
    const id = nextDraftId();
    const now = new Date().toISOString();

    const newItem: ContentItem = {
      id,
      title: "Untitled idea",
      format,
      status: "draft",
      pipelineStage: "idea",
      reference: {
        chapter: 0,
        verseLabel: "—",
        chapterTitle: "Scripture scope not yet selected",
      },
      shloka: "",
      transliteration: "",
      meaning: "",
      keyLearning: "",
      platforms,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ items: [newItem, ...state.items] }));
    void apiPost("/api/content", newItem).catch((error) =>
      reportPersistenceError("create content item", error),
    );
    return id;
  },

  duplicateContentItem: (id) => {
    const original = get().items.find((item) => item.id === id);
    if (!original) return undefined;

    const newId = nextDraftId();
    const now = new Date().toISOString();

    const copy: ContentItem = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      status: "draft",
      pipelineStage: "idea",
      createdAt: now,
      updatedAt: now,
      scheduledFor: undefined,
      publishedAt: undefined,
      isToday: false,
      publishedThisWeek: false,
      archived: false,
    };

    set((state) => ({ items: [copy, ...state.items] }));
    void apiPost("/api/content", copy).catch((error) =>
      reportPersistenceError("duplicate content item", error),
    );
    return newId;
  },

  archiveContentItem: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, archived: true, updatedAt: now } : item,
      ),
    }));
    void apiPatch(`/api/content/${id}`, { archived: true, updatedAt: now }).catch((error) =>
      reportPersistenceError("archive content item", error),
    );
  },

  toggleItemPlatform: (id, platform) => {
    const now = new Date().toISOString();
    let nextPlatforms: Platform[] | undefined;

    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const has = item.platforms.includes(platform);
        nextPlatforms = has
          ? item.platforms.filter((p) => p !== platform)
          : [...item.platforms, platform];
        return { ...item, platforms: nextPlatforms, updatedAt: now };
      }),
    }));

    if (!nextPlatforms) return;
    void apiPatch(`/api/content/${id}`, { platforms: nextPlatforms, updatedAt: now }).catch(
      (error) => reportPersistenceError("update target platforms", error),
    );
  },

  setDailyTarget: (target) => {
    const clamped = Math.max(1, Math.round(target));
    set({ dailyTarget: clamped });
    void apiPatch("/api/settings", { dailyTarget: clamped }).catch((error) =>
      reportPersistenceError("update daily target", error),
    );
  },
}));
