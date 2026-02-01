'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskList } from '@/components/tasks/task-list';
import { WorkloadMeter } from '@/components/tasks/workload-meter';
import { ForgiveDialog } from '@/components/tasks/forgive-dialog';
import type { Task, CommitmentLevel } from '@/types/database';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [forgiveTask, setForgiveTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    setTasks(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const activeTasks = tasks.filter((t) => t.status === 'active');

  async function handleAddTask(task: {
    title: string;
    commitment_level: CommitmentLevel;
    due_date: string | null;
    recurring: boolean;
  }) {
    const { data } = await supabase.from('tasks').insert(task).select().single();
    if (data) {
      setTasks((prev) => [data, ...prev]);
    }
  }

  async function handleComplete(id: string) {
    const task = tasks.find((t) => t.id === id);
    const newStreak = task ? task.streak_count + 1 : 1;
    await supabase
      .from('tasks')
      .update({ status: 'completed', streak_count: newStreak, updated_at: new Date().toISOString() })
      .eq('id', id);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'completed' as const, streak_count: newStreak, updated_at: new Date().toISOString() } : t
      )
    );
  }

  async function handleForgive(taskId: string, reason: string) {
    await supabase
      .from('tasks')
      .update({
        status: 'forgiven',
        forgive_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'forgiven' as const, forgive_reason: reason || null, updated_at: new Date().toISOString() }
          : t
      )
    );
    setForgiveTask(null);
  }

  async function handleAbandon(id: string) {
    await supabase
      .from('tasks')
      .update({ status: 'abandoned', updated_at: new Date().toISOString() })
      .eq('id', id);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'abandoned' as const, updated_at: new Date().toISOString() } : t
      )
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tasks</h2>

      <WorkloadMeter activeCount={activeTasks.length} />

      <TaskForm activeCount={activeTasks.length} onSubmit={handleAddTask} />

      <TaskList
        tasks={tasks}
        onComplete={handleComplete}
        onForgive={(task) => setForgiveTask(task)}
        onAbandon={handleAbandon}
      />

      <ForgiveDialog
        task={forgiveTask}
        open={!!forgiveTask}
        onOpenChange={(open) => {
          if (!open) setForgiveTask(null);
        }}
        onConfirm={handleForgive}
      />
    </div>
  );
}
