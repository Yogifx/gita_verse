"use client";

import { useEffect, useState } from "react";
import { fetchKnowledgeChapters, fetchVerseCitation } from "@/features/knowledge/lib/client";
import { formatReference, formatVerseId } from "@/features/knowledge/lib/reference";
import { ApiError } from "@/lib/api/client";
import type { GitaChapter, VerseCitation } from "@/types/knowledge";

type VerseSourcePickerProps = {
  verseId: string;
  onChange: (verseId: string, citation: VerseCitation | null) => void;
};

export function VerseSourcePicker({ verseId, onChange }: VerseSourcePickerProps) {
  const [chapters, setChapters] = useState<GitaChapter[]>([]);
  const [chapter, setChapter] = useState(0);
  const [verse, setVerse] = useState(0);
  const [citation, setCitation] = useState<VerseCitation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchKnowledgeChapters()
      .then((payload) => {
        if (!cancelled) setChapters(payload.chapters);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the Gita chapter list.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!verseId) {
      setChapter(0);
      setVerse(0);
      setCitation(null);
      return;
    }
    const parts = verseId.split("-");
    const parsedChapter = Number(parts[1]);
    const parsedVerse = Number(parts[2]);
    if (!parsedChapter || !parsedVerse) return;
    setChapter(parsedChapter);
    setVerse(parsedVerse);

    let cancelled = false;
    setLoading(true);
    void fetchVerseCitation(formatReference(parsedChapter, parsedVerse))
      .then((found) => {
        if (cancelled) return;
        setCitation(found);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load that verse from the Knowledge Layer.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [verseId]);

  const selectedChapter = chapters.find((entry) => entry.chapter === chapter);
  const verseCount = selectedChapter?.verseCount ?? 0;

  async function loadCitation(nextChapter: number, nextVerse: number) {
    if (!nextChapter || !nextVerse) {
      onChange("", null);
      setCitation(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const found = await fetchVerseCitation(formatReference(nextChapter, nextVerse));
      setCitation(found);
      onChange(found.id, found);
    } catch (caught) {
      setCitation(null);
      onChange("", null);
      setError(
        caught instanceof ApiError && caught.status === 404
          ? `No verified verse at ${formatReference(nextChapter, nextVerse)}.`
          : "Couldn't load that verse from the Knowledge Layer.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Chapter</span>
          <select
            value={chapter}
            onChange={(event) => {
              const next = Number(event.target.value);
              setChapter(next);
              setVerse(0);
              setCitation(null);
              onChange("", null);
            }}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={0}>Select chapter</option>
            {chapters.map((entry) => (
              <option key={entry.chapter} value={entry.chapter}>
                {entry.chapter}. {entry.nameTransliterated}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-foreground-secondary">Verse</span>
          <select
            value={verse}
            disabled={!chapter}
            onChange={(event) => {
              const next = Number(event.target.value);
              setVerse(next);
              void loadCitation(chapter, next);
            }}
            className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value={0}>Select verse</option>
            {Array.from({ length: verseCount }, (_, index) => index + 1).map((number) => (
              <option key={number} value={number}>
                {formatVerseId(chapter, number)} · {chapter}.{number}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p className="text-caption text-foreground-muted">Loading verified verse…</p> : null}
      {error ? <p className="text-caption text-danger">{error}</p> : null}

      {citation ? (
        <div className="rounded-control border border-border bg-background px-3 py-3">
          <p className="text-caption font-medium text-foreground-secondary">{citation.label}</p>
          <p className="mt-2 font-display text-body leading-relaxed text-foreground">{citation.sanskrit}</p>
          {citation.transliteration ? (
            <p className="mt-2 text-caption italic text-foreground-secondary">{citation.transliteration}</p>
          ) : (
            <p className="mt-2 text-caption text-foreground-muted">
              IAST is not available for this verse in the source corpus.
            </p>
          )}
          <p className="mt-2 text-caption text-foreground-muted">
            {citation.attribution.source} · {citation.attribution.license} · {citation.id}
          </p>
        </div>
      ) : (
        <p className="text-caption text-foreground-muted">
          Choose a chapter and verse. The brief stores only the verse id; Sanskrit stays in the
          Knowledge Layer.
        </p>
      )}
    </div>
  );
}
