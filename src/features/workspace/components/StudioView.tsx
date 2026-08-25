"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CONTENT_FORMATS } from "@/constants/content";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";
import { CreativeWorkspace } from "@/features/workspace/components/CreativeWorkspace";
import { FormatStartView } from "@/features/workspace/components/FormatStartView";
import type { ContentFormat } from "@/types/content";

type StudioViewProps = {
  format?: string;
  itemId?: string;
};

function isContentFormat(value: string | undefined): value is ContentFormat {
  return !!value && (CONTENT_FORMATS as string[]).includes(value);
}

export function StudioView({ format, itemId }: StudioViewProps) {
  const items = useContentStore((s) => s.items);
  const isHydrated = useContentStore((s) => s.isHydrated);

  if (!isHydrated) {
    return <WorkspaceLoading label="Loading creative workspace…" />;
  }

  if (itemId) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <p className="text-body text-foreground-secondary">
            This content could not be opened in the editor. It may belong to another account or
            have been removed.
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
    return <CreativeWorkspace item={item} />;
  }

  return <FormatStartView format={isContentFormat(format) ? format : undefined} />;
}
