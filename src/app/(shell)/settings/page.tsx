import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <PlaceholderPage label="Settings" />;
}
