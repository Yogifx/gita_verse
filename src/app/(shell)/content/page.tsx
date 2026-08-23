import type { Metadata } from "next";
import { ContentLibraryView } from "@/features/content-studio/components/ContentLibraryView";

export const metadata: Metadata = {
  title: "Content Studio",
};

export default function ContentPage() {
  return <ContentLibraryView />;
}
