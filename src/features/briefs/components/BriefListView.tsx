"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useBriefStore } from "@/features/briefs/store/use-brief-store";
import { useProjectsStore } from "@/features/projects/store/use-projects-store";
import { getProjectById } from "@/features/projects/lib/selectors";
import { labelForAudience, labelForBriefFormat } from "@/constants/briefs";
import { formatVerseLabel, parseVerseAddress } from "@/features/knowledge/lib/reference";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

export function BriefListView() {
  const briefs = useBriefStore((state) => state.briefs);
  const isHydrated = useBriefStore((state) => state.isHydrated);
  const projects = useProjectsStore((state) => state.projects);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-h3 text-foreground">Content Briefs</h2>
          <p className="mt-1 text-caption text-foreground-secondary">
            One brief at a time. Each brief belongs to a Knowledge Project and points at a
            verified verse.
          </p>
        </div>
        <Link
          href="/studio/brief?new=1"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New Brief
        </Link>
      </div>

      {!isHydrated ? (
        <WorkspaceLoading label="Loading briefs…" />
      ) : briefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <p className="text-body text-foreground-secondary">
            No briefs yet. Start from a verified shloka, then write the intent for one piece of
            content.
          </p>
          <Link
            href="/studio/brief?new=1"
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            New Brief
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {briefs.map((brief) => {
            const project = getProjectById(projects, brief.projectId);
            const address = parseVerseAddress(brief.verseId);
            const source = address
              ? formatVerseLabel(address.chapter, address.verse)
              : brief.verseId;
            return (
              <Link
                key={brief.id}
                href={`/studio/brief?id=${brief.id}`}
                className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 transition-colors duration-fast hover:border-primary"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-control bg-primary-muted px-2 py-0.5 text-caption text-gold">
                    {labelForBriefFormat(brief.format)}
                  </span>
                  <span className="text-caption text-foreground-muted">
                    {labelForAudience(brief.audience)}
                  </span>
                </div>
                <p className="text-caption font-medium text-foreground-secondary">
                  {project?.name ?? "Unknown project"} · {source}
                </p>
                <p className="line-clamp-3 text-body text-foreground">
                  {brief.keyMessage || brief.contentGoal || "Untitled brief"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
