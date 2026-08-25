"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Check, LoaderCircle, Save } from "lucide-react";
import type { ContentItem, GitaReference, Platform } from "@/types/content";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CONTENT_FORMAT_META } from "@/constants/content";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { PlatformTargetPicker } from "@/features/content-studio/components/PlatformTargetPicker";
import { starterTitleForFormat } from "@/features/content/lib/document-defaults";
import { WORKSPACE_CHAPTERS, chapterTitleFor } from "@/features/workspace/data/chapters";
import {
  FORMAT_EDITOR_PLACEHOLDER,
  UNSET_REFERENCE,
  bodyFromItem,
} from "@/features/workspace/lib/document";

const DocumentEditor = dynamic(
  () => import("@/components/editor/DocumentEditor").then((mod) => mod.DocumentEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[20rem] items-center justify-center rounded-control border border-border bg-background text-caption text-foreground-muted">
        Loading editor…
      </div>
    ),
  },
);

type CreativeWorkspaceProps = {
  item: ContentItem;
};

type Draft = {
  title: string;
  body: string;
  shloka: string;
  transliteration: string;
  meaning: string;
  keyLearning: string;
  reference: GitaReference;
  platforms: Platform[];
};

function draftFromItem(item: ContentItem): Draft {
  return {
    title: item.title,
    body: bodyFromItem(item),
    shloka: item.shloka,
    transliteration: item.transliteration,
    meaning: item.meaning,
    keyLearning: item.keyLearning,
    reference: { ...item.reference },
    platforms: [...item.platforms],
  };
}

function sameStringArray(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function CreativeWorkspace({ item }: CreativeWorkspaceProps) {
  const updateContentItem = useContentStore((s) => s.updateContentItem);
  const [draft, setDraft] = useState<Draft>(() => draftFromItem(item));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(draftFromItem(item));
    setStatus("idle");
    setError(null);
    // Reset the draft only when opening a different piece, not on store refreshes after save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const dirty = useMemo(() => {
    const original = draftFromItem(item);
    return (
      draft.title !== original.title ||
      draft.body !== original.body ||
      draft.shloka !== original.shloka ||
      draft.transliteration !== original.transliteration ||
      draft.meaning !== original.meaning ||
      draft.keyLearning !== original.keyLearning ||
      draft.reference.chapter !== original.reference.chapter ||
      draft.reference.verseLabel !== original.reference.verseLabel ||
      draft.reference.chapterTitle !== original.reference.chapterTitle ||
      !sameStringArray(draft.platforms, original.platforms)
    );
  }, [draft, item]);

  const saveRef = useRef<() => Promise<void>>(async () => undefined);
  const dirtyRef = useRef(dirty);
  const savingRef = useRef(status === "saving");
  dirtyRef.current = dirty;
  savingRef.current = status === "saving";

  async function handleSave() {
    const title = draft.title.trim() || starterTitleForFormat(item.format);
    setStatus("saving");
    setError(null);

    const saved = await updateContentItem(item.id, {
      title,
      body: draft.body,
      shloka: draft.shloka,
      transliteration: draft.transliteration,
      meaning: draft.meaning,
      keyLearning: draft.keyLearning,
      reference: draft.reference,
      platforms: draft.platforms,
    });

    if (!saved) {
      setStatus("error");
      setError("Couldn't save this piece. Check your connection and try again.");
      return;
    }

    setDraft(draftFromItem(saved));
    setStatus("saved");
  }

  saveRef.current = handleSave;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirtyRef.current && !savingRef.current) void saveRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function setChapter(chapter: number) {
    if (chapter === 0) {
      setDraft((current) => ({ ...current, reference: { ...UNSET_REFERENCE } }));
      return;
    }
    setDraft((current) => ({
      ...current,
      reference: {
        chapter,
        verseLabel: current.reference.chapter === chapter ? current.reference.verseLabel : "",
        chapterTitle: chapterTitleFor(chapter),
      },
    }));
  }

  function togglePlatform(platform: Platform) {
    setDraft((current) => ({
      ...current,
      platforms: current.platforms.includes(platform)
        ? current.platforms.filter((entry) => entry !== platform)
        : [...current.platforms, platform],
    }));
  }

  const meta = CONTENT_FORMAT_META[item.format];
  const isSession = item.format === "session";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/content"
          className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Content Studio
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <SaveStatus status={status} dirty={dirty} />
          <Link
            href={`/content/${item.id}`}
            className="rounded-control border border-border px-3 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!dirty || status === "saving"}
            className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-2 text-caption text-danger">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <FormatBadge format={item.format} />
            <StatusBadge status={item.status} />
            <span className="text-caption text-foreground-muted">{meta.description}</span>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Title</span>
            <input
              type="text"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Give this piece a name"
              className="rounded-control border border-border bg-background px-3 py-2 font-display text-h3 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div>
            <p className="mb-1.5 text-caption font-medium text-foreground-secondary">
              {isSession ? "Session plan" : "Manuscript"}
            </p>
            <DocumentEditor
              key={item.id}
              content={draft.body}
              placeholder={FORMAT_EDITOR_PLACEHOLDER[item.format]}
              onChange={(html) => setDraft((current) => ({ ...current, body: html }))}
            />
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-4 md:p-5">
            <div>
              <h2 className="font-display text-h3 text-foreground">Scripture</h2>
              <p className="mt-1 text-caption text-foreground-secondary">
                Ground this piece in a chapter and verse. Full lookup arrives with the Knowledge Layer.
              </p>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Chapter</span>
              <select
                value={draft.reference.chapter}
                onChange={(event) => setChapter(Number(event.target.value))}
                className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={0}>Not selected</option>
                {WORKSPACE_CHAPTERS.map((chapter) => (
                  <option key={chapter.chapter} value={chapter.chapter}>
                    {chapter.chapter}. {chapter.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Verse</span>
              <input
                type="text"
                value={draft.reference.verseLabel === "—" ? "" : draft.reference.verseLabel}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    reference: {
                      ...current.reference,
                      verseLabel: event.target.value || "—",
                    },
                  }))
                }
                placeholder="e.g. 47 or 13–14"
                className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Shloka</span>
              <textarea
                value={draft.shloka}
                onChange={(event) => setDraft((current) => ({ ...current, shloka: event.target.value }))}
                rows={3}
                placeholder="Sanskrit verse"
                className="resize-y rounded-control border border-border bg-background px-3 py-2 font-display text-body leading-relaxed text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Transliteration</span>
              <textarea
                value={draft.transliteration}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, transliteration: event.target.value }))
                }
                rows={2}
                className="resize-y rounded-control border border-border bg-background px-3 py-2 text-caption italic text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Simplified meaning</span>
              <textarea
                value={draft.meaning}
                onChange={(event) => setDraft((current) => ({ ...current, meaning: event.target.value }))}
                rows={3}
                className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-caption font-medium text-foreground-secondary">Key learning</span>
              <textarea
                value={draft.keyLearning}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, keyLearning: event.target.value }))
                }
                rows={2}
                className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </section>

          <section className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 md:p-5">
            <div>
              <h2 className="font-display text-h3 text-foreground">Platforms</h2>
              <p className="mt-1 text-caption text-foreground-secondary">
                {isSession
                  ? "A session is taught rather than posted. Set platforms only if a recording will be distributed."
                  : "Where this piece is intended to publish. Publishing itself is a later milestone."}
              </p>
            </div>
            <PlatformTargetPicker platforms={draft.platforms} onToggle={togglePlatform} />
          </section>
        </aside>
      </div>
    </div>
  );
}

function SaveStatus({
  status,
  dirty,
}: {
  status: "idle" | "saving" | "saved" | "error";
  dirty: boolean;
}) {
  if (status === "saving") {
    return <span className="text-caption text-foreground-muted">Saving…</span>;
  }
  if (status === "error") {
    return <span className="text-caption text-danger">Save failed</span>;
  }
  if (status === "saved" && !dirty) {
    return (
      <span className="inline-flex items-center gap-1 text-caption text-success">
        <Check className="h-3.5 w-3.5" />
        Saved
      </span>
    );
  }
  if (dirty) {
    return <span className="text-caption text-foreground-muted">Unsaved changes</span>;
  }
  return <span className="text-caption text-foreground-muted">All changes saved</span>;
}
