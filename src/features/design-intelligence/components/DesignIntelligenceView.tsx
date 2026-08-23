"use client";

import { useMemo, useState } from "react";
import { useContentStore } from "@/features/content/store/use-content-store";
import {
  filterGuidelines,
  getChapterCoverage,
  getFormatCoverage,
  getPlatformCoverage,
  getUncoveredChapterCount,
} from "@/features/design-intelligence/lib/selectors";
import { designGuidelines } from "@/features/design-intelligence/data/guidelines";
import { GUIDANCE_LIBRARY_FILTERS, type GuidanceFilterKey } from "@/constants/design-intelligence";
import { SectionCard } from "@/components/shared/SectionCard";
import { FormatCoverageGrid } from "@/features/design-intelligence/components/FormatCoverageGrid";
import { ChapterCoverageMap } from "@/features/design-intelligence/components/ChapterCoverageMap";
import { PlatformCoverageList } from "@/features/design-intelligence/components/PlatformCoverageList";
import { GuidanceFilterBar } from "@/features/design-intelligence/components/GuidanceFilterBar";
import { GuidelineCard } from "@/features/design-intelligence/components/GuidelineCard";
import { WorkspaceLoading } from "@/components/shared/WorkspaceLoading";

export function DesignIntelligenceView() {
  const items = useContentStore((s) => s.items);
  const isHydrated = useContentStore((s) => s.isHydrated);
  const [filter, setFilter] = useState<GuidanceFilterKey>("all");

  const formatCoverage = useMemo(() => getFormatCoverage(items), [items]);
  const chapterCoverage = useMemo(() => getChapterCoverage(items), [items]);
  const platformCoverage = useMemo(() => getPlatformCoverage(items), [items]);
  const uncoveredChapters = useMemo(
    () => getUncoveredChapterCount(chapterCoverage),
    [chapterCoverage],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const filterOption of GUIDANCE_LIBRARY_FILTERS) {
      result[filterOption.key] = filterGuidelines(designGuidelines, filterOption.key).length;
    }
    return result;
  }, []);

  const visibleGuidelines = useMemo(
    () => filterGuidelines(designGuidelines, filter),
    [filter],
  );

  if (!isHydrated) {
    return <WorkspaceLoading label="Loading design intelligence…" />;
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Content Coverage"
        description="Where your published and in-progress work stands, by format."
      >
        <FormatCoverageGrid coverage={formatCoverage} />
      </SectionCard>

      <SectionCard
        title="Chapter Coverage"
        description={`${uncoveredChapters} of 18 chapters have no content yet — muted chapters are your best next subject.`}
      >
        <ChapterCoverageMap coverage={chapterCoverage} />
      </SectionCard>

      <SectionCard
        title="Platform Reach"
        description="How your content is distributed across target platforms."
      >
        <PlatformCoverageList coverage={platformCoverage} />
      </SectionCard>

      <SectionCard
        title="Design Guidance Library"
        description="Visual and pedagogical principles for composing and teaching each format, drawn from the GitaVerse design system."
      >
        <div className="flex flex-col gap-4">
          <GuidanceFilterBar active={filter} onChange={setFilter} counts={counts} />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {visibleGuidelines.map((guideline) => (
              <GuidelineCard key={guideline.id} guideline={guideline} />
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
