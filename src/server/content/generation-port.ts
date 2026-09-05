/**
 * GV-015.4 / GV-015.5 server-side generation port.
 *
 * Application boundary for structured content generation. Accepts a
 * provider-neutral GenerationRequest. Not an AI provider, prompt store,
 * or job runner. The only implementation is the existing deterministic
 * mapper.
 */

import type { GenerationRequest } from "@/features/content/lib/brief-generation";
import { outputFromBrief } from "@/features/content/lib/content-output";
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
  return deterministicPort;
}
