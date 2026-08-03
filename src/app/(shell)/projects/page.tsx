import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Knowledge Projects",
};

export default function ProjectsPage() {
  return <PlaceholderPage label="Knowledge Projects" />;
}
