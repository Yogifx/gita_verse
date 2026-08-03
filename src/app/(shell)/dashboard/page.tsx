import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <PlaceholderPage label="Dashboard" />;
}
