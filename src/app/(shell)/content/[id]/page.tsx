import type { Metadata } from "next";
import { ProjectDetailsView } from "@/features/content-studio/components/ProjectDetailsView";

export const metadata: Metadata = {
  title: "Content Project",
};

type ContentDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContentDetailsPage({ params }: ContentDetailsPageProps) {
  const { id } = await params;
  return <ProjectDetailsView id={id} />;
}
