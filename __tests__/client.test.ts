import { ApiClient } from '@/api/client';

/**
 * The retry/timeout/error-mapping policy is the kind of cross-cutting logic
 * that is easy to break and hard to notice. Test it directly against a fake
 * fetch instead of through the UI.
 */
const okResponse = (body: unknown): Response =>
  ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(body),
  }) as Response;

const statusResponse = (status: number): Response =>
  ({ ok: false, status, text: async () => '' }) as Response;

describe('ApiClient', () => {
  it('returns ok(value) on success', async () => {
    const fetchImpl = jest.fn(async () => okResponse({ hello: 'world' }));
    const client = new ApiClient('https://x', () => null, fetchImpl as never);
    const res = await client.request<{ hello: string }>('/ping');
    expect(res).toEqual({ ok: true, value: { hello: 'world' } });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('injects the bearer token when present', async () => {
    const fetchImpl = jest.fn(async () => okResponse({}));
    const client = new ApiClient('https://x', () => 'tok', fetchImpl as never);
    await client.request('/me');
    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const headers = call[1].headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer tok');
  });

  it('retries on 503 then succeeds', async () => {
    let calls = 0;
    const fetchImpl = jest.fn(async () => {
      calls += 1;
      return calls < 2 ? statusResponse(503) : okResponse({ ok: 1 });
    });
    const client = new ApiClient('https://x', () => null, fetchImpl as never);
    const res = await client.request('/tasks', { retries: 2 });
    expect(res.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('does not retry a 404 and maps it to not_found', async () => {
    const fetchImpl = jest.fn(async () => statusResponse(404));
    const client = new ApiClient('https://x', () => null, fetchImpl as never);
    const res = await client.request('/tasks/missing', { retries: 3 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.kind).toBe('not_found');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('maps a thrown network error to kind network', async () => {
    const fetchImpl = jest.fn(async () => {
      throw new TypeError('Network request failed');
    });
    const client = new ApiClient('https://x', () => null, fetchImpl as never);
    const res = await client.request('/tasks', { retries: 0 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.kind).toBe('network');
  });
});
