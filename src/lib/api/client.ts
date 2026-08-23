/**
 * Thin client-side fetch wrapper for the GitaVerse persistence API.
 * Feature stores call these helpers to write through to `/api/*` while
 * keeping their own optimistic in-memory update as the fast path — see
 * each store's `hydrate`/create/update actions.
 */

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  if (!response.ok) {
    const errorBody = body as { error?: { message?: string; code?: string } } | undefined;
    throw new ApiError(
      errorBody?.error?.message ?? `Request failed with status ${response.status}.`,
      response.status,
      errorBody?.error?.code,
    );
  }

  return (body as { data: T }).data;
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(path, { method: "GET" }).then((res) => parseResponse<T>(res));
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => parseResponse<T>(res));
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => parseResponse<T>(res));
}
