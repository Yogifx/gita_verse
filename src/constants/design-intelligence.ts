import type { LucideIcon } from "lucide-react";
import { GraduationCap, Palette } from "lucide-react";
import type { ContentFormat } from "@/types/content";
import type { GuidanceCategory } from "@/types/design-intelligence";

export const GUIDANCE_CATEGORY_META: Record<
  GuidanceCategory,
  { label: string; icon: LucideIcon; description: string }
> = {
  visual: {
    label: "Visual Design",
    icon: Palette,
    description: "Composition, typography, and restraint drawn from the GitaVerse design system.",
  },
  pedagogical: {
    label: "Pedagogical Design",
    icon: GraduationCap,
    description: "How to frame a verse so the teaching lands clearly.",
  },
};

/** A guidance filter matches a content format, or "all". */
export type GuidanceFilterKey = "all" | ContentFormat;

export const GUIDANCE_LIBRARY_FILTERS: { key: GuidanceFilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "carousel", label: "Carousel" },
  { key: "post", label: "Post" },
  { key: "reel", label: "Reel / Short" },
];

/** Coverage tone thresholds for the chapter map — gold once a chapter is well-represented. */
export const CHAPTER_COVERAGE_THRESHOLDS = {
  none: 0,
  light: 1,
  strong: 3,
};
