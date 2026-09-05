/**
 * GV-015.2 / GV-015.5 application-layer generation helpers.
 *
 * This is not a prompt framework. Format/title helpers stay here.
 * `GenerationRequest` is the provider-neutral port input. Structured
 * output is produced through GenerationPort.
 */

import { GENERATABLE_BRIEF_FORMATS, labelForBriefFormat } from "@/constants/briefs";
import { CONTENT_FORMAT_META } from "@/constants/content";
import type { BriefFormat, ContentBrief } from "@/types/brief";
import type { ContentFormat } from "@/types/content";
import type { VerseCitation } from "@/types/knowledge";

export type GenerationFormat = "reel" | "carousel" | "post";

/** Read-only verse identity for generation. Not a knowledge record. */
export type GenerationCitationContext = {
  verseId: string;
  label: string;
  reference: string;
  chapter: number;
  verse: number;
};

/**
 * Provider-neutral generation input. Planning fields + citation context
 * only. No owner, provider, model, prompt, or credentials.
 */
export type GenerationRequest = {
  format: GenerationFormat;
  hook: string;
  keyMessage: string;
  keyTeaching: string;
  meaning: string;
  contentGoal: string;
  citation: GenerationCitationContext;
};

export type GenerationInput = {
  brief: ContentBrief;
  citation: VerseCitation;
  format: ContentFormat;
};

export function generationFormatFromContent(format: ContentFormat): GenerationFormat | null {
  return format === "reel" || format === "carousel" || format === "post" ? format : null;
}

export function generationRequestFromBrief(
  brief: ContentBrief,
  citation: VerseCitation,
  format: GenerationFormat,
): GenerationRequest {
  return {
    format,
    hook: brief.hook,
    keyMessage: brief.keyMessage,
    keyTeaching: brief.keyTeaching,
    meaning: brief.meaning,
    contentGoal: brief.contentGoal,
    citation: {
      verseId: citation.id,
      label: citation.label,
      reference: citation.reference,
      chapter: citation.chapter,
      verse: citation.verse,
    },
  };
}

export function contentFormatFromBrief(format: BriefFormat): ContentFormat | null {
  return (GENERATABLE_BRIEF_FORMATS as string[]).includes(format)
    ? (format as ContentFormat)
    : null;
}

export function unsupportedBriefFormatMessage(format: BriefFormat): string {
  return (
    `This brief is a ${labelForBriefFormat(format)}. ` +
    "ContentItem currently supports Carousel, Post, and Reel. " +
    "Change the brief format to one of those before generating."
  );
}

export function titleFromGenerationInput(input: GenerationInput): string {
  const source = input.brief.keyMessage.trim() || input.brief.hook.trim();
  if (source) {
    const first = source.split("\n")[0]?.trim() ?? source;
    return first.length > 80 ? `${first.slice(0, 77)}…` : first;
  }
  return `${CONTENT_FORMAT_META[input.format].label} · ${input.citation.label}`;
}
