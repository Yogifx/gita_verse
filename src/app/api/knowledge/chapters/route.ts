import { jsonError, jsonOk } from "@/lib/api/http";
import { requireUser } from "@/server/auth/session";
import { getCorpusProvenance, listChapters } from "@/server/repositories/knowledge.repository";

/** Read-only chapter index. The corpus is global, so no owner scoping applies. */
export async function GET() {
  try {
    await requireUser();
    const [chapters, provenance] = await Promise.all([listChapters(), getCorpusProvenance()]);
    return jsonOk({ chapters, provenance });
  } catch (error) {
    return jsonError(error);
  }
}
