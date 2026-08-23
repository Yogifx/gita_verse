import { Upload } from "lucide-react";
import type { Asset } from "@/types/asset";
import { AssetCard } from "@/features/media/components/AssetCard";

type AssetGridProps = {
  assets: Asset[];
  hasAnyAssets: boolean;
  onSelect: (id: string) => void;
  onUpload: () => void;
};

export function AssetGrid({ assets, hasAnyAssets, onSelect, onUpload }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="text-body text-foreground-secondary">
          {hasAnyAssets
            ? "Nothing matches your search or filter."
            : "No assets yet. Upload your first reusable asset to get started."}
        </p>
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <Upload className="h-4 w-4" />
          Upload Asset
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onSelect={onSelect} />
      ))}
    </div>
  );
}
