/**
 * Gita Knowledge Layer repository — verse-addressable retrieval over the local
 * corpus (docs/09_PRODUCT_ARCHITECTURE.md §4.5).
 *
 * Mirrors the GV-011 repository contract (async accessors, typed
 * NotFoundError/ValidationError) so callers treat it like any other
 * repository. It differs in two intentional ways: the data is global rather
 * than owner-scoped, so no `ownerId` is accepted or stored, and there are no
 * write paths at all.
 */

import { getCorpusIndex } from "@/server/knowledge/corpus";
import { NotFoundError, ValidationError } from "@/server/persistence/errors";
import {
  formatReference,
  formatVerseLabel,
  normalizeSearchText,
  parseVerseAddress,
} from "@/features/knowledge/lib/reference";
import type {
  ChapterDetail,
  CorpusAttribution,
  CorpusProvenance,
  GitaChapter,
  GitaVerseRecord,
  VerseAddress,
  VerseCitation,
  VerseSearchField,
  VerseSearchHit,
  VerseSearchResult,
} from "@/types/knowledge";

export const DEFAULT_SEARCH_LIMIT = 20;
export const MAX_SEARCH_LIMIT = 100;
const MIN_QUERY_LENGTH = 2;

export async function getCorpusProvenance(): Promise<CorpusProvenance> {
  return getCorpusIndex().corpus.provenance;
}

export async function getCorpusAttribution(): Promise<CorpusAttribution> {
  const { source, sourceUrl, license, sourceCommit } = getCorpusIndex().corpus.provenance;
  return { source, sourceUrl, license, sourceCommit };
}

export async function listChapters(): Promise<GitaChapter[]> {
  return [...getCorpusIndex().corpus.chapters].sort((a, b) => a.chapter - b.chapter);
}

export async function getChapter(chapter: number): Promise<GitaChapter> {
  assertPositiveInteger(chapter, "Chapter");
  const found = getCorpusIndex().chaptersByNumber.get(chapter);
  if (!found) throw new NotFoundError("GitaChapter", String(chapter));
  return found;
}

/** Chapter metadata plus every verse in it, as citation objects. */
export async function getChapterDetail(chapter: number): Promise<ChapterDetail> {
  const found = await getChapter(chapter);
  const verses = getCorpusIndex().versesByChapter.get(chapter) ?? [];
  return { ...found, verses: verses.map((verse) => toCitation(verse)) };
}

export async function getVerse(chapter: number, verse: number): Promise<GitaVerseRecord> {
  assertPositiveInteger(chapter, "Chapter");
  assertPositiveInteger(verse, "Verse");

  // Distinguish "no such chapter" from "chapter exists, verse out of range" so
  // callers get an accurate message instead of a generic miss.
  await getChapter(chapter);

  const reference = formatReference(chapter, verse);
  const found = getCorpusIndex().versesByReference.get(reference);
  if (!found) throw new NotFoundError("GitaVerse", reference);
  return found;
}

export async function getVerseCitation(chapter: number, verse: number): Promise<VerseCitation> {
  return toCitation(await getVerse(chapter, verse));
}

/**
 * Resolves any supported address form (`2.47`, `bg-2-47`, `BG 2.47`) to a
 * citation. Unparseable input is a validation error, not a not-found.
 */
export async function getVerseCitationByAddress(address: string): Promise<VerseCitation> {
  const parsed = resolveAddress(address);
  return getVerseCitation(parsed.chapter, parsed.verse);
}

export function resolveAddress(address: string): VerseAddress {
  const parsed = parseVerseAddress(address ?? "");
  if (!parsed) {
    throw new ValidationError(
      `"${address}" is not a valid verse reference. Use chapter.verse, for example 2.47.`,
    );
  }
  return parsed;
}

/**
 * Retrieval across verse references, Devanagari, and transliteration.
 * Reference-shaped queries resolve to the exact verse; text queries fold IAST
 * diacritics and case, while Devanagari matches verbatim.
 */
export async function searchVerses(
  query: string,
  options?: { limit?: number },
): Promise<VerseSearchResult> {
  const raw = (query ?? "").trim();
  if (raw.length < MIN_QUERY_LENGTH) {
    throw new ValidationError(`Search query must be at least ${MIN_QUERY_LENGTH} characters.`);
  }

  const limit = normalizeLimit(options?.limit);
  const address = parseVerseAddress(raw);
  if (address) {
    const found = getCorpusIndex().versesByReference.get(
      formatReference(address.chapter, address.verse),
    );
    const hits: VerseSearchHit[] = found
      ? [{ citation: toCitation(found), matchedOn: "reference" }]
      : [];
    return { query: raw, total: hits.length, limit, hits };
  }

  const needle = normalizeSearchText(raw);
  const matches: VerseSearchHit[] = [];

  for (const entry of getCorpusIndex().searchIndex) {
    let matchedOn: VerseSearchField | null = null;
    if (entry.transliteration && entry.transliteration.includes(needle)) {
      matchedOn = "transliteration";
    } else if (entry.sanskrit.includes(raw)) {
      matchedOn = "sanskrit";
    }
    if (matchedOn) matches.push({ citation: toCitation(entry.verse), matchedOn });
  }

  return { query: raw, total: matches.length, limit, hits: matches.slice(0, limit) };
}

/** Builds the citation object other modules attach to documents and reviews. */
export function toCitation(verse: GitaVerseRecord): VerseCitation {
  const index = getCorpusIndex();
  const chapter = index.chaptersByNumber.get(verse.chapter);
  const { source, sourceUrl, license, sourceCommit } = index.corpus.provenance;

  return {
    ...verse,
    reference: formatReference(verse.chapter, verse.verse),
    label: formatVerseLabel(verse.chapter, verse.verse),
    chapterName: chapter?.name ?? "",
    chapterNameTransliterated: chapter?.nameTransliterated ?? "",
    attribution: { source, sourceUrl, license, sourceCommit },
  };
}

function normalizeLimit(limit?: number): number {
  if (limit === undefined) return DEFAULT_SEARCH_LIMIT;
  if (!Number.isInteger(limit) || limit < 1) {
    throw new ValidationError("Search limit must be a positive integer.");
  }
  return Math.min(limit, MAX_SEARCH_LIMIT);
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new ValidationError(`${label} must be a positive integer.`);
  }
}
