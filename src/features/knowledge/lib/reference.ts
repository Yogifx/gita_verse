/**
 * Verse-address parsing and formatting for the Gita Knowledge Layer.
 * Pure functions — safe to use on the server or in client components.
 */

import type { VerseAddress } from "@/types/knowledge";

export const VERSE_ID_PREFIX = "bg";

/** `2.47` — the canonical human-facing reference form. */
export function formatReference(chapter: number, verse: number): string {
  return `${chapter}.${verse}`;
}

/** `bg-2-47` — the canonical stable id used by corpus records and citations. */
export function formatVerseId(chapter: number, verse: number): string {
  return `${VERSE_ID_PREFIX}-${chapter}-${verse}`;
}

export function formatVerseLabel(chapter: number, verse: number): string {
  return `Bhagavad Gita ${formatReference(chapter, verse)}`;
}

/**
 * Accepts the address forms other modules realistically hold: `2.47`, `2:47`,
 * `2-47`, `bg-2-47`, and `BG 2.47`. Returns null for anything else so callers
 * can raise a precise validation error instead of guessing an address.
 */
export function parseVerseAddress(input: string): VerseAddress | null {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/^bhagavad\s*gita/, "")
    .replace(new RegExp(`^${VERSE_ID_PREFIX}[\\s-]*`), "")
    .trim();

  const match = /^(\d{1,2})\s*[.:\-\s]\s*(\d{1,3})$/.exec(normalized);
  if (!match) return null;

  const chapter = Number(match[1]);
  const verse = Number(match[2]);
  if (!Number.isInteger(chapter) || !Number.isInteger(verse)) return null;
  if (chapter < 1 || verse < 1) return null;

  return { chapter, verse };
}

/**
 * Folds IAST diacritics and case so a search for "karmany" matches
 * "karmaṇy". Devanagari is left untouched — it has no case or diacritic
 * folding to apply and must keep matching verbatim.
 */
export function normalizeSearchText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
