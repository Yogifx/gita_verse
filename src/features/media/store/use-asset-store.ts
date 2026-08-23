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
import { seedAssets } from "@/features/media/data/seed";

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
  /** Creates a new mock asset record and returns its id. No file persistence occurs. */
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

export const useAssetStore = create<AssetState>((set) => ({
  assets: seedAssets,

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
  },

  archiveAsset: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, status: "archived", updatedAt: now } : asset,
      ),
    }));
  },
}));
