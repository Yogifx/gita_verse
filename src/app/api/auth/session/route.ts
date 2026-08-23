import { jsonError, jsonOk } from "@/lib/api/http";
import { getCurrentPublicUser } from "@/server/auth/session";

export async function GET() {
  try {
    const user = await getCurrentPublicUser();
    if (!user) {
      return jsonOk(null);
    }
    return jsonOk(user);
  } catch (error) {
    return jsonError(error);
  }
}
