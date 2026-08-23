"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { useAssetStore } from "@/features/media/store/use-asset-store";
import {
  filterAssetsByCategory,
  getActiveAssets,
  searchAssets,
} from "@/features/media/lib/selectors";
import { ASSET_LIBRARY_FILTERS, type AssetFilterKey } from "@/constants/assets";
import { AssetSearch } from "@/features/media/components/AssetSearch";
import { AssetFilters } from "@/features/media/components/AssetFilters";
import { AssetGrid } from "@/features/media/components/AssetGrid";
import { UploadAssetModal } from "@/features/media/components/UploadAssetModal";
import { AssetPreviewModal } from "@/features/media/components/AssetPreviewModal";

export function AssetLibrary() {
  const assets = useAssetStore((s) => s.assets);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AssetFilterKey>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const searched = useMemo(
    () => searchAssets(getActiveAssets(assets), query),
    [assets, query],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const filterOption of ASSET_LIBRARY_FILTERS) {
      result[filterOption.key] = filterAssetsByCategory(searched, filterOption.key).length;
    }
    return result;
  }, [searched]);

  const visible = useMemo(() => filterAssetsByCategory(searched, filter), [searched, filter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AssetSearch value={query} onChange={setQuery} className="sm:max-w-md" />
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <Upload className="h-4 w-4" />
          Upload Asset
        </button>
      </div>

      <AssetFilters active={filter} onChange={setFilter} counts={counts} />

      <AssetGrid
        assets={visible}
        hasAnyAssets={assets.length > 0}
        onSelect={setPreviewId}
        onUpload={() => setUploadOpen(true)}
      />

      <UploadAssetModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <AssetPreviewModal assetId={previewId} onClose={() => setPreviewId(null)} />
    </div>
  );
}
