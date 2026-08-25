"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBriefStore } from "@/features/briefs/store/use-brief-store";
import { BriefEditor } from "@/features/briefs/components/BriefEditor";
import { BriefListView } from "@/features/briefs/components/BriefListView";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

type BriefWorkspaceProps = {
  briefId?: string;
  isNew?: boolean;
  projectId?: string;
};

export function BriefWorkspace({ briefId, isNew, projectId }: BriefWorkspaceProps) {
  const briefs = useBriefStore((state) => state.briefs);
  const isHydrated = useBriefStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <WorkspaceLoading label="Loading content brief…" />;
  }

  if (isNew) {
    return <BriefEditor initialProjectId={projectId} />;
  }

  if (briefId) {
    const brief = briefs.find((entry) => entry.id === briefId);
    if (!brief) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <p className="text-body text-foreground-secondary">
            This brief could not be opened. It may belong to another account or have been removed.
          </p>
          <Link
            href="/studio/brief"
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to briefs
          </Link>
        </div>
      );
    }
    return <BriefEditor brief={brief} />;
  }

  return <BriefListView />;
}
