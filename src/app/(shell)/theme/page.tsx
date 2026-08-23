import type { Metadata } from "next";
import { ThemeManagerView } from "@/features/theme/components/ThemeManagerView";

export const metadata: Metadata = {
  title: "Theme Manager",
};

export default function ThemeManagerPage() {
  return <ThemeManagerView />;
}
