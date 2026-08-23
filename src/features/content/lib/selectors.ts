import type { ContentItem } from "@/types/content";
import {
  CONTENT_FORMAT_META,
  STATUS_META,
  type ContentFilterKey,
} from "@/constants/content";

export type { ContentFilterKey };

export type DailyBucket = "today" | "upcoming" | "completed";

export function getActiveItems(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => !item.archived);
}

export function getItemById(items: ContentItem[], id: string): ContentItem | undefined {
  return items.find((item) => item.id === id);
}

export function searchContentItems(items: ContentItem[], query: string): ContentItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) =>
    [
      item.title,
      String(item.reference.chapter),
      `chapter ${item.reference.chapter}`,
      item.reference.verseLabel,
      `verse ${item.reference.verseLabel}`,
      item.reference.chapterTitle,
      CONTENT_FORMAT_META[item.format].label,
      STATUS_META[item.status].label,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function filterContentItems(
  items: ContentItem[],
  filter: ContentFilterKey,
): ContentItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.format === filter || item.status === filter);
}

export function getDailyBucket(item: ContentItem): DailyBucket {
  if (item.status === "published") return "completed";
  if (item.isToday) return "today";
  return "upcoming";
}

export function getReviewStatusLabel(item: ContentItem): string {
  switch (item.status) {
    case "draft":
      return "Not yet submitted for review";
    case "ai_generated":
    case "in_review":
      return "Awaiting your review";
    case "approved":
      return "Approved by you";
    case "scheduled":
      return "Approved · scheduled to publish";
    case "published":
      return "Approved · published";
    default:
      return "—";
  }
}
