import type { ContentItem } from "@/types/content";
import { CONTENT_FORMATS, PLATFORMS } from "@/constants/content";
import type {
  ChapterCoverage,
  DesignGuideline,
  FormatCoverage,
  PlatformCoverage,
} from "@/types/design-intelligence";
import type { GuidanceFilterKey } from "@/constants/design-intelligence";
import { GITA_CHAPTERS } from "@/features/design-intelligence/data/gita-chapters";

function getActiveItems(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => !item.archived);
}

export function getFormatCoverage(items: ContentItem[]): FormatCoverage[] {
  const active = getActiveItems(items);
  return CONTENT_FORMATS.map((format) => {
    const formatItems = active.filter((item) => item.format === format);
    return {
      format,
      total: formatItems.length,
      published: formatItems.filter((item) => item.status === "published").length,
      inProgress: formatItems.filter((item) => item.status !== "published").length,
    };
  });
}

/** Coverage per Gita chapter, sorted so the least-covered chapters surface first. */
export function getChapterCoverage(items: ContentItem[]): ChapterCoverage[] {
  const active = getActiveItems(items);
  return GITA_CHAPTERS.map((chapterRef) => ({
    ...chapterRef,
    count: active.filter((item) => item.reference.chapter === chapterRef.chapter).length,
  })).sort((a, b) => a.count - b.count || a.chapter - b.chapter);
}

export function getUncoveredChapterCount(coverage: ChapterCoverage[]): number {
  return coverage.filter((entry) => entry.count === 0).length;
}

export function getPlatformCoverage(items: ContentItem[]): PlatformCoverage[] {
  const active = getActiveItems(items);
  return PLATFORMS.map((platform) => ({
    platform,
    count: active.filter((item) => item.platforms.includes(platform)).length,
  })).sort((a, b) => a.count - b.count);
}

export function filterGuidelines(
  guidelines: DesignGuideline[],
  filter: GuidanceFilterKey,
): DesignGuideline[] {
  if (filter === "all") return guidelines;
  return guidelines.filter((guideline) => guideline.format === filter);
}
