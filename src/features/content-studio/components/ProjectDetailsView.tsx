"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Archive, Copy, Eye, Pencil } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { getDailyBucket, getReviewStatusLabel } from "@/features/content/lib/selectors";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormatBadge } from "@/components/shared/FormatBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { DailyBucketBadge } from "@/features/content-studio/components/DailyBucketBadge";
import { WorkflowTracker } from "@/features/content-studio/components/WorkflowTracker";
import { PlatformTargetPicker } from "@/features/content-studio/components/PlatformTargetPicker";
import { formatDate, formatRelativeTime } from "@/lib/utils/time";

type ProjectDetailsViewProps = {
  id: string;
};

export function ProjectDetailsView({ id }: ProjectDetailsViewProps) {
  const router = useRouter();
  const items = useContentStore((s) => s.items);
  const duplicateContentItem = useContentStore((s) => s.duplicateContentItem);
  const archiveContentItem = useContentStore((s) => s.archiveContentItem);
  const toggleItemPlatform = useContentStore((s) => s.toggleItemPlatform);

  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <p className="text-body text-foreground-secondary">
          This content project could not be found. It may have been removed.
        </p>
        <Link
          href="/content"
          className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content Studio
        </Link>
      </div>
    );
  }

  function handleDuplicate() {
    const newId = duplicateContentItem(id);
    if (newId) router.push(`/content/${newId}`);
  }

  function handleArchive() {
    archiveContentItem(id);
    router.push("/content");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/content"
        className="inline-flex w-fit items-center gap-1.5 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Content Studio
      </Link>

      {item.archived ? (
        <div className="rounded-control border border-warning-muted bg-warning-muted/40 px-4 py-3 text-caption text-warning">
          This project is archived. It no longer appears in the active Content Library.
        </div>
      ) : null}

      <SectionCard
        title={item.title}
        description={item.reference.chapterTitle}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <FormatBadge format={item.format} />
            <StatusBadge status={item.status} />
            <DailyBucketBadge bucket={getDailyBucket(item)} />
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Meta label="Chapter" value={String(item.reference.chapter)} />
            <Meta label="Verse" value={item.reference.verseLabel} />
            <Meta label="Created" value={formatDate(item.createdAt)} />
            <Meta label="Last modified" value={formatRelativeTime(item.updatedAt)} />
          </div>

          <div>
            <p className="mb-1 text-caption font-medium text-foreground-secondary">
              Review status
            </p>
            <p className="text-body text-foreground">{getReviewStatusLabel(item)}</p>
          </div>

          {item.shloka ? (
            <div>
              <p className="mb-2 text-caption font-medium text-foreground-secondary">
                Sanskrit shloka
              </p>
              <blockquote className="rounded-control border border-border bg-background px-4 py-3 font-display text-body-lg leading-relaxed text-foreground">
                {item.shloka}
              </blockquote>
              {item.transliteration ? (
                <p className="mt-2 text-caption italic text-foreground-secondary">
                  {item.transliteration}
                </p>
              ) : null}
            </div>
          ) : null}

          {item.meaning ? (
            <div>
              <p className="mb-1 text-caption font-medium text-foreground-secondary">
                Simplified meaning
              </p>
              <p className="text-body text-foreground">{item.meaning}</p>
            </div>
          ) : null}

          {item.keyLearning ? (
            <div className="rounded-control border border-primary-muted bg-primary-muted/40 px-4 py-3">
              <p className="text-caption font-medium text-gold">Key learning</p>
              <p className="mt-1 text-body text-foreground">{item.keyLearning}</p>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-caption font-medium text-foreground-secondary">
              Target platforms
            </p>
            <PlatformTargetPicker
              platforms={item.platforms}
              onToggle={(platform) => toggleItemPlatform(item.id, platform)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <Link
              href={`/studio?format=${item.format}&item=${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>
            <Link
              href={`/studio?format=${item.format}&item=${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" />
              Review
            </Link>
            <button
              type="button"
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
            {!item.archived ? (
              <button
                type="button"
                onClick={handleArchive}
                className="inline-flex items-center gap-1.5 rounded-control border border-border px-4 py-2 text-caption font-medium text-foreground-secondary transition-colors duration-fast hover:bg-danger-muted hover:text-danger"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </button>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Content Workflow" description="Idea → Research → Script → Design → Review → Approved → Scheduled → Published">
        <WorkflowTracker stage={item.pipelineStage} />
      </SectionCard>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small text-foreground-muted">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{value}</p>
    </div>
  );
}
