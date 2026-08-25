/**
 * GV-015.2 application-layer generation helpers.
 *
 * This is not a prompt framework. It maps a Content Brief + one supported
 * ContentFormat into a structured ContentItem draft. A later provider can
 * consume the same `GenerationInput` without a giant universal prompt.
 */

import {
  GENERATABLE_BRIEF_FORMATS,
  labelForAudience,
  labelForBriefFormat,
  labelForTone,
} from "@/constants/briefs";
import { CONTENT_FORMAT_META } from "@/constants/content";
import type { BriefFormat, ContentBrief } from "@/types/brief";
import type { ContentFormat } from "@/types/content";
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
 * Composes brief fields into editor HTML. Does not copy verified Sanskrit.
 * Verse identity is a citation label only.
 */
export function draftBodyFromGenerationInput(input: GenerationInput): string {
  const { brief, citation, format } = input;
  const source = `<p>${escapeHtml(citation.label)}</p>`;
  const audience = `<p>${escapeHtml(
    `${labelForAudience(brief.audience)} · ${labelForTone(brief.tone)}`,
  )}</p>`;

  if (format === "reel") {
    return joinBlocks([
      source,
      audience,
      labeledBlock("Hook", brief.hook),
      labeledBlock("Teaching", brief.keyMessage),
      labeledBlock("Close", brief.contentGoal),
    ]);
  }

  if (format === "carousel") {
    return joinBlocks([
      source,
      audience,
      labeledBlock("Slide 1 — Hook", brief.hook),
      labeledBlock("Slide 2 — Key message", brief.keyMessage),
      labeledBlock("Slide 3 — Teaching", brief.keyTeaching),
      labeledBlock("Slide 4 — Goal", brief.contentGoal),
    ]);
  }

  return joinBlocks([
    source,
    audience,
    labeledBlock("Hook", brief.hook),
    labeledBlock("Key message", brief.keyMessage),
    labeledBlock("Meaning", brief.meaning),
    labeledBlock("Goal", brief.contentGoal),
  ]);
}

function labeledBlock(label: string, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const paragraphs = trimmed
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line.trim())}</p>`)
    .join("");
  return `<h2>${escapeHtml(label)}</h2>${paragraphs}`;
}

function joinBlocks(blocks: string[]): string {
  return blocks.filter(Boolean).join("") || "<p></p>";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
