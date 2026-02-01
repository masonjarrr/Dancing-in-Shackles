'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FORGIVE_MESSAGES } from '@/lib/constants';
import type { Task } from '@/types/database';

interface ForgiveDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (taskId: string, reason: string) => void;
}

export function ForgiveDialog({ task, open, onOpenChange, onConfirm }: ForgiveDialogProps) {
  const [reason, setReason] = useState('');

  const message = FORGIVE_MESSAGES[Math.floor(Math.random() * FORGIVE_MESSAGES.length)];

  function handleConfirm() {
    if (task) {
      onConfirm(task.id, reason);
      setReason('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgive Task</DialogTitle>
          <DialogDescription className="text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        {task && (
          <div className="space-y-4">
            <p className="text-sm">
              Forgiving: <span className="font-semibold">{task.title}</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Why are you letting this go? This is for you, not judgment."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Task
          </Button>
          <Button onClick={handleConfirm}>
            Forgive & Let Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
