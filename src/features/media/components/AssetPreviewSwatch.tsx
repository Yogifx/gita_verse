import type { Asset } from "@/types/asset";
import { ASSET_CATEGORY_META, ASSET_PREVIEW_TONE_CLASSES } from "@/constants/assets";
import { cn } from "@/lib/utils/cn";

type AssetPreviewSwatchProps = {
  asset: Pick<Asset, "category" | "previewTone" | "previewUrl" | "name">;
  className?: string;
  iconClassName?: string;
};

/**
 * Visual stand-in for a real thumbnail. Seeded assets have no backing file,
 * so they render as a restrained tone + category-icon swatch instead of a
 * placeholder photo — user-uploaded assets show their real object-URL preview.
 */
export function AssetPreviewSwatch({ asset, className, iconClassName }: AssetPreviewSwatchProps) {
  if (asset.previewUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.previewUrl}
        alt={asset.name}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const Icon = ASSET_CATEGORY_META[asset.category].icon;

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        ASSET_PREVIEW_TONE_CLASSES[asset.previewTone],
        className,
      )}
    >
      <Icon className={cn("h-8 w-8 opacity-80", iconClassName)} />
    </div>
  );
}
