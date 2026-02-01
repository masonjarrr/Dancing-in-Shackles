'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WORKLOAD } from '@/lib/constants';
import type { CommitmentLevel } from '@/types/database';

interface TaskFormProps {
  activeCount: number;
  onSubmit: (task: {
    title: string;
    commitment_level: CommitmentLevel;
    due_date: string | null;
    recurring: boolean;
  }) => void;
}

export function TaskForm({ activeCount, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [commitment, setCommitment] = useState<CommitmentLevel>('medium');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [warning, setWarning] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeCount >= WORKLOAD.YELLOW_MAX && commitment === 'high') {
      setWarning(
        'You already have a heavy workload. Adding a high-commitment task may lead to burnout. Continue anyway?'
      );
      return;
    }

    submitTask();
  }

  function submitTask() {
    onSubmit({
      title: title.trim(),
      commitment_level: commitment,
      due_date: dueDate || null,
      recurring,
    });
    setTitle('');
    setDueDate('');
    setCommitment('medium');
    setRecurring(false);
    setWarning('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Add Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Commitment Level</Label>
              <Select value={commitment} onValueChange={(v) => setCommitment(v as CommitmentLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="recurring" className="text-sm font-normal">
              Recurring task
            </Label>
          </div>

          {warning && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400">{warning}</p>
              <div className="flex gap-2 mt-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setWarning('')}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={submitTask}>
                  Add Anyway
                </Button>
              </div>
            </div>
          )}

          {!warning && (
            <Button type="submit" className="w-full">
              Add Task
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
