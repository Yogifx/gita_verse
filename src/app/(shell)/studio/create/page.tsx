import type { Metadata } from "next";
import { VerseCreateStudio } from "@/features/studio/components/VerseCreateStudio";

export const metadata: Metadata = {
  title: "Create Content",
};

type CreatePageProps = {
  searchParams: Promise<{ verse?: string; format?: string }>;
};

export default async function CreateStudioPage({ searchParams }: CreatePageProps) {
  const params = await searchParams;
  return <VerseCreateStudio verse={params.verse} format={params.format} />;
}
