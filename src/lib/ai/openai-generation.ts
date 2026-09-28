/**
 * GV-015.6 OpenAI generation adapter.
 *
 * Implements GenerationPort via server-side fetch. Isolated from UI/client
 * code. Does not change GenerationRequest or ContentOutput.
 */

import type { GenerationRequest } from "@/features/content/lib/brief-generation";
import { assertContentOutput } from "@/features/content/lib/content-output";
import { GenerationProviderError } from "@/lib/ai/generation-error";
import { readOpenAiApiKey } from "@/lib/ai/generation-env";
import type { ContentOutput } from "@/types/content";

const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_GENERATION_MODEL = "gpt-4o-mini";
const OPENAI_TIMEOUT_MS = 30_000;

export type OpenAiGenerationPort = {
  generate(request: GenerationRequest): Promise<ContentOutput>;
};

export function createOpenAiGenerationPort(): OpenAiGenerationPort {
  return {
    async generate(request) {
      const apiKey = readOpenAiApiKey();
      if (!apiKey) {
        throw new GenerationProviderError(
          "The OpenAI generation adapter is selected, but OPENAI_API_KEY is not configured.",
          "missing_key",
        );
      }

      let response: Response;
      try {
        response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENAI_GENERATION_MODEL,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: buildSystemPrompt(request.format) },
              { role: "user", content: buildUserPrompt(request) },
            ],
          }),
          signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
        });
      } catch {
        throw new GenerationProviderError(
          "The generation provider could not be reached.",
          "network",
        );
      }

      throwIfProviderHttpFailed(response.status);

      const body = await readProviderJson(response);
      const parsed = parseProviderJson(extractMessageContent(body));
      return assertContentOutput(parsed, request.format);
    },
  };
}

export function throwIfProviderHttpFailed(status: number): void {
  if (status === 401 || status === 403) {
    throw new GenerationProviderError(
      "The generation provider rejected the request.",
      "unauthorized",
    );
  }
  if (status === 429) {
    throw new GenerationProviderError(
      "The generation provider is rate limited. Try again shortly.",
      "rate_limited",
    );
  }
  if (status >= 500) {
    throw new GenerationProviderError(
      "The generation provider is temporarily unavailable.",
      "unavailable",
    );
  }
  if (status < 200 || status >= 300) {
    throw new GenerationProviderError(
      "The generation provider returned an unexpected error.",
      "unavailable",
    );
  }
}

export function parseProviderJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    throw new GenerationProviderError(
      "The generation provider returned invalid JSON.",
      "invalid_response",
    );
  }
}

export function extractMessageContent(body: unknown): string {
  if (!body || typeof body !== "object") {
    throw new GenerationProviderError(
      "The generation provider returned an empty response.",
      "invalid_response",
    );
  }

  const choices = (body as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") {
    throw new GenerationProviderError(
      "The generation provider returned an empty response.",
      "invalid_response",
    );
  }

  const message = (choices[0] as { message?: { content?: unknown } }).message;
  const content = message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new GenerationProviderError(
      "The generation provider returned an empty response.",
      "invalid_response",
    );
  }

  return content;
}

async function readProviderJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new GenerationProviderError(
      "The generation provider returned an unreadable response.",
      "invalid_response",
    );
  }
}

function buildSystemPrompt(format: GenerationRequest["format"]): string {
  return [
    "Generate the requested ContentOutput.",
    `Follow the requested format exactly. The format is "${format}".`,
    "Use the supplied brief as creative direction.",
    "Preserve the supplied citation identity.",
    "Do not invent or change verse identity.",
    "Return JSON only.",
    "Do not return markdown fences.",
    "Do not return explanatory text outside the JSON object.",
  ].join(" ");
}

function buildUserPrompt(request: GenerationRequest): string {
  return JSON.stringify({
    format: request.format,
    hook: request.hook,
    keyMessage: request.keyMessage,
    keyTeaching: request.keyTeaching,
    meaning: request.meaning,
    contentGoal: request.contentGoal,
    citation: request.citation,
    outputContract: describeOutputContract(request.format),
  });
}

function describeOutputContract(format: GenerationRequest["format"]): unknown {
  if (format === "reel") {
    return {
      format: "reel",
      hook: "string",
      scenes: [{ voiceover: "string", onScreenText: "string", visualDirection: "string" }],
      closing: "string",
      cta: "string",
    };
  }
  if (format === "carousel") {
    return {
      format: "carousel",
      slides: [
        {
          role: "cover | content | close",
          headline: "string",
          body: "string",
          visualDirection: "optional string",
          cta: "optional string",
        },
      ],
    };
  }
  return {
    format: "post",
    headline: "string",
    body: "string",
    cta: "string",
    keyMessage: "optional string",
    visualDirection: "optional string",
  };
}
