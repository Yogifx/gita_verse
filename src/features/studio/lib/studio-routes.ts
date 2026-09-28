import type { ContentItem } from "@/types/content";
import type { BriefFormat } from "@/types/brief";

export function studioHref(item: Pick<ContentItem, "id" | "format" | "output">): string {
  if (item.output?.format === "reel" || item.output?.format === "carousel" || item.output?.format === "post") {
    return `/studio/review?item=${item.id}`;
  }
  return `/studio?format=${item.format}&item=${item.id}`;
}

export function verseCreateHref(
  verse = "2.47",
  format?: Extract<BriefFormat, "reel" | "carousel" | "post">,
): string {
  const params = new URLSearchParams({ verse });
  if (format) params.set("format", format);
  return `/studio/create?${params.toString()}`;
}
