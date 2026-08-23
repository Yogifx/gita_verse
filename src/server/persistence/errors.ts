/**
 * Typed persistence/repository errors. API route handlers map these to HTTP
 * status codes (src/lib/api/http.ts) instead of letting failures pass
 * through silently or as opaque 500s.
 */

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} "${id}" was not found.`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DuplicateRecordError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} "${id}" already exists.`);
    this.name = "DuplicateRecordError";
  }
}

export class PersistenceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "PersistenceError";
  }
}
