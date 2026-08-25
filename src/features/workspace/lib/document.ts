import type { ContentFormat, ContentItem, GitaReference } from "@/types/content";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Builds initial editor HTML from a persisted item, including seed records without `body`. */
export function bodyFromItem(item: ContentItem): string {
  if (item.body && item.body.trim() && item.body !== "<p></p>") {
    return item.body;
  }

  const parts: string[] = [];
  if (item.meaning.trim()) {
    parts.push(`<p>${escapeHtml(item.meaning.trim())}</p>`);
  }
  if (item.keyLearning.trim()) {
    parts.push(
      `<h3>Key learning</h3><p>${escapeHtml(item.keyLearning.trim())}</p>`,
    );
  }
  return parts.join("") || "<p></p>";
}

export const FORMAT_EDITOR_PLACEHOLDER: Record<ContentFormat, string> = {
  post: "Write the teaching for this post — one idea, clearly stated…",
  carousel:
    "Write the carousel script. One idea per paragraph for now; slide structure arrives in a later milestone…",
  reel: "Write the reel script — hook, teaching, and close…",
  session:
    "Write the session plan — opening, verse study, discussion, and practice…",
};

export const UNSET_REFERENCE: GitaReference = {
  chapter: 0,
  verseLabel: "—",
  chapterTitle: "Scripture scope not yet selected",
};
