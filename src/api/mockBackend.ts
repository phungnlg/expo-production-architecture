/**
 * In-memory mock backend exposed as a fetch-compatible function. It lets the
 * whole data layer (ApiClient -> feature APIs -> React Query) run end to end
 * with realistic latency and server-shaped DTOs (snake_case, ISO dates) without
 * a live server. Swap `createMockFetch()` for the real base URL + global fetch
 * and nothing above this file changes.
 */

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_name: string;
  created_at: string;
  due_at: string | null;
}

interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

const now = Date.UTC(2026, 5, 15);
const iso = (offsetDays: number) =>
  new Date(now + offsetDays * 86_400_000).toISOString();

// Seed data so every screen is populated on a fresh install - the same content
// shown in the README screenshots.
const seedTasks: TaskDTO[] = [
  {
    id: 't1',
    title: 'Wire auth gate to protected stack',
    description:
      'Redirect unauthenticated users to /sign-in and restore the intended route after login.',
    status: 'in_progress',
    priority: 'high',
    assignee_name: 'Phung N.',
    created_at: iso(-2),
    due_at: iso(1),
  },
  {
    id: 't2',
    title: 'Map TaskDTO -> Task at the API boundary',
    description:
      'Keep snake_case and nullable server fields out of the UI. Mappers own the shape.',
    status: 'todo',
    priority: 'medium',
    assignee_name: 'Phung N.',
    created_at: iso(-1),
    due_at: iso(3),
  },
  {
    id: 't3',
    title: 'Add loading / empty / error states to every list',
    description: 'One StateView component, driven by React Query status.',
    status: 'done',
    priority: 'low',
    assignee_name: 'Phung N.',
    created_at: iso(-5),
    due_at: null,
  },
  {
    id: 't4',
    title: 'Centralise retry + timeout in ApiClient',
    description: 'Bounded backoff on network/5xx. Screens stay dumb.',
    status: 'todo',
    priority: 'high',
    assignee_name: 'Phung N.',
    created_at: iso(-3),
    due_at: iso(2),
  },
];

const seedUser: UserDTO = {
  id: 'u1',
  email: 'demo@studio.app',
  full_name: 'Phung Nguyen',
  role: 'Senior React Native Engineer',
};

interface MockOptions {
  latencyMs?: number;
  /** Force the next N task-list reads to fail, to demo the error state. */
  failNextReads?: number;
}

export function createMockFetch(options: MockOptions = {}) {
  const latency = options.latencyMs ?? 450;
  let failReads = options.failNextReads ?? 0;
  const tasks = [...seedTasks];
  let counter = tasks.length;

  const json = (status: number, payload: unknown): Response =>
    ({
      ok: status >= 200 && status < 300,
      status,
      text: async () => (payload == null ? '' : JSON.stringify(payload)),
    }) as Response;

  return async function mockFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = typeof input === 'string' ? input : input.toString();
    const path = url.replace(/^https?:\/\/[^/]+/, '');
    const method = init?.method ?? 'GET';
    await sleep(latency);

    if (path === '/auth/login' && method === 'POST') {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (!body.email || !body.password) {
        return json(400, { message: 'Email and password are required' });
      }
      return json(200, { token: 'mock-jwt-token', user: seedUser });
    }

    if (path === '/me' && method === 'GET') {
      return json(200, seedUser);
    }

    if (path === '/tasks' && method === 'GET') {
      if (failReads > 0) {
        failReads -= 1;
        return json(503, { message: 'Service unavailable' });
      }
      return json(200, { items: tasks });
    }

    if (path === '/tasks' && method === 'POST') {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      counter += 1;
      const created: TaskDTO = {
        id: `t${counter}`,
        title: body.title,
        description: body.description ?? '',
        status: 'todo',
        priority: body.priority ?? 'medium',
        assignee_name: seedUser.full_name,
        created_at: new Date(now).toISOString(),
        due_at: body.due_at ?? null,
      };
      tasks.unshift(created);
      return json(201, created);
    }

    const detail = path.match(/^\/tasks\/(.+)$/);
    if (detail && method === 'GET') {
      const found = tasks.find((t) => t.id === detail[1]);
      return found ? json(200, found) : json(404, { message: 'Not found' });
    }
    if (detail && method === 'PATCH') {
      const idx = tasks.findIndex((t) => t.id === detail[1]);
      if (idx < 0) return json(404, { message: 'Not found' });
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      tasks[idx] = { ...tasks[idx]!, ...body };
      return json(200, tasks[idx]);
    }

    return json(404, { message: `No mock route for ${method} ${path}` });
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
