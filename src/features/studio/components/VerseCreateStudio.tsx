"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clapperboard, GalleryHorizontal, Image as ImageIcon, LoaderCircle, Sparkles } from "lucide-react";
import { fetchVerseCitation } from "@/features/knowledge/lib/client";
import { formatReference, formatVerseId, parseVerseAddress } from "@/features/knowledge/lib/reference";
import { useBriefStore } from "@/features/briefs/store/use-brief-store";
import { useContentStore } from "@/features/content/store/use-content-store";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { CreationJourney } from "@/features/studio/components/CreationJourney";
import { VerseSourcePanel } from "@/features/studio/components/VerseSourcePanel";
import { studioHref } from "@/features/studio/lib/studio-routes";
import {
  FEATURED_VERSE_ADDRESS,
  briefDraftFromVerseSource,
  resolveStudioProjectId,
  reusableBriefForVerse,
  sourceItemForVerse,
} from "@/features/studio/lib/verse-create";
import { DEFAULT_PUBLISH_PLATFORMS } from "@/features/studio/lib/creation-status";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";
import type { BriefFormat } from "@/types/brief";
import type { VerseCitation } from "@/types/knowledge";

const FORMAT_OPTIONS: {
  value: Extract<BriefFormat, "reel" | "carousel" | "post">;
  label: string;
  description: string;
  icon: typeof Clapperboard;
  primary?: boolean;
}[] = [
  {
    value: "reel",
    label: "Reel",
    description: "Hook, scenes, voiceover, visual direction, and CTA for short vertical video.",
    icon: Clapperboard,
    primary: true,
  },
  {
    value: "carousel",
    label: "Carousel",
    description: "Opening, teaching slides, visual direction, and a closing CTA.",
    icon: GalleryHorizontal,
  },
  {
    value: "post",
    label: "Post",
    description: "Hook, caption, key message, visual direction, and CTA for a single frame.",
    icon: ImageIcon,
  },
];

type VerseCreateStudioProps = {
  verse?: string;
  format?: string;
};

export function VerseCreateStudio({ verse, format }: VerseCreateStudioProps) {
  const router = useRouter();
  const items = useContentStore((state) => state.items);
  const isContentHydrated = useContentStore((state) => state.isHydrated);
  const generateFromBrief = useContentStore((state) => state.generateFromBrief);
  const updateContentItem = useContentStore((state) => state.updateContentItem);
  const briefs = useBriefStore((state) => state.briefs);
  const createBrief = useBriefStore((state) => state.createBrief);
  const projects = useProjectsStore((state) => state.projects);
  const isProjectsHydrated = useProjectsStore((state) => state.isHydrated);

  const address = parseVerseAddress(verse?.trim() || FEATURED_VERSE_ADDRESS);
  const resolvedAddress = address
    ? formatReference(address.chapter, address.verse)
    : FEATURED_VERSE_ADDRESS;
  const parsed = parseVerseAddress(resolvedAddress) ?? { chapter: 2, verse: 47 };

  const initialFormat =
    format === "carousel" || format === "post" || format === "reel" ? format : "reel";

  const [citation, setCitation] = useState<VerseCitation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<
    Extract<BriefFormat, "reel" | "carousel" | "post">
  >(initialFormat);
  const [pending, setPending] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCitation(null);
    setLoadError(null);
    void fetchVerseCitation(resolvedAddress)
      .then((result) => {
        if (!cancelled) setCitation(result);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(
          error instanceof ApiError
            ? error.message
            : "Couldn't load this verse from the Knowledge Layer.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedAddress]);

  const sourceItem = useMemo(
    () => sourceItemForVerse(items, parsed.chapter, parsed.verse),
    [items, parsed.chapter, parsed.verse],
  );
  const meaning = sourceItem?.meaning ?? "";
  const keyTeaching = sourceItem?.keyLearning ?? meaning;

  async function handleGenerate() {
    if (!citation || pending) return;
    const projectId = resolveStudioProjectId(projects);
    if (!projectId) {
      setGenerateError("Create a Knowledge Project before generating content.");
      return;
    }
    if (!meaning.trim()) {
      setGenerateError("This verse needs a simplified meaning before a draft can be generated.");
      return;
    }

    setPending(true);
    setGenerateError(null);

    try {
      const verseId = citation.id || formatVerseId(parsed.chapter, parsed.verse);
      const existing = reusableBriefForVerse(briefs, verseId, selectedFormat);
      const brief =
        existing ??
        (await createBrief(
          briefDraftFromVerseSource({
            projectId,
            verseId,
            format: selectedFormat,
            meaning,
            keyTeaching,
          }),
        ));

      if (!brief) {
        setGenerateError("Couldn't save the content brief for this verse.");
        return;
      }

      const created = await generateFromBrief(brief.id);
      const reviewed = await updateContentItem(created.id, {
        status: "in_review",
        pipelineStage: "review",
        platforms: DEFAULT_PUBLISH_PLATFORMS,
      });
      router.push(studioHref(reviewed ?? created));
    } catch (cause) {
      setGenerateError(
        cause instanceof ApiError
          ? cause.message
          : "Couldn't generate this draft. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  const ready = Boolean(citation && isContentHydrated && isProjectsHydrated && meaning.trim());

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <p className="text-caption font-medium text-gold">Create once · Adapt everywhere</p>
        <h1 className="mt-1 font-display text-h2 text-foreground">Create content from a verified verse</h1>
        <p className="mt-2 max-w-2xl text-caption text-foreground-secondary">
          Start with Chapter {parsed.chapter} · Verse {parsed.verse}. Choose Reel, Carousel, or Post,
          generate a structured draft, then review and approve it.
        </p>
        <div className="mt-5">
          <CreationJourney current={pending ? "generate" : "create"} />
        </div>
      </section>

      {loadError ? (
        <p className="rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-3 text-caption text-danger">
          {loadError}
        </p>
      ) : null}

      {!citation && !loadError ? (
        <div className="rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center text-caption text-foreground-muted">
          Loading verified verse…
        </div>
      ) : null}

      {citation ? <VerseSourcePanel citation={citation} meaning={meaning} /> : null}

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">Choose a format</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Reel is the default. Carousel and Post generate into the same Review Studio.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {FORMAT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = option.value === selectedFormat;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedFormat(option.value)}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-control border p-4 text-left transition-colors duration-fast",
                  isActive
                    ? "border-primary bg-primary-muted"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <Icon className={cn("h-5 w-5", isActive ? "text-gold" : "text-foreground-muted")} />
                  {option.primary ? (
                    <span className="rounded-full bg-primary-muted px-2 py-0.5 text-small font-medium text-gold">
                      Primary
                    </span>
                  ) : null}
                </div>
                <span className={cn("font-medium", isActive ? "text-gold" : "text-foreground")}>
                  {option.label}
                </span>
                <span className="text-caption text-foreground-secondary">{option.description}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption text-foreground-muted">
            {pending
              ? "Generating a structured draft from this verse…"
              : "Uses the existing generation engine. A live provider is not required."}
          </p>
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={!ready || pending}
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {pending ? "Generating…" : `Generate ${FORMAT_OPTIONS.find((entry) => entry.value === selectedFormat)?.label} draft`}
          </button>
        </div>

        {generateError ? (
          <p className="mt-4 rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-2 text-caption text-danger">
            {generateError}
          </p>
        ) : null}
      </section>
    </div>
  );
}
