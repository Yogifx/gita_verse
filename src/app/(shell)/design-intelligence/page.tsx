import type { Metadata } from "next";
import { DesignIntelligenceView } from "@/features/design-intelligence/components/DesignIntelligenceView";

export const metadata: Metadata = {
  title: "Design Intelligence",
};

export default function DesignIntelligencePage() {
  return <DesignIntelligenceView />;
}
