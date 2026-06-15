import { AppError, err, ok, Result } from '@/lib/result';

/**
 * One typed HTTP client for the whole app. Centralises:
 *  - base URL + auth header injection
 *  - timeout via AbortController
 *  - bounded retry with backoff on transient failures
 *  - mapping every transport/HTTP failure to a single AppError shape
 *
 * Feature API modules call request<T>() and never touch fetch directly, so
 * cross-cutting concerns (auth, retry, logging) live in exactly one place.
 */

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** retries on network/timeout/5xx only. Default 2. */
  retries?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}

type TokenProvider = () => string | null;

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: TokenProvider,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async request<T>(path: string, opts: RequestOptions = {}): Promise<Result<T>> {
    const { method = 'GET', body, retries = 2, timeoutMs = 10_000 } = opts;
    let attempt = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const token = this.getToken();
        const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
          method,
          signal: opts.signal ?? controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: body == null ? undefined : JSON.stringify(body),
        });
        clearTimeout(timer);

        if (!res.ok) {
          const appErr = AppError.fromStatus(res.status);
          if (this.retryable(appErr.kind) && attempt < retries) {
            attempt += 1;
            await backoff(attempt);
            continue;
          }
          return err(appErr);
        }

        // 204 / empty body tolerated
        const text = await res.text();
        const value = (text ? JSON.parse(text) : null) as T;
        return ok(value);
      } catch (e) {
        clearTimeout(timer);
        const appErr = toAppError(e);
        if (this.retryable(appErr.kind) && attempt < retries) {
          attempt += 1;
          await backoff(attempt);
          continue;
        }
        return err(appErr);
      }
    }
  }

  private retryable(kind: AppError['kind']): boolean {
    return kind === 'network' || kind === 'timeout' || kind === 'server';
  }
}

function toAppError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  if (e instanceof Error && e.name === 'AbortError') {
    return new AppError('timeout', 'Request timed out');
  }
  return new AppError('network', 'Network request failed');
}

function backoff(attempt: number): Promise<void> {
  // 150ms, 300ms, 600ms ... capped. Deterministic (no jitter) to keep tests
  // reproducible; swap in jitter for real production traffic.
  const delay = Math.min(150 * 2 ** (attempt - 1), 2_000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
