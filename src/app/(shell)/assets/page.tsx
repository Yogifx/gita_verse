import type { Metadata } from "next";
import { AssetLibrary } from "@/features/media/components/AssetLibrary";

export const metadata: Metadata = {
  title: "Asset Library",
};

export default function AssetsPage() {
  return <AssetLibrary />;
}
