"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LoaderCircle, Save } from "lucide-react";
import { fetchVerseCitation } from "@/features/knowledge/lib/client";
import { formatReference } from "@/features/knowledge/lib/reference";
import { htmlFromContentOutput } from "@/features/content/lib/content-output";
import { useContentStore } from "@/features/content/store/use-content-store";
import { ContentStatusStepper } from "@/features/studio/components/ContentStatusStepper";
import { CreationJourney } from "@/features/studio/components/CreationJourney";
import { PublishPrepPanel } from "@/features/studio/components/PublishPrepPanel";
import { ReviewOutputEditor } from "@/features/studio/components/ReviewOutputEditor";
import { VerseSourcePanel } from "@/features/studio/components/VerseSourcePanel";
import {
  formatReviewLabel,
  mergePublishPlatforms,
  reviewStatusStep,
} from "@/features/studio/lib/creation-status";
import {
  outputDraftFromItem,
  sameOutput,
  validateOutputDraft,
} from "@/features/studio/lib/review-output";
import type { ContentItem } from "@/types/content";
import type { ContentOutput } from "@/types/content-output";
import type { VerseCitation } from "@/types/knowledge";

type ReviewStudioProps = {
  item: ContentItem;
};

export function ReviewStudio({ item }: ReviewStudioProps) {
  const updateContentItem = useContentStore((state) => state.updateContentItem);
  const [draft, setDraft] = useState<ContentOutput | null>(() => outputDraftFromItem(item));
  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [citation, setCitation] = useState<VerseCitation | null>(null);

  useEffect(() => {
    setDraft(outputDraftFromItem(item));
    setTitle(item.title);
    setStatus("idle");
    setError(null);
    // Reset only when opening a different piece, not after save/approve refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  useEffect(() => {
    const address = formatReference(item.reference.chapter, Number(item.reference.verseLabel));
    if (!address || Number.isNaN(Number(item.reference.verseLabel))) return;
    let cancelled = false;
    void fetchVerseCitation(address)
      .then((result) => {
        if (!cancelled) setCitation(result);
      })
      .catch(() => {
        if (!cancelled) setCitation(null);
      });
    return () => {
      cancelled = true;
    };
  }, [item.reference.chapter, item.reference.verseLabel]);

  const original = useMemo(() => outputDraftFromItem(item), [item]);
  const dirty =
    Boolean(draft && original) &&
    (title.trim() !== item.title || !sameOutput(draft as ContentOutput, original as ContentOutput));
  const approved = reviewStatusStep(item.status) === "approved";
  const journey = approved ? "publish" : "review";
  const formatLabel = formatReviewLabel(item.format);

  async function handleSave() {
    if (!draft) return;
    const invalid = validateOutputDraft(draft);
    if (invalid) {
      setStatus("error");
      setError(invalid);
      return;
    }

    setStatus("saving");
    setError(null);

    const saved = await updateContentItem(item.id, {
      title: title.trim() || item.title,
      output: draft,
      keyLearning:
        draft.format === "post" && draft.keyMessage !== undefined
          ? draft.keyMessage
          : item.keyLearning,
      body: htmlFromContentOutput(draft, {
        citationLabel:
          citation?.label ?? `Bhagavad Gita ${item.reference.chapter}.${item.reference.verseLabel}`,
      }),
    });

    if (!saved) {
      setStatus("error");
      setError(`Couldn't save this ${formatLabel}. Check your connection and try again.`);
      return;
    }

    setDraft(outputDraftFromItem(saved));
    setTitle(saved.title);
    setStatus("saved");
  }

  async function handleApprove() {
    if (dirty) {
      setStatus("error");
      setError(`Save your edits before approving this ${formatLabel}.`);
      return;
    }

    setStatus("saving");
    setError(null);

    const saved = await updateContentItem(item.id, {
      status: "approved",
      pipelineStage: "approved",
      platforms: mergePublishPlatforms(item.platforms),
    });

    if (!saved) {
      setStatus("error");
      setError(`Couldn't approve this ${formatLabel}. Try again in a moment.`);
      return;
    }

    setStatus("saved");
  }

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="text-body text-foreground-secondary">
          This piece does not have a structured draft to review.
        </p>
        <Link
          href="/studio/create?verse=2.47"
          className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          Create from Chapter 2 Verse 47
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <SaveHint status={status} dirty={dirty} />
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!dirty || status === "saving"}
            className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" && dirty ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={() => void handleApprove()}
            disabled={approved || dirty || status === "saving"}
            className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            {approved ? "Approved" : `Approve ${formatLabel}`}
          </button>
        </div>
      </div>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <p className="text-caption font-medium text-gold">Review Studio</p>
        <h1 className="mt-1 font-display text-h2 text-foreground">Review the generated {formatLabel}</h1>
        <p className="mt-2 max-w-2xl text-caption text-foreground-secondary">
          Edit the structured draft, save your changes, then approve it for publishing preparation.
        </p>
        <div className="mt-5">
          <CreationJourney current={journey} />
        </div>
        <div className="mt-5">
          <ContentStatusStepper status={item.status} />
        </div>
      </section>

      {error ? (
        <p className="rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-2 text-caption text-danger">
          {error}
        </p>
      ) : null}

      {approved ? (
        <p className="rounded-control border border-success-muted bg-success-muted/40 px-4 py-3 text-caption text-success">
          This {formatLabel} is approved. Publishing destinations are prepared below.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-4 rounded-panel border border-border bg-surface p-4 md:p-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-control border border-border bg-background px-3 py-2 font-display text-h3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <ReviewOutputEditor output={draft} onChange={setDraft} />
        </section>

        <aside className="flex flex-col gap-4">
          {citation ? (
            <VerseSourcePanel citation={citation} meaning={item.meaning} />
          ) : (
            <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
              <p className="text-caption font-medium text-gold">
                Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
              </p>
              {item.meaning ? (
                <p className="mt-3 text-body text-foreground">{item.meaning}</p>
              ) : (
                <p className="mt-3 text-caption text-foreground-muted">Loading verified verse…</p>
              )}
            </section>
          )}
        </aside>
      </div>

      {approved && item.output ? <PublishPrepPanel item={item} output={item.output} /> : null}
    </div>
  );
}

function SaveHint({
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
