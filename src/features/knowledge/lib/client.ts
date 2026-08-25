/**
 * Client accessors for the GV-014 Knowledge Layer HTTP API.
 * Scripture remains server-owned; this module only fetches citations.
 */

import { apiGet } from "@/lib/api/client";
import type { CorpusProvenance, GitaChapter, VerseCitation } from "@/types/knowledge";

export type ChapterIndexResponse = {
  chapters: GitaChapter[];
  provenance: CorpusProvenance;
};

export function fetchKnowledgeChapters(): Promise<ChapterIndexResponse> {
  return apiGet<ChapterIndexResponse>("/api/knowledge/chapters");
}

export function fetchVerseCitation(address: string): Promise<VerseCitation> {
  return apiGet<VerseCitation>(`/api/knowledge/verses/${encodeURIComponent(address)}`);
}
