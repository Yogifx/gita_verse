import type { Metadata } from "next";
import { StudioView } from "@/features/workspace/components/StudioView";

export const metadata: Metadata = {
  title: "Creative Workspace",
};

type StudioPageProps = {
  searchParams: Promise<{ format?: string; item?: string; project?: string }>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const params = await searchParams;
  return <StudioView format={params.format} itemId={params.item ?? params.project} />;
}
