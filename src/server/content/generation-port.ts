/**
 * GV-015.4–015.6 server-side generation port.
 *
 * Application boundary for structured content generation. Accepts a
 * provider-neutral GenerationRequest. Not a prompt store or job runner.
 * Adapter selection is server-side only (GENERATION_ADAPTER). Default is
 * the existing deterministic mapper.
 */

import type { GenerationRequest } from "@/features/content/lib/brief-generation";
import { outputFromBrief } from "@/features/content/lib/content-output";
import { readGenerationAdapter } from "@/lib/ai/generation-env";
import { createOpenAiGenerationPort } from "@/lib/ai/openai-generation";
import type { ContentOutput } from "@/types/content";

export type GenerationPort = {
  generate(request: GenerationRequest): Promise<ContentOutput>;
};

export function createDeterministicGenerationPort(): GenerationPort {
  return {
    async generate(request) {
      return outputFromBrief(
        {
          hook: request.hook,
          keyMessage: request.keyMessage,
          keyTeaching: request.keyTeaching,
          meaning: request.meaning,
          contentGoal: request.contentGoal,
        },
        request.format,
      );
    },
  };
}

const deterministicPort = createDeterministicGenerationPort();

/** Single application-level entry point for structured generation. */
export function getGenerationPort(): GenerationPort {
  if (readGenerationAdapter() === "openai") {
    return createOpenAiGenerationPort();
  }
  return deterministicPort;
}
