import type { LucideIcon } from "lucide-react";
import { Image as ImageIcon, Layers, PenTool, Sparkles } from "lucide-react";
import type { AssetCategory, AssetFileType, AssetPreviewTone } from "@/types/asset";

export const ASSET_CATEGORY_META: Record<
  AssetCategory,
  { label: string; icon: LucideIcon; tone: AssetPreviewTone }
> = {
  backgrounds: { label: "Backgrounds", icon: Layers, tone: "indigo" },
  images: { label: "Images", icon: ImageIcon, tone: "gold" },
  brand: { label: "Brand", icon: Sparkles, tone: "gold" },
  illustrations: { label: "Illustrations", icon: PenTool, tone: "success" },
};

export const ASSET_CATEGORIES: AssetCategory[] = [
  "backgrounds",
  "images",
  "brand",
  "illustrations",
];

export const ASSET_FILE_TYPE_LABEL: Record<AssetFileType, string> = {
  png: "PNG",
  jpg: "JPG",
  svg: "SVG",
  webp: "WEBP",
  other: "FILE",
};

export const ASSET_PREVIEW_TONE_CLASSES: Record<AssetPreviewTone, string> = {
  gold: "bg-primary-muted text-gold",
  indigo: "bg-secondary-muted text-indigo",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  neutral: "bg-muted text-foreground-secondary",
};

/** An Asset Library filter matches a category, or "all". */
export type AssetFilterKey = "all" | AssetCategory;

export const ASSET_LIBRARY_FILTERS: { key: AssetFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "backgrounds", label: "Backgrounds" },
  { key: "images", label: "Images" },
  { key: "brand", label: "Brand" },
  { key: "illustrations", label: "Illustrations" },
];
