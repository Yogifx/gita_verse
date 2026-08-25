"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, Sparkles } from "lucide-react";
import { contentFormatFromBrief, unsupportedBriefFormatMessage } from "@/features/content/lib/brief-generation";
import { useContentStore } from "@/features/content/store/use-content-store";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ContentBrief } from "@/types/brief";
import { ApiError } from "@/lib/api/client";

type BriefGeneratePanelProps = {
  brief: ContentBrief;
  dirty: boolean;
};

export function BriefGeneratePanel({ brief, dirty }: BriefGeneratePanelProps) {
  const router = useRouter();
  const items = useContentStore((state) => state.items);
  const generateFromBrief = useContentStore((state) => state.generateFromBrief);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const format = contentFormatFromBrief(brief.format);
  const generated = items.filter((item) => item.briefId === brief.id && !item.archived);

  async function handleGenerate() {
    if (!format || dirty) return;
    setPending(true);
    setError(null);
    try {
      const created = await generateFromBrief(brief.id);
      router.push(`/studio?format=${created.format}&item=${created.id}`);
    } catch (cause) {
      const message =
        cause instanceof ApiError
          ? cause.message
          : "Couldn't generate content from this brief. Check the format, verse, and that the brief is saved.";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
      <h2 className="font-display text-h3 text-foreground">7. Generate content</h2>
      <p className="mt-1 text-caption text-foreground-secondary">
        Creates one ContentItem from this brief. Quote, Story, and Short Video cannot become a
        ContentItem yet.
      </p>

      {format ? (
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={dirty || pending}
          className="mt-4 inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {pending ? "Generating…" : "Generate content"}
        </button>
      ) : (
        <p className="mt-4 rounded-control border border-warning-muted bg-warning-muted/40 px-4 py-2 text-caption text-warning">
          {unsupportedBriefFormatMessage(brief.format)}
        </p>
      )}

      {dirty && format ? (
        <p className="mt-2 text-caption text-foreground-muted">Save the brief before generating.</p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-control border border-danger-muted bg-danger-muted/40 px-4 py-2 text-caption text-danger">
          {error}
        </p>
      ) : null}

      {generated.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {generated.map((item) => (
            <li key={item.id}>
              <Link
                href={`/studio?format=${item.format}&item=${item.id}`}
                className="flex flex-wrap items-center gap-2 rounded-control border border-border bg-background px-3 py-2 transition-colors duration-fast hover:border-primary"
              >
                <span className="min-w-0 flex-1 truncate text-caption font-medium text-foreground">
                  {item.title}
                </span>
                <FormatBadge format={item.format} />
                <StatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
