/**
 * Server-only generation adapter selection. Credentials stay in process.env
 * and are never written to ContentItem, ContentBrief, or API payloads.
 */

export type GenerationAdapterName = "deterministic" | "openai";

export function readGenerationAdapter(): GenerationAdapterName {
  const raw = (process.env.GENERATION_ADAPTER ?? "deterministic").trim().toLowerCase();
  return raw === "openai" ? "openai" : "deterministic";
}

export function readOpenAiApiKey(): string | undefined {
  const key = process.env.OPENAI_API_KEY?.trim();
  return key || undefined;
}
