"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LoaderCircle, Save } from "lucide-react";
import { BRIEF_AUDIENCES, BRIEF_FORMATS, BRIEF_TONES } from "@/constants/briefs";
import { VerseSourcePicker } from "@/features/briefs/components/VerseSourcePicker";
import { BriefGeneratePanel } from "@/features/briefs/components/BriefGeneratePanel";
import { useBriefStore, type BriefDraftInput } from "@/features/briefs/store/use-brief-store";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { getActiveProjects } from "@/features/projects/lib/selectors";
import type { ContentBrief } from "@/types/brief";
import { cn } from "@/lib/utils/cn";

const EMPTY_DRAFT: BriefDraftInput = {
  projectId: "",
  verseId: "",
  meaning: "",
  keyTeaching: "",
  audience: "general_audience",
  contentGoal: "",
  format: "reel",
  hook: "",
  keyMessage: "",
  tone: "simple",
};

function draftFromBrief(brief: ContentBrief): BriefDraftInput {
  return {
    projectId: brief.projectId,
    verseId: brief.verseId,
    meaning: brief.meaning,
    keyTeaching: brief.keyTeaching,
    audience: brief.audience,
    contentGoal: brief.contentGoal,
    format: brief.format,
    hook: brief.hook,
    keyMessage: brief.keyMessage,
    tone: brief.tone,
  };
}

type BriefEditorProps = {
  brief?: ContentBrief;
  initialProjectId?: string;
};

export function BriefEditor({ brief, initialProjectId }: BriefEditorProps) {
  const router = useRouter();
  const createBrief = useBriefStore((state) => state.createBrief);
  const updateBrief = useBriefStore((state) => state.updateBrief);
  const projects = useProjectsStore((state) => state.projects);
  const [draft, setDraft] = useState<BriefDraftInput>(() => {
    if (brief) return draftFromBrief(brief);
    return { ...EMPTY_DRAFT, projectId: initialProjectId ?? "" };
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brief) {
      setDraft(draftFromBrief(brief));
    } else {
      setDraft({ ...EMPTY_DRAFT, projectId: initialProjectId ?? "" });
    }
    setStatus("idle");
    setError(null);
  }, [brief, initialProjectId]);

  const dirty = useMemo(() => {
    const original = brief
      ? draftFromBrief(brief)
      : { ...EMPTY_DRAFT, projectId: initialProjectId ?? "" };
    return JSON.stringify(draft) !== JSON.stringify(original);
  }, [brief, draft, initialProjectId]);

  const selectableProjects = useMemo(() => {
    const active = getActiveProjects(projects);
    if (draft.projectId && !active.some((project) => project.id === draft.projectId)) {
      const current = projects.find((project) => project.id === draft.projectId);
      return current ? [current, ...active] : active;
    }
    return active;
  }, [projects, draft.projectId]);

  const canSave =
    Boolean(draft.projectId) &&
    Boolean(draft.verseId) &&
    Boolean(draft.contentGoal.trim()) &&
    Boolean(draft.keyMessage.trim());

  async function handleSave() {
    if (!canSave) {
      setError("Select a Knowledge Project and a verified verse, then add a content goal and key message.");
      return;
    }

    setStatus("saving");
    setError(null);
    const saved = brief
      ? await updateBrief(brief.id, draft)
      : await createBrief(draft);

    if (!saved) {
      setStatus("error");
      setError("Couldn't save this brief. Check the project, verse, and required fields.");
      return;
    }

    setDraft(draftFromBrief(saved));
    setStatus("saved");
    if (!brief) router.replace(`/studio/brief?id=${saved.id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/studio/brief"
          className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to briefs
        </Link>
        <div className="flex items-center gap-2">
          <SaveStatus status={status} dirty={dirty} />
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave || !dirty || status === "saving"}
            className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "saving" ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {status === "saving" ? "Saving…" : "Save brief"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-2 text-caption text-danger">
          {error}
        </p>
      ) : null}

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">1. Knowledge Project</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Every brief belongs to one Knowledge Project. The verse stays in the shared Knowledge
          Layer.
        </p>
        {selectableProjects.length === 0 ? (
          <p className="mt-4 text-caption text-foreground-secondary">
            Create a Knowledge Project first, then return here.{" "}
            <Link href="/projects" className="font-medium text-gold hover:underline">
              Open Knowledge Projects
            </Link>
          </p>
        ) : (
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Project</span>
            <select
              value={draft.projectId}
              onChange={(event) =>
                setDraft((current) => ({ ...current, projectId: event.target.value }))
              }
              className="rounded-control border border-border bg-background px-3 py-2 text-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a project</option>
              {selectableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">2. Verified source</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Ground this brief in one Knowledge Layer verse. The shloka is not copied into the brief.
        </p>
        <div className="mt-4">
          <VerseSourcePicker
            verseId={draft.verseId}
            onChange={(verseId) => setDraft((current) => ({ ...current, verseId }))}
          />
        </div>
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">3. Meaning</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Your teaching notes for this piece — not a second scripture corpus.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Simplified meaning</span>
            <textarea
              value={draft.meaning}
              onChange={(event) => setDraft((current) => ({ ...current, meaning: event.target.value }))}
              rows={3}
              placeholder="What this verse is saying, in plain language."
              className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Key teaching</span>
            <textarea
              value={draft.keyTeaching}
              onChange={(event) =>
                setDraft((current) => ({ ...current, keyTeaching: event.target.value }))
              }
              rows={2}
              placeholder="The core teaching this brief will carry forward."
              className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">4. Audience and goal</h2>
        <div className="mt-4 flex flex-col gap-4">
          <fieldset>
            <legend className="mb-2 text-caption font-medium text-foreground-secondary">Audience</legend>
            <div className="flex flex-wrap gap-2">
              {BRIEF_AUDIENCES.map((option) => (
                <ChoiceChip
                  key={option.value}
                  active={draft.audience === option.value}
                  label={option.label}
                  onClick={() => setDraft((current) => ({ ...current, audience: option.value }))}
                />
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Content goal</span>
            <textarea
              value={draft.contentGoal}
              onChange={(event) =>
                setDraft((current) => ({ ...current, contentGoal: event.target.value }))
              }
              rows={2}
              placeholder="What the audience should understand or feel."
              className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">5. Format</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          The output this brief is preparing. Generation currently creates a ContentItem for Reel,
          Carousel, and Post only.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {BRIEF_FORMATS.map((option) => {
            const active = draft.format === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setDraft((current) => ({ ...current, format: option.value }))}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-control border p-3 text-left transition-colors duration-fast",
                  active ? "border-primary bg-primary-muted" : "border-border bg-background hover:bg-muted",
                )}
              >
                <span className={cn("font-medium", active ? "text-gold" : "text-foreground")}>
                  {option.label}
                </span>
                <span className="text-caption text-foreground-secondary">{option.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">6. Hook, message, and tone</h2>
        <div className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Hook</span>
            <textarea
              value={draft.hook}
              onChange={(event) => setDraft((current) => ({ ...current, hook: event.target.value }))}
              rows={2}
              placeholder="The opening idea that captures attention."
              className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-caption font-medium text-foreground-secondary">Key message</span>
            <textarea
              value={draft.keyMessage}
              onChange={(event) =>
                setDraft((current) => ({ ...current, keyMessage: event.target.value }))
              }
              rows={2}
              placeholder="The single most important takeaway."
              className="resize-y rounded-control border border-border bg-background px-3 py-2 text-body text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <fieldset>
            <legend className="mb-2 text-caption font-medium text-foreground-secondary">Tone</legend>
            <div className="flex flex-wrap gap-2">
              {BRIEF_TONES.map((option) => (
                <ChoiceChip
                  key={option.value}
                  active={draft.tone === option.value}
                  label={option.label}
                  onClick={() => setDraft((current) => ({ ...current, tone: option.value }))}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {brief ? <BriefGeneratePanel brief={brief} dirty={dirty} /> : null}
    </div>
  );
}

function ChoiceChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-control border px-3 py-1.5 text-caption transition-colors duration-fast",
        active
          ? "border-primary bg-primary-muted text-gold"
          : "border-border bg-background text-foreground-secondary hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function SaveStatus({
  status,
  dirty,
}: {
  status: "idle" | "saving" | "saved" | "error";
  dirty: boolean;
}) {
  if (status === "saving") return <span className="text-caption text-foreground-muted">Saving…</span>;
  if (status === "error") return <span className="text-caption text-danger">Save failed</span>;
  if (status === "saved" && !dirty) {
    return (
      <span className="inline-flex items-center gap-1 text-caption text-success">
        <Check className="h-3.5 w-3.5" />
        Saved
      </span>
    );
  }
  if (dirty) return <span className="text-caption text-foreground-muted">Unsaved changes</span>;
  return <span className="text-caption text-foreground-muted">All changes saved</span>;
}
