"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { CreativeWorkspace } from "@/features/workspace/components/CreativeWorkspace";
import { ReviewStudio } from "@/features/studio/components/ReviewStudio";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

type ReelReviewPageProps = {
  itemId?: string;
};

export function ReelReviewPage({ itemId }: ReelReviewPageProps) {
  const items = useContentStore((state) => state.items);
  const isHydrated = useContentStore((state) => state.isHydrated);

  if (!isHydrated) {
    return <WorkspaceLoading label="Loading review studio…" />;
  }

  if (!itemId) {
    return (
      <MissingReview
        message="Choose a generated piece to review. Start from a verified verse to create a draft."
        href="/studio/create?verse=2.47"
        action="Create from Chapter 2 Verse 47"
      />
    );
  }

  const item = items.find((entry) => entry.id === itemId);
  if (!item) {
    return (
      <MissingReview
        message="This content could not be opened for review. It may belong to another account or have been removed."
        href="/content"
        action="Back to Content Studio"
      />
    );
  }

  if (
    item.output?.format === "reel" ||
    item.output?.format === "carousel" ||
    item.output?.format === "post"
  ) {
    return <ReviewStudio item={item} />;
  }

  return <CreativeWorkspace item={item} />;
}

function MissingReview({
  message,
  href,
  action,
}: {
  message: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
      <p className="text-body text-foreground-secondary">{message}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2 text-caption font-medium text-foreground-on-primary transition-colors duration-fast hover:bg-primary-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        {action}
      </Link>
    </div>
  );
}
