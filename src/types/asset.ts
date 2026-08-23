/**
 * Media & Assets contracts — see docs/09_PRODUCT_ARCHITECTURE.md (§4.7).
 * Structured so a future object-storage/CDN layer can populate the same
 * shape without UI changes. `previewUrl` is a session-scoped object URL for
 * user-uploaded assets (no persistence); seeded assets render a tone/icon
 * swatch instead of a real file.
 */

export type AssetFileType = "png" | "jpg" | "svg" | "webp" | "other";

export type AssetCategory = "backgrounds" | "images" | "brand" | "illustrations";

export type AssetStatus = "active" | "archived";

export type AssetPreviewTone = "gold" | "indigo" | "success" | "warning" | "neutral";

export type AssetDimensions = {
  width: number;
  height: number;
};

export type Asset = {
  id: string;
  name: string;
  type: AssetFileType;
  category: AssetCategory;
  tags: string[];
  dimensions?: AssetDimensions;
  /** File size in bytes. */
  size?: number;
  previewTone: AssetPreviewTone;
  /** Session-scoped object URL — set only for assets uploaded in this session. */
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: AssetStatus;
};
