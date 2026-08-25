import type { Metadata } from "next";
import { BriefWorkspace } from "@/features/briefs/components/BriefWorkspace";

export const metadata: Metadata = {
  title: "Content Brief",
};

type BriefPageProps = {
  searchParams: Promise<{ id?: string; new?: string; project?: string }>;
};

export default async function BriefPage({ searchParams }: BriefPageProps) {
  const params = await searchParams;
  return (
    <BriefWorkspace briefId={params.id} isNew={params.new === "1"} projectId={params.project} />
  );
}
