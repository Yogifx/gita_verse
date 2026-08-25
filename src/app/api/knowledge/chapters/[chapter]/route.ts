import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { ValidationError } from "@/server/persistence/errors";
import {
  getChapterDetail,
  getCorpusAttribution,
} from "@/server/repositories/knowledge.repository";

type RouteParams = { params: Promise<{ chapter: string }> };

/** Chapter metadata plus its verses as citation objects. */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireUser();
    const { chapter } = await params;
    if (!/^\d{1,2}$/.test(chapter)) {
      throw new ValidationError(`"${chapter}" is not a valid chapter number.`);
    }

    const [detail, attribution] = await Promise.all([
      getChapterDetail(Number(chapter)),
      getCorpusAttribution(),
    ]);
    return jsonOk({ ...detail, attribution });
  } catch (error) {
    return jsonError(error);
  }
}
