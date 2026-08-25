import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { getVerseCitationByAddress } from "@/server/repositories/knowledge.repository";

type RouteParams = { params: Promise<{ address: string }> };

/**
 * Verse lookup by address. Accepts `2.47` and `bg-2-47` so callers can use
 * either the human reference or the stable corpus id.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireUser();
    const { address } = await params;
    const citation = await getVerseCitationByAddress(decodeURIComponent(address));
    return jsonOk(citation);
  } catch (error) {
    return jsonError(error);
  }
}
