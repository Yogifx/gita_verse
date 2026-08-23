"use client";

import { create } from "zustand";
import type { ContentFormat, ContentItem, Platform } from "@/types/content";
import { DAILY_TARGET, seedContentItems } from "@/features/content/data/seed";

type ContentState = {
  items: ContentItem[];
  dailyTarget: number;
  /** Creates a new draft content item and returns its id. */
  createContentItem: (format?: ContentFormat, platforms?: Platform[]) => string;
  /** Clones an existing item as a fresh draft and returns the new id. */
  duplicateContentItem: (id: string) => string | undefined;
  /** Soft-removes an item from active views. History is preserved. */
  archiveContentItem: (id: string) => void;
  /** Adds or removes a target platform on an item. */
  toggleItemPlatform: (id: string, platform: Platform) => void;
};

let draftCounter = 0;

function nextDraftId(): string {
  draftCounter += 1;
  return `draft-${Date.now()}-${draftCounter}`;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: seedContentItems,
  dailyTarget: DAILY_TARGET,

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
    return newId;
  },

  archiveContentItem: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, archived: true, updatedAt: now } : item,
      ),
    }));
  },

  toggleItemPlatform: (id, platform) => {
    const now = new Date().toISOString();
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item;
        const has = item.platforms.includes(platform);
        return {
          ...item,
          platforms: has
            ? item.platforms.filter((p) => p !== platform)
            : [...item.platforms, platform],
          updatedAt: now,
        };
      }),
    }));
  },
}));
