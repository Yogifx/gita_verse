/**
 * GV-015.2 / GV-015.3 generate action: Content Brief → one ContentItem
 * with structured `output` and a one-way HTML `body` projection.
 * No job table, no provider, no prompt store. Sanskrit stays in GV-014.
 */

import { randomUUID } from "node:crypto";
import {
  contentFormatFromBrief,
  draftFromGenerationInput,
  titleFromGenerationInput,
  unsupportedBriefFormatMessage,
  type GenerationInput,
} from "@/features/content/lib/brief-generation";
import { getContentBrief } from "@/server/repositories/briefs.repository";
import { createContentItem } from "@/server/repositories/content.repository";
import { getVerseCitationByAddress } from "@/server/repositories/knowledge.repository";
import { ValidationError } from "@/server/persistence/errors";
import type { ContentItem } from "@/types/content";

export async function generateContentItemFromBrief(
  ownerId: string,
  briefId: string,
): Promise<ContentItem> {
  const id = briefId.trim();
  if (!id) {
    throw new ValidationError("A content brief is required to generate content.");
  }

  const brief = await getContentBrief(id, ownerId);

  const format = contentFormatFromBrief(brief.format);
  if (!format) {
    throw new ValidationError(unsupportedBriefFormatMessage(brief.format));
  }

  if (!brief.contentGoal.trim() || !brief.keyMessage.trim()) {
    throw new ValidationError(
      "This brief needs a content goal and key message before content can be generated.",
    );
  }

  const citation = await getVerseCitationByAddress(brief.verseId);
  const input: GenerationInput = { brief, citation, format };
  const { output, body } = draftFromGenerationInput(input);
  const now = new Date().toISOString();

  return createContentItem({
    id: `content-${Date.now()}-${randomUUID().slice(0, 8)}`,
    ownerId,
    briefId: brief.id,
    title: titleFromGenerationInput(input),
    format,
    status: "ai_generated",
    pipelineStage: "script",
    reference: {
      chapter: citation.chapter,
      verseLabel: String(citation.verse),
      chapterTitle: citation.chapterNameTransliterated || citation.chapterName,
    },
    // Legacy snapshot fields stay on the record shape but are not filled
    // from the corpus. Verified Sanskrit remains in GV-014.
    shloka: "",
    transliteration: "",
    meaning: brief.meaning,
    keyLearning: brief.keyTeaching,
    output,
    body,
    platforms: [],
    createdAt: now,
    updatedAt: now,
  });
}
