/**
 * Typed generation-provider failures. Safe for API mapping.
 * Never attach credentials, request payloads, or provider response bodies.
 */

export type GenerationProviderErrorCode =
  | "missing_key"
  | "unauthorized"
  | "rate_limited"
  | "unavailable"
  | "network"
  | "invalid_response";

export class GenerationProviderError extends Error {
  constructor(
    message: string,
    readonly code: GenerationProviderErrorCode,
  ) {
    super(message);
    this.name = "GenerationProviderError";
  }
}
