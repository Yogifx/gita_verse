/**
 * Content Brief repository — project-owned intent records that point at
 * GV-014 verse ids. No scripture text is stored or mutated here.
 */

import {
  BRIEF_AUDIENCE_VALUES,
  BRIEF_FORMAT_VALUES,
  BRIEF_TONE_VALUES,
} from "@/constants/briefs";
import { getVerseCitationByAddress } from "@/server/repositories/knowledge.repository";
import { getProject } from "@/server/repositories/projects.repository";
import { readDb, mutateDb } from "@/server/persistence/file-store";
import { DuplicateRecordError, NotFoundError, ValidationError } from "@/server/persistence/errors";
import type { BriefAudience, BriefFormat, BriefTone, ContentBrief } from "@/types/brief";

export async function listContentBriefs(ownerId: string): Promise<ContentBrief[]> {
  const db = await readDb();
  return db.contentBriefs.filter((entry) => entry.ownerId === ownerId);
}

export async function getContentBrief(id: string, ownerId: string): Promise<ContentBrief> {
  const db = await readDb();
  const brief = db.contentBriefs.find((entry) => entry.id === id && entry.ownerId === ownerId);
  if (!brief) throw new NotFoundError("ContentBrief", id);
  return brief;
}

export async function createContentBrief(input: ContentBrief): Promise<ContentBrief> {
  await assertBrief(input);
  const record = normalizeBrief(input);

  return mutateDb((db) => {
    if (db.contentBriefs.some((entry) => entry.id === record.id)) {
      throw new DuplicateRecordError("ContentBrief", record.id);
    }
    return { db: { ...db, contentBriefs: [record, ...db.contentBriefs] }, result: record };
  });
}

export type ContentBriefPatch = Partial<Omit<ContentBrief, "id" | "ownerId">> & { updatedAt: string };

export async function updateContentBrief(
  id: string,
  ownerId: string,
  patch: ContentBriefPatch,
): Promise<ContentBrief> {
  const current = await getContentBrief(id, ownerId);
  const next: ContentBrief = { ...current, ...patch, id, ownerId };
  await assertBrief(next);
  const record = normalizeBrief(next);

  return mutateDb((db) => {
    const index = db.contentBriefs.findIndex((entry) => entry.id === id && entry.ownerId === ownerId);
    if (index === -1) throw new NotFoundError("ContentBrief", id);
    const contentBriefs = [...db.contentBriefs];
    contentBriefs[index] = record;
    return { db: { ...db, contentBriefs }, result: record };
  });
}

async function assertBrief(input: ContentBrief): Promise<void> {
  if (!input.id) throw new ValidationError("Content brief id is required.");
  if (!input.ownerId) throw new ValidationError("Content brief owner is required.");
  if (!input.projectId?.trim()) {
    throw new ValidationError("A Knowledge Project is required before a content brief can be saved.");
  }
  if (!input.verseId?.trim()) {
    throw new ValidationError("A verified verse is required before a content brief can be saved.");
  }
  if (!isAudience(input.audience)) throw new ValidationError("Audience is required.");
  if (!isFormat(input.format)) throw new ValidationError("Content format is required.");
  if (!isTone(input.tone)) throw new ValidationError("Tone is required.");
  if (!input.contentGoal?.trim()) throw new ValidationError("Content goal is required.");
  if (!input.keyMessage?.trim()) throw new ValidationError("Key message is required.");

  await getProject(input.projectId.trim(), input.ownerId);
  await getVerseCitationByAddress(input.verseId);
}

function normalizeBrief(input: ContentBrief): ContentBrief {
  return {
    ...input,
    projectId: input.projectId.trim(),
    verseId: input.verseId.trim(),
    meaning: input.meaning.trim(),
    keyTeaching: input.keyTeaching.trim(),
    contentGoal: input.contentGoal.trim(),
    hook: input.hook.trim(),
    keyMessage: input.keyMessage.trim(),
  };
}

function isAudience(value: string): value is BriefAudience {
  return (BRIEF_AUDIENCE_VALUES as string[]).includes(value);
}

function isFormat(value: string): value is BriefFormat {
  return (BRIEF_FORMAT_VALUES as string[]).includes(value);
}

function isTone(value: string): value is BriefTone {
  return (BRIEF_TONE_VALUES as string[]).includes(value);
}
