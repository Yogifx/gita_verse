import type { Metadata } from "next";
import { ProjectsListView } from "@/features/projects/components/ProjectsListView";

export const metadata: Metadata = {
  title: "Knowledge Projects",
};

export default function ProjectsPage() {
  return <ProjectsListView />;
}
