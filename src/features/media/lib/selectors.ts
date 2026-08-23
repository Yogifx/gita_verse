import type { Asset } from "@/types/asset";
import { ASSET_CATEGORY_META, type AssetFilterKey } from "@/constants/assets";

export function getActiveAssets(assets: Asset[]): Asset[] {
  return assets.filter((asset) => asset.status !== "archived");
}

export function getAssetById(assets: Asset[], id: string): Asset | undefined {
  return assets.find((asset) => asset.id === id);
}

export function searchAssets(assets: Asset[], query: string): Asset[] {
  const q = query.trim().toLowerCase();
  if (!q) return assets;

  return assets.filter((asset) => {
    const haystack = [asset.name, ASSET_CATEGORY_META[asset.category].label, ...asset.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function filterAssetsByCategory(assets: Asset[], filter: AssetFilterKey): Asset[] {
  if (filter === "all") return assets;
  return assets.filter((asset) => asset.category === filter);
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

export function formatDimensions(dimensions?: { width: number; height: number }): string {
  if (!dimensions) return "—";
  return `${dimensions.width} × ${dimensions.height} px`;
}
