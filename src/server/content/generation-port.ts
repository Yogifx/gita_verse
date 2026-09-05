/**
 * GV-015.4 server-side generation port.
 *
 * Application boundary for structured content generation. Not an AI
 * provider, not a prompt store, and not a job runner. The first
 * implementation delegates to the existing deterministic mapper.
 */

import type { GenerationInput } from "@/features/content/lib/brief-generation";
import { outputFromBrief } from "@/features/content/lib/content-output";
import type { ContentOutput } from "@/types/content";

export type GenerationPort = {
  generate(input: GenerationInput): Promise<ContentOutput>;
};

export function createDeterministicGenerationPort(): GenerationPort {
  return {
    async generate(input) {
      return outputFromBrief(input.brief, input.format);
    },
  };
}

const deterministicPort = createDeterministicGenerationPort();

/** Single application-level entry point for structured generation. */
export function getGenerationPort(): GenerationPort {
  return deterministicPort;
}
