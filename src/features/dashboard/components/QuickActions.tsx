"use client";

import { useRouter } from "next/navigation";
import {
  Clapperboard,
  FolderPlus,
  GalleryHorizontal,
  Image as ImageIcon,
  Images,
  Sparkles,
} from "lucide-react";
import { useContentStore } from "@/features/content/store/use-content-store";
import { QuickActionButton } from "@/features/dashboard/components/QuickActionButton";
import { SectionCard } from "@/components/shared/SectionCard";

export function QuickActions() {
  const router = useRouter();
  const createContentItem = useContentStore((s) => s.createContentItem);

  function handleNewProject() {
    createContentItem("post");
    router.push("/projects");
  }

  function handleCreateContent() {
    const id = createContentItem("post");
    router.push(`/studio?item=${id}`);
  }

  return (
    <SectionCard title="Quick Actions" description="The fastest path into your work.">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionButton
          label="+ New Project"
          icon={FolderPlus}
          onClick={handleNewProject}
        />
        <QuickActionButton
          label="Create Content"
          icon={Sparkles}
          onClick={handleCreateContent}
        />
        <QuickActionButton
          label="Open Carousel Studio"
          icon={GalleryHorizontal}
          href="/studio?format=carousel"
        />
        <QuickActionButton
          label="Open Post Studio"
          icon={ImageIcon}
          href="/studio?format=post"
        />
        <QuickActionButton
          label="Open Reel Studio"
          icon={Clapperboard}
          href="/studio?format=reel"
        />
        <QuickActionButton label="Asset Library" icon={Images} href="/assets" />
      </div>
    </SectionCard>
  );
}
