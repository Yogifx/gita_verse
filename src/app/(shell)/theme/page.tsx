import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Theme Manager",
};

export default function ThemeManagerPage() {
  return <PlaceholderPage label="Theme Manager" />;
}
