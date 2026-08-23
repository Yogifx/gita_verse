import { Tag } from "lucide-react";
import type { Asset } from "@/types/asset";
import { ASSET_CATEGORY_META, ASSET_FILE_TYPE_LABEL } from "@/constants/assets";
import { AssetPreviewSwatch } from "@/features/media/components/AssetPreviewSwatch";
import { formatDimensions, formatFileSize } from "@/features/media/lib/selectors";
import { formatRelativeTime } from "@/lib/utils/time";

type AssetCardProps = {
  asset: Asset;
  onSelect: (id: string) => void;
};

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(asset.id)}
      className="group flex flex-col overflow-hidden rounded-panel border border-border bg-surface text-left transition-colors duration-fast hover:border-primary-muted hover:bg-muted/40"
    >
      <div className="aspect-[4/3] w-full overflow-hidden border-b border-border">
        <AssetPreviewSwatch asset={asset} />
      </div>

      <div className="flex flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate font-medium text-foreground">{asset.name}</p>
          <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 text-small font-medium text-foreground-muted">
            {ASSET_FILE_TYPE_LABEL[asset.type]}
          </span>
        </div>

        <p className="text-caption text-foreground-muted">
          {ASSET_CATEGORY_META[asset.category].label}
          {asset.dimensions ? ` · ${formatDimensions(asset.dimensions)}` : ""}
        </p>

        {asset.tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="h-3 w-3 text-foreground-muted" />
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-small text-foreground-secondary"
              >
                {tag}
              </span>
            ))}
            {asset.tags.length > 3 ? (
              <span className="text-small text-foreground-muted">+{asset.tags.length - 3}</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-1 flex items-center justify-between text-caption text-foreground-muted">
          <span>{formatFileSize(asset.size)}</span>
          <span>Added {formatRelativeTime(asset.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}
