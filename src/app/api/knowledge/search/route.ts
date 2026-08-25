import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { ValidationError } from "@/server/persistence/errors";
import { searchVerses } from "@/server/repositories/knowledge.repository";

/** Verse retrieval by reference, Devanagari, or transliteration. */
export async function GET(request: NextRequest) {
  try {
    await requireUser();

    const query = request.nextUrl.searchParams.get("q") ?? "";
    const rawLimit = request.nextUrl.searchParams.get("limit");
    let limit: number | undefined;
    if (rawLimit !== null) {
      if (!/^\d+$/.test(rawLimit)) {
        throw new ValidationError("Search limit must be a positive integer.");
      }
      limit = Number(rawLimit);
    }

    return jsonOk(await searchVerses(query, { limit }));
  } catch (error) {
    return jsonError(error);
  }
}
