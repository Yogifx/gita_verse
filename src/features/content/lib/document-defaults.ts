import type { ContentFormat } from "@/types/content";

/**
 * Sessions are long-form teaching documents, so a new one opens with a lesson
 * outline instead of a blank page. Social formats start empty and rely on the
 * editor placeholder.
 */
const SESSION_STARTER_BODY = [
  "<h2>Opening</h2><p></p>",
  "<h2>Verse study</h2><p></p>",
  "<h2>Discussion</h2><ul><li><p></p></li></ul>",
  "<h2>Practice for the week</h2><p></p>",
].join("");

export function starterBodyForFormat(format: ContentFormat): string {
  return format === "session" ? SESSION_STARTER_BODY : "";
}

export function starterTitleForFormat(format: ContentFormat): string {
  return format === "session" ? "Untitled session" : "Untitled idea";
}
