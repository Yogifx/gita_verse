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
import { QuickActionButton } from "@/features/dashboard/components/QuickActionButton";
import { SectionCard } from "@/components/shared/SectionCard";
import { verseCreateHref } from "@/features/studio/lib/studio-routes";

export function QuickActions() {
  const router = useRouter();

  function handleNewProject() {
    router.push("/projects");
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
          href={verseCreateHref("2.47")}
        />
        <QuickActionButton
          label="Open Carousel Studio"
          icon={GalleryHorizontal}
          href={verseCreateHref("2.47", "carousel")}
        />
        <QuickActionButton
          label="Open Post Studio"
          icon={ImageIcon}
          href={verseCreateHref("2.47", "post")}
        />
        <QuickActionButton
          label="Open Reel Studio"
          icon={Clapperboard}
          href={verseCreateHref("2.47", "reel")}
        />
        <QuickActionButton label="Asset Library" icon={Images} href="/assets" />
      </div>
    </SectionCard>
  );
}
