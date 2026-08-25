/**
 * GV-015.2 application-layer generation helpers.
 *
 * This is not a prompt framework. It maps a Content Brief + one supported
 * ContentFormat into a structured ContentItem draft. A later provider can
 * consume the same `GenerationInput` without a giant universal prompt.
 */

import { GENERATABLE_BRIEF_FORMATS, labelForBriefFormat } from "@/constants/briefs";
import { CONTENT_FORMAT_META } from "@/constants/content";
import {
  audienceLineFromBrief,
  htmlFromContentOutput,
  outputFromBrief,
} from "@/features/content/lib/content-output";
import type { BriefFormat, ContentBrief } from "@/types/brief";
import type { ContentFormat, ContentOutput } from "@/types/content";
import type { VerseCitation } from "@/types/knowledge";

export type GenerationInput = {
  brief: ContentBrief;
  citation: VerseCitation;
  format: ContentFormat;
};

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

/**
 * One-way generate path: structured output first, then HTML for the editor.
 * Does not copy verified Sanskrit. Verse identity is a citation label only.
 */
export function draftFromGenerationInput(input: GenerationInput): {
  output: ContentOutput;
  body: string;
} {
  const output = outputFromBrief(input.brief, input.format);
  return {
    output,
    body: htmlFromContentOutput(output, {
      citationLabel: input.citation.label,
      audienceLine: audienceLineFromBrief(input.brief),
    }),
  };
}
