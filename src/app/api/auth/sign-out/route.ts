import { jsonError, jsonOk } from "@/lib/api/http";
import { clearSession } from "@/server/auth/session";

export async function POST() {
  try {
    await clearSession();
    return jsonOk({ signedOut: true });
  } catch (error) {
    return jsonError(error);
  }
}
