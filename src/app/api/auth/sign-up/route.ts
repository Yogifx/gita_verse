import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { establishSession } from "@/server/auth/session";
import { createUser } from "@/server/repositories/users.repository";
import { ValidationError } from "@/server/persistence/errors";

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string; password?: string; displayName?: string };
    try {
      body = (await request.json()) as {
        email?: string;
        password?: string;
        displayName?: string;
      };
    } catch {
      throw new ValidationError("Request body must be JSON.");
    }
    if (!body.email || !body.password) {
      throw new ValidationError("Email and password are required.");
    }

    const created = await createUser({
      email: body.email,
      password: body.password,
      displayName: body.displayName,
    });
    const publicUser = await establishSession(created.id);
    return jsonOk(publicUser, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
