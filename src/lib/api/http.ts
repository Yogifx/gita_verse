import { NextResponse } from "next/server";
import {
  DuplicateRecordError,
  NotFoundError,
  PersistenceError,
  UnauthorizedError,
  ValidationError,
} from "@/server/persistence/errors";

export function jsonOk<T>(data: T, init?: { status?: number }): NextResponse {
  return NextResponse.json({ data }, { status: init?.status ?? 200 });
}

/**
 * Maps repository errors to HTTP responses instead of letting failures
 * surface as opaque 500s or get silently swallowed.
 */
export function jsonError(error: unknown): NextResponse {
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: { message: error.message, code: "not_found" } }, { status: 404 });
  }
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: { message: error.message, code: "invalid_input" } }, { status: 400 });
  }
  if (error instanceof DuplicateRecordError) {
    return NextResponse.json({ error: { message: error.message, code: "duplicate" } }, { status: 409 });
  }
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: { message: error.message, code: "unauthorized" } }, { status: 401 });
  }
  if (error instanceof PersistenceError) {
    // eslint-disable-next-line no-console
    console.error("[GitaVerse] persistence error:", error, error.cause);
    return NextResponse.json(
      { error: { message: error.message, code: "storage_unavailable" } },
      { status: 503 },
    );
  }

  // eslint-disable-next-line no-console
  console.error("[GitaVerse] unexpected API error:", error);
  return NextResponse.json(
    { error: { message: "Something went wrong on the server.", code: "internal_error" } },
    { status: 500 },
  );
}
