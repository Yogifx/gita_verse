import type { Metadata } from "next";
import { ProjectDetails } from "@/features/projects/components/ProjectDetails";

export const metadata: Metadata = {
  title: "Project Details",
};

type ProjectDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = await params;
  return <ProjectDetails id={id} />;
}
