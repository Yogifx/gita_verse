"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CONTENT_FORMAT_META, CONTENT_FORMATS } from "@/constants/content";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getActiveItems } from "@/features/content/lib/selectors";
import type { ContentFormat } from "@/types/content";
import { cn } from "@/lib/utils/cn";

type FormatStartViewProps = {
  format?: ContentFormat;
};

export function FormatStartView({ format }: FormatStartViewProps) {
  const router = useRouter();
  const items = useContentStore((s) => s.items);
  const createContentItem = useContentStore((s) => s.createContentItem);
  const [selected, setSelected] = useState<ContentFormat | undefined>(format);
  const [pending, setPending] = useState(false);

  const active = getActiveItems(items);
  const listed = selected ? active.filter((item) => item.format === selected) : active;

  async function handleCreate(nextFormat: ContentFormat) {
    setPending(true);
    try {
      const id = await createContentItem(nextFormat);
      router.push(`/studio?format=${nextFormat}&item=${id}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/content"
        className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Content Studio
      </Link>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">New content</h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Choose a format to open the authoring editor. Post, carousel, reel, and session share the
          same Tiptap foundation — format-specific structure can extend this later.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {CONTENT_FORMATS.map((option) => {
            const meta = CONTENT_FORMAT_META[option];
            const Icon = meta.icon;
            const isActive = option === selected;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-control border p-4 text-left transition-colors duration-fast",
                  isActive
                    ? "border-primary bg-primary-muted"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-gold" : "text-foreground-muted")} />
                <span className={cn("font-medium", isActive ? "text-gold" : "text-foreground")}>
                  {meta.label}
                </span>
                <span className="text-caption text-foreground-secondary">{meta.description}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={!selected || pending}
            onClick={() => selected && void handleCreate(selected)}
            className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {pending ? "Creating…" : selected ? `Create ${CONTENT_FORMAT_META[selected].label}` : "Create"}
          </button>
        </div>
      </section>

      <section className="rounded-panel border border-border bg-surface p-4 md:p-6">
        <h2 className="font-display text-h3 text-foreground">
          {selected ? `${CONTENT_FORMAT_META[selected].label} pieces` : "Recent pieces"}
        </h2>
        <p className="mt-1 text-caption text-foreground-secondary">
          Open an existing piece in the editor, or create a new one above.
        </p>

        {listed.length === 0 ? (
          <p className="py-8 text-center text-caption text-foreground-muted">
            Nothing here yet. Create a piece to start writing.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {listed.slice(0, 12).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-caption text-foreground-muted">
                    Chapter {item.reference.chapter} · Verse {item.reference.verseLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FormatBadge format={item.format} />
                  <StatusBadge status={item.status} />
                  <Link
                    href={`/studio?format=${item.format}&item=${item.id}`}
                    className="rounded-control border border-border px-3 py-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
