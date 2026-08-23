"use client";

import { create } from "zustand";
import type {
  Asset,
  AssetCategory,
  AssetDimensions,
  AssetFileType,
  AssetPreviewTone,
} from "@/types/asset";
import { ASSET_CATEGORY_META } from "@/constants/assets";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";

export type CreateAssetInput = {
  name: string;
  category: AssetCategory;
  tags: string[];
  type?: AssetFileType;
  dimensions?: AssetDimensions;
  size?: number;
  previewUrl?: string;
  previewTone?: AssetPreviewTone;
};

export type UpdateAssetMetadataInput = {
  name?: string;
  category?: AssetCategory;
  tags?: string[];
};

type AssetState = {
  assets: Asset[];
  isHydrated: boolean;
  /** Loads persisted assets. Safe to call multiple times. */
  hydrate: () => Promise<void>;
  /** Creates a new asset record and returns its id. Metadata persists; an
   *  uploaded file's preview is a session-scoped blob URL and will not
   *  survive a refresh (no object storage yet — see docs §4.7). */
  createAsset: (input: CreateAssetInput) => string;
  /** Updates editable metadata (name, category, tags) for an existing asset. */
  updateAssetMetadata: (id: string, updates: UpdateAssetMetadataInput) => void;
  /** Soft-removes an asset from active views. History is preserved. */
  archiveAsset: (id: string) => void;
};

let draftCounter = 0;

function nextAssetId(): string {
  draftCounter += 1;
  return `asset-${Date.now()}-${draftCounter}`;
}

function reportPersistenceError(action: string, error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[GitaVerse] asset store failed to ${action}:`, error);
  usePersistenceStatusStore
    .getState()
    .reportError(`Couldn't save "${action}" — ${detail}. Your change may not survive a refresh.`);
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      const assets = await apiGet<Asset[]>("/api/assets");
      set({ assets, isHydrated: true });
    } catch (error) {
      reportPersistenceError("load assets from the workspace data file", error);
      set({ isHydrated: true });
    }
  },

  createAsset: ({ name, category, tags, type = "other", dimensions, size, previewUrl, previewTone }) => {
    const id = nextAssetId();
    const now = new Date().toISOString();

    const newAsset: Asset = {
      id,
      name: name.trim(),
      type,
      category,
      tags,
      dimensions,
      size,
      previewTone: previewTone ?? ASSET_CATEGORY_META[category].tone,
      previewUrl,
      createdAt: now,
      updatedAt: now,
      status: "active",
    };

    set((state) => ({ assets: [newAsset, ...state.assets] }));
    // The blob: preview URL is intentionally omitted from the persisted
    // record — it is only valid for this browser session and would be a
    // dead reference after reload/restart.
    const { previewUrl: _previewUrl, ...persistable } = newAsset;
    void apiPost("/api/assets", persistable).catch((error) =>
      reportPersistenceError("create asset", error),
    );
    return id;
  },

  updateAssetMetadata: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              ...updates,
              name: updates.name !== undefined ? updates.name.trim() : asset.name,
              updatedAt: now,
            }
          : asset,
      ),
    }));
    void apiPatch(`/api/assets/${id}`, { ...updates, updatedAt: now }).catch((error) =>
      reportPersistenceError("update asset metadata", error),
    );
  },

  archiveAsset: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, status: "archived", updatedAt: now } : asset,
      ),
    }));
    void apiPatch(`/api/assets/${id}`, { status: "archived", updatedAt: now }).catch((error) =>
      reportPersistenceError("archive asset", error),
    );
  },
}));
