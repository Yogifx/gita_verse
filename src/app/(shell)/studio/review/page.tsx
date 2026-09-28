import type { Metadata } from "next";
import { ReelReviewPage } from "@/features/studio/components/ReelReviewPage";

export const metadata: Metadata = {
  title: "Review Studio",
};

type ReviewPageProps = {
  searchParams: Promise<{ item?: string }>;
};

export default async function ReviewStudioPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  return <ReelReviewPage itemId={params.item} />;
}
