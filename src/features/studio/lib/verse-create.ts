import type { BriefDraftInput } from "@/features/briefs/store/use-brief-store";
import type { BriefFormat, ContentBrief } from "@/types/brief";
import type { ContentItem } from "@/types/content";
import type { KnowledgeProject } from "@/types/project";
import { getActiveProjects } from "@/features/projects/lib/selectors";
import { formatVerseId } from "@/features/knowledge/lib/reference";

export const FEATURED_VERSE_ADDRESS = "2.47";
export const FEATURED_VERSE_ID = formatVerseId(2, 47);

export function resolveStudioProjectId(projects: KnowledgeProject[]): string | undefined {
  const active = getActiveProjects(projects);
  return active.find((project) => project.id === "p1")?.id ?? active[0]?.id;
}

export function sourceItemForVerse(
  items: ContentItem[],
  chapter: number,
  verse: number,
): ContentItem | undefined {
  const label = String(verse);
  const matches = items.filter(
    (item) =>
      !item.archived &&
      item.reference.chapter === chapter &&
      item.reference.verseLabel === label &&
      item.meaning.trim(),
  );
  return (
    matches.find((item) => item.isToday && item.shloka.trim()) ??
    matches.find((item) => item.shloka.trim()) ??
    matches.find((item) => item.isToday) ??
    matches[0]
  );
}

export function reusableBriefForVerse(
  briefs: ContentBrief[],
  verseId: string,
  format: BriefFormat,
): ContentBrief | undefined {
  return briefs.find(
    (brief) =>
      brief.verseId === verseId &&
      brief.format === format &&
      brief.contentGoal.trim() &&
      brief.keyMessage.trim(),
  );
}

export function briefDraftFromVerseSource(options: {
  projectId: string;
  verseId: string;
  format: Extract<BriefFormat, "reel" | "carousel" | "post">;
  meaning: string;
  keyTeaching: string;
}): BriefDraftInput {
  const meaning = options.meaning.trim();
  const teaching = options.keyTeaching.trim();
  const isFeaturedVerse = options.verseId === FEATURED_VERSE_ID;

  return {
    projectId: options.projectId,
    verseId: options.verseId,
    meaning,
    keyTeaching: teaching,
    audience: "general_audience",
    contentGoal: isFeaturedVerse
      ? "Leave the viewer with one instruction: stay with the work in front of you, and release the outcome you cannot control."
      : "Help the viewer carry this teaching into daily life without changing the verse itself.",
    format: options.format,
    hook: isFeaturedVerse
      ? "You have a right to the work — never to the fruit."
      : firstSentence(teaching) || firstSentence(meaning),
    keyMessage: teaching || meaning,
    tone: "reflective",
  };
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const match = /^[^.!?]+[.!?]?/.exec(trimmed);
  return (match?.[0] ?? trimmed).trim();
}
