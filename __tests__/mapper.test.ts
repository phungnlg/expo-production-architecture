import type { TaskDTO } from '@/api/mockBackend';
import { countByStatus, sortTasks, toTask } from '@/features/tasks/model';

const dto = (over: Partial<TaskDTO> = {}): TaskDTO => ({
  id: 't1',
  title: 'Title',
  description: 'Desc',
  status: 'todo',
  priority: 'medium',
  assignee_name: 'Phung N.',
  created_at: '2026-06-10T00:00:00.000Z',
  due_at: '2026-06-20T00:00:00.000Z',
  ...over,
});

describe('toTask (DTO -> domain mapper)', () => {
  it('maps snake_case fields to camelCase domain shape', () => {
    const t = toTask(dto());
    expect(t.assignee).toBe('Phung N.');
    expect(t.createdAt).toBeInstanceOf(Date);
    expect(t.dueAt).toBeInstanceOf(Date);
  });

  it('coerces null due_at to null dueAt', () => {
    expect(toTask(dto({ due_at: null })).dueAt).toBeNull();
  });

  it('defaults a missing assignee to "Unassigned"', () => {
    // server occasionally omits the field
    const raw = { ...dto(), assignee_name: undefined } as unknown as TaskDTO;
    expect(toTask(raw).assignee).toBe('Unassigned');
  });
});

describe('sortTasks', () => {
  it('orders in_progress first, then by priority', () => {
    const tasks = [
      toTask(dto({ id: 'a', status: 'done', priority: 'high' })),
      toTask(dto({ id: 'b', status: 'in_progress', priority: 'low' })),
      toTask(dto({ id: 'c', status: 'todo', priority: 'high' })),
      toTask(dto({ id: 'd', status: 'todo', priority: 'low' })),
    ];
    expect(sortTasks(tasks).map((t) => t.id)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('does not mutate the input array', () => {
    const tasks = [toTask(dto({ id: 'a' })), toTask(dto({ id: 'b' }))];
    const snapshot = tasks.map((t) => t.id);
    sortTasks(tasks);
    expect(tasks.map((t) => t.id)).toEqual(snapshot);
  });
});

describe('countByStatus', () => {
  it('tallies each status', () => {
    const tasks = [
      toTask(dto({ status: 'todo' })),
      toTask(dto({ status: 'todo' })),
      toTask(dto({ status: 'done' })),
    ];
    expect(countByStatus(tasks)).toEqual({ todo: 2, in_progress: 0, done: 1 });
  });
});
