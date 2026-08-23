/**
 * Design Intelligence contracts — a deterministic, read-only guidance and
 * insights surface (see docs/09_PRODUCT_ARCHITECTURE.md §3 "Deterministic
 * product shell, probabilistic AI core"). No model calls; guidance is
 * curated reference data and insights are derived from real content data.
 */

import type { ContentFormat, Platform } from "@/types/content";

export type GuidanceCategory = "visual" | "pedagogical";

export type DesignGuideline = {
  id: string;
  format: ContentFormat;
  category: GuidanceCategory;
  title: string;
  principle: string;
  dos: string[];
  donts: string[];
};

export type GitaChapterRef = {
  chapter: number;
  title: string;
  theme: string;
};

export type ChapterCoverage = GitaChapterRef & {
  count: number;
};

export type FormatCoverage = {
  format: ContentFormat;
  total: number;
  published: number;
  inProgress: number;
};

export type PlatformCoverage = {
  platform: Platform;
  count: number;
};
