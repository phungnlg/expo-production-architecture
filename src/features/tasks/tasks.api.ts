import { ApiClient } from '@/api/client';
import type { TaskDTO } from '@/api/mockBackend';
import { AppError, err, ok, Result } from '@/lib/result';
import { NewTaskInput, Task, toTask } from './model';

/**
 * Tasks data source. Owns endpoint paths and DTO->domain mapping for this
 * feature. Returns domain `Task` (or AppError) - callers never see TaskDTO.
 */
export class TasksApi {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<Result<Task[]>> {
    const res = await this.client.request<{ items: TaskDTO[] }>('/tasks');
    if (!res.ok) return res;
    return ok(res.value.items.map(toTask));
  }

  async get(id: string): Promise<Result<Task>> {
    const res = await this.client.request<TaskDTO>(`/tasks/${id}`);
    if (!res.ok) return res;
    return ok(toTask(res.value));
  }

  async create(input: NewTaskInput): Promise<Result<Task>> {
    const title = input.title.trim();
    if (title.length < 3) {
      return err(
        new AppError('validation', 'Title must be at least 3 characters.'),
      );
    }
    const res = await this.client.request<TaskDTO>('/tasks', {
      method: 'POST',
      body: {
        title,
        description: input.description.trim(),
        priority: input.priority,
      },
      retries: 0, // never retry a non-idempotent create
    });
    if (!res.ok) return res;
    return ok(toTask(res.value));
  }
}
