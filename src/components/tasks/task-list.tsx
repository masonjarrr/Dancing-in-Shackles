'use client';

import { TaskCard } from './task-card';
import type { Task } from '@/types/database';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onForgive: (task: Task) => void;
  onAbandon: (id: string) => void;
}

export function TaskList({ tasks, onComplete, onForgive, onAbandon }: TaskListProps) {
  const active = tasks.filter((t) => t.status === 'active');
  const done = tasks.filter((t) => t.status !== 'active');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Active ({active.length})
        </h3>
        {active.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No active tasks. Add one above.
          </p>
        ) : (
          <div className="space-y-2">
            {active.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onComplete}
                onForgive={onForgive}
                onAbandon={onAbandon}
              />
            ))}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed / Resolved ({done.length})
          </h3>
          <div className="space-y-2">
            {done.slice(0, 10).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onComplete}
                onForgive={onForgive}
                onAbandon={onAbandon}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
