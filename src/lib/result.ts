/**
 * Result type - explicit success/failure without throwing across layer
 * boundaries. The API layer returns Result so callers handle errors as data,
 * not control flow. Keeps the data layer pure and testable.
 */
export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'unknown';

/** Single error shape every layer agrees on. UI maps kind -> message. */
export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status?: number;

  constructor(kind: AppErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = status;
  }

  static fromStatus(status: number, message?: string): AppError {
    const kind: AppErrorKind =
      status === 401 || status === 403
        ? 'unauthorized'
        : status === 404
          ? 'not_found'
          : status >= 500
            ? 'server'
            : 'unknown';
    return new AppError(kind, message ?? `Request failed (${status})`, status);
  }
}

/** User-facing copy for an error. Screens never build their own strings. */
export function messageFor(error: AppError): string {
  switch (error.kind) {
    case 'network':
      return 'No connection. Check your network and try again.';
    case 'timeout':
      return 'The request took too long. Please retry.';
    case 'unauthorized':
      return 'Your session expired. Sign in again.';
    case 'not_found':
      return 'We could not find what you were looking for.';
    case 'validation':
      return error.message;
    case 'server':
      return 'Something went wrong on our side. Try again shortly.';
    default:
      return 'Unexpected error. Please try again.';
  }
}
