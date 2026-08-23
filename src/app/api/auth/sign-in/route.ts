import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { establishSession } from "@/server/auth/session";
import { authenticateUser } from "@/server/repositories/users.repository";
import { ValidationError } from "@/server/persistence/errors";

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string; password?: string };
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      throw new ValidationError("Request body must be JSON.");
    }
    if (!body.email || !body.password) {
      throw new ValidationError("Email and password are required.");
    }

    const user = await authenticateUser(body.email, body.password);
    const publicUser = await establishSession(user.id);
    return jsonOk(publicUser);
  } catch (error) {
    return jsonError(error);
  }
}
