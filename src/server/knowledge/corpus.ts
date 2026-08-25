/**
 * Read-only loader for the local Bhagavad Gita corpus.
 *
 * Deliberate constraints (GV-014):
 * - No database. The corpus is canonical reference data shipped with the app,
 *   not user data, so it lives outside the GV-011 file store entirely.
 * - No external API at runtime. The JSON is imported statically so it is
 *   bundled and traced with the server build.
 * - No mutation. Records are deep-frozen; every accessor returns frozen data
 *   or a fresh derived object.
 *
 * Indexes are built once per server process and reused across requests.
 */

import rawCorpus from "@/features/knowledge/data/bhagavad-gita.json";
import { PersistenceError } from "@/server/persistence/errors";
import {
  formatReference,
  formatVerseId,
  normalizeSearchText,
} from "@/features/knowledge/lib/reference";
import type { GitaChapter, GitaCorpus, GitaVerseRecord } from "@/types/knowledge";

export type SearchIndexEntry = {
  verse: GitaVerseRecord;
  sanskrit: string;
  transliteration: string;
  reference: string;
};

type CorpusIndex = {
  corpus: GitaCorpus;
  chaptersByNumber: ReadonlyMap<number, GitaChapter>;
  versesByReference: ReadonlyMap<string, GitaVerseRecord>;
  versesById: ReadonlyMap<string, GitaVerseRecord>;
  versesByChapter: ReadonlyMap<number, readonly GitaVerseRecord[]>;
  searchIndex: readonly SearchIndexEntry[];
};

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

/**
 * Fails loudly at first use rather than serving a half-valid corpus. A corrupt
 * or truncated corpus is an infrastructure fault, so it surfaces as a
 * persistence error (503) rather than a not-found or a silent empty result.
 */
function validate(corpus: GitaCorpus): void {
  const problems: string[] = [];

  if (!corpus.provenance?.source || !corpus.provenance?.license) {
    problems.push("provenance is missing source/license attribution");
  }
  if (!Array.isArray(corpus.chapters) || corpus.chapters.length === 0) {
    problems.push("corpus has no chapters");
  }
  if (!Array.isArray(corpus.verses) || corpus.verses.length === 0) {
    problems.push("corpus has no verses");
  }
  if (problems.length > 0) {
    throw new PersistenceError(`Gita corpus is invalid: ${problems.join("; ")}`);
  }

  if (corpus.provenance.chapterCount !== corpus.chapters.length) {
    problems.push(
      `provenance chapterCount ${corpus.provenance.chapterCount} != ${corpus.chapters.length} chapters`,
    );
  }
  if (corpus.provenance.verseCount !== corpus.verses.length) {
    problems.push(
      `provenance verseCount ${corpus.provenance.verseCount} != ${corpus.verses.length} verses`,
    );
  }

  const seenIds = new Set<string>();
  const perChapter = new Map<number, number>();
  for (const verse of corpus.verses) {
    if (verse.id !== formatVerseId(verse.chapter, verse.verse)) {
      problems.push(`verse id "${verse.id}" does not match its chapter/verse address`);
    }
    if (seenIds.has(verse.id)) problems.push(`duplicate verse id "${verse.id}"`);
    seenIds.add(verse.id);
    if (!verse.sanskrit?.trim()) problems.push(`verse "${verse.id}" has empty Sanskrit text`);
    perChapter.set(verse.chapter, (perChapter.get(verse.chapter) ?? 0) + 1);
  }

  for (const chapter of corpus.chapters) {
    const actual = perChapter.get(chapter.chapter) ?? 0;
    if (actual !== chapter.verseCount) {
      problems.push(
        `chapter ${chapter.chapter} declares ${chapter.verseCount} verses but holds ${actual}`,
      );
    }
  }

  const orphans = [...perChapter.keys()].filter(
    (chapter) => !corpus.chapters.some((entry) => entry.chapter === chapter),
  );
  if (orphans.length > 0) {
    problems.push(`verses reference unknown chapters: ${orphans.join(", ")}`);
  }

  if (problems.length > 0) {
    throw new PersistenceError(`Gita corpus is invalid: ${problems.join("; ")}`);
  }
}

function buildIndex(): CorpusIndex {
  const corpus = deepFreeze(rawCorpus as unknown as GitaCorpus);
  validate(corpus);

  const chaptersByNumber = new Map<number, GitaChapter>();
  for (const chapter of corpus.chapters) chaptersByNumber.set(chapter.chapter, chapter);

  const versesByReference = new Map<string, GitaVerseRecord>();
  const versesById = new Map<string, GitaVerseRecord>();
  const versesByChapter = new Map<number, GitaVerseRecord[]>();
  const searchIndex: SearchIndexEntry[] = [];

  for (const verse of corpus.verses) {
    const reference = formatReference(verse.chapter, verse.verse);
    versesByReference.set(reference, verse);
    versesById.set(verse.id, verse);

    const bucket = versesByChapter.get(verse.chapter);
    if (bucket) bucket.push(verse);
    else versesByChapter.set(verse.chapter, [verse]);

    searchIndex.push({
      verse,
      reference,
      sanskrit: verse.sanskrit,
      transliteration: normalizeSearchText(verse.transliteration ?? ""),
    });
  }

  for (const bucket of versesByChapter.values()) bucket.sort((a, b) => a.verse - b.verse);

  return {
    corpus,
    chaptersByNumber,
    versesByReference,
    versesById,
    versesByChapter,
    searchIndex,
  };
}

let cached: CorpusIndex | null = null;

export function getCorpusIndex(): CorpusIndex {
  cached ??= buildIndex();
  return cached;
}
