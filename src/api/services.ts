import { AuthApi } from '@/features/auth/auth.api';
import { getAuthToken } from '@/features/auth/authStore';
import { TasksApi } from '@/features/tasks/tasks.api';
import { ApiClient } from './client';
import { createMockFetch } from './mockBackend';

/**
 * Composition root. Every dependency is wired exactly once here and the rest of
 * the app imports the ready-made `services`. Swapping the mock backend for a
 * real one is a single line: drop `createMockFetch()` and point baseUrl at the
 * API + use global fetch. Nothing downstream changes.
 */
const USE_MOCK = true;

const baseUrl = USE_MOCK ? 'https://mock.local' : 'https://api.yourservice.com';
const fetchImpl = USE_MOCK ? createMockFetch() : fetch;

const client = new ApiClient(baseUrl, getAuthToken, fetchImpl);

export const services = {
  client,
  auth: new AuthApi(client),
  tasks: new TasksApi(client),
} as const;
