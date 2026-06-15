import { services } from '@/api/services';
import { AppError } from '@/lib/result';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { NewTaskInput, sortTasks, Task } from './model';

/**
 * React Query bindings for the tasks feature. Query keys, server-state caching,
 * background refetch and cache invalidation live here - screens just call the
 * hook and render `data / isPending / error`. Server state stays in React
 * Query; only client/UI state goes in Zustand.
 */
export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

/** Unwrap a Result into the throw-based contract React Query expects. */
function unwrap<T>(res: { ok: true; value: T } | { ok: false; error: AppError }): T {
  if (res.ok) return res.value;
  throw res.error;
}

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: async () => sortTasks(unwrap(await services.tasks.list())),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => unwrap(await services.tasks.get(id)),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewTaskInput): Promise<Task> =>
      unwrap(await services.tasks.create(input)),
    onSuccess: () => {
      // refetch the list so the new task appears with server ordering
      qc.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
