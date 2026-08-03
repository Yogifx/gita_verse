import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Content Studio",
};

export default function StudioPage() {
  return <PlaceholderPage label="Content Studio" />;
}
