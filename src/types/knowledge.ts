/**
 * Gita Knowledge Layer contracts (docs/09_PRODUCT_ARCHITECTURE.md §4.5).
 *
 * The corpus is canonical reference data, not user-generated work: it carries
 * no `ownerId`, is never mutated, and is read from a local file bundled with
 * the application rather than the GV-011 user database.
 */

/** A verse whose upstream transliteration was unusable and deliberately omitted. */
export type TransliterationGap = {
  id: string;
  /** Human-facing `chapter.verse` form, e.g. `10.33`. */
  reference: string;
  issue: string;
};

/** Source attribution and import audit trail stored alongside the corpus. */
export type CorpusProvenance = {
  source: string;
  sourceUrl: string;
  license: string;
  sourceCommit: string;
  sourceCommitDate: string;
  sourceFiles: string[];
  importedAt: string;
  chapterCount: number;
  verseCount: number;
  transliterationCount: number;
  contents: string;
  numberingNote: string;
  verbatimNote: string;
  transliterationGaps: TransliterationGap[];
};

/**
 * Compact attribution attached to every retrieval result so consuming modules
 * (authoring citations, review, future agents) can never surface scripture
 * without its source.
 */
export type CorpusAttribution = Pick<
  CorpusProvenance,
  "source" | "sourceUrl" | "license" | "sourceCommit"
>;

export type GitaChapter = {
  chapter: number;
  /** Devanagari chapter name as published by the source. */
  name: string;
  nameTransliterated: string;
  verseCount: number;
};

export type GitaVerseRecord = {
  /** Stable address in `bg-<chapter>-<verse>` form. */
  id: string;
  chapter: number;
  verse: number;
  /** Devanagari text, verbatim from the source. */
  sanskrit: string;
  /** IAST transliteration; absent where the source value was unusable. */
  transliteration?: string;
};

export type GitaCorpus = {
  provenance: CorpusProvenance;
  chapters: GitaChapter[];
  verses: GitaVerseRecord[];
};

/** A resolved verse address, before lookup. */
export type VerseAddress = {
  chapter: number;
  verse: number;
};

/**
 * Citation object consumed by other modules — a verse plus the chapter context
 * and attribution needed to render or ground a reference on its own.
 */
export type VerseCitation = GitaVerseRecord & {
  /** `chapter.verse`, e.g. `2.47`. */
  reference: string;
  /** Display label, e.g. `Bhagavad Gita 2.47`. */
  label: string;
  chapterName: string;
  chapterNameTransliterated: string;
  attribution: CorpusAttribution;
};

export type ChapterDetail = GitaChapter & {
  verses: VerseCitation[];
};

/** Which field produced a search hit, so callers can explain the match. */
export type VerseSearchField = "reference" | "sanskrit" | "transliteration";

export type VerseSearchHit = {
  citation: VerseCitation;
  matchedOn: VerseSearchField;
};

export type VerseSearchResult = {
  query: string;
  total: number;
  limit: number;
  hits: VerseSearchHit[];
};
