'use client';

import { Check, Heart, X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/database';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onForgive: (task: Task) => void;
  onAbandon: (id: string) => void;
}

const commitmentColors = {
  low: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

export function TaskCard({ task, onComplete, onForgive, onAbandon }: TaskCardProps) {
  const isActive = task.status === 'active';

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-colors',
        isActive ? 'bg-card' : 'bg-muted/50 opacity-60'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm font-medium truncate', !isActive && 'line-through')}>
            {task.title}
          </p>
          <Badge variant="outline" className={cn('text-xs shrink-0', commitmentColors[task.commitment_level])}>
            {task.commitment_level}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {task.due_date && (
            <span className="text-xs text-muted-foreground">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {task.streak_count > 0 && (
            <span className="text-xs text-orange-400 flex items-center gap-1">
              <Flame className="h-3 w-3" /> {task.streak_count}
            </span>
          )}
          {task.status === 'forgiven' && (
            <span className="text-xs text-purple-400">Forgiven</span>
          )}
          {task.status === 'abandoned' && (
            <span className="text-xs text-muted-foreground">Abandoned</span>
          )}
        </div>
      </div>

      {isActive && (
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
            onClick={() => onComplete(task.id)}
            title="Complete"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            onClick={() => onForgive(task)}
            title="Forgive"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onAbandon(task.id)}
            title="Abandon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
