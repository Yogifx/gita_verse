import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = {
  title: "Asset Library",
};

export default function AssetsPage() {
  return <PlaceholderPage label="Asset Library" />;
}
