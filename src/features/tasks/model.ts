import type { TaskDTO } from '@/api/mockBackend';

/**
 * Domain model for the tasks feature. This is the ONLY task shape the UI knows.
 * The server's wire format (TaskDTO: snake_case, string dates, nullable fields)
 * stops at the mapper below - screens get camelCase, real Date objects, and
 * non-null defaults, so a backend rename never ripples into components.
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  createdAt: Date;
  dueAt: Date | null;
}

export interface NewTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
}

/** DTO -> domain. The single translation point for the wire format. */
export function toTask(dto: TaskDTO): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    status: dto.status,
    priority: dto.priority,
    assignee: dto.assignee_name ?? 'Unassigned',
    createdAt: new Date(dto.created_at),
    dueAt: dto.due_at ? new Date(dto.due_at) : null,
  };
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const STATUS_ORDER: Record<TaskStatus, number> = {
  in_progress: 0,
  todo: 1,
  done: 2,
};
const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Pure sort: active work first, then by priority. Unit-tested in isolation. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
  );
}

export function countByStatus(tasks: Task[]): Record<TaskStatus, number> {
  return tasks.reduce(
    (acc, t) => {
      acc[t.status] += 1;
      return acc;
    },
    { todo: 0, in_progress: 0, done: 0 } as Record<TaskStatus, number>,
  );
}
