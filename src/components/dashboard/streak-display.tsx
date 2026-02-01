'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakDisplayProps {
  /** Array of 14 booleans, most recent first. true = completed tasks that day. */
  days: { date: string; completed: boolean }[];
  currentStreak: number;
}

export function StreakDisplay({ days, currentStreak }: StreakDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Streak: {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-1.5 flex-wrap">
            {days.map((day, i) => (
              <Tooltip key={i}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      'w-7 h-7 rounded-sm',
                      day.completed
                        ? 'bg-emerald-500'
                        : 'bg-muted'
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day.date}: {day.completed ? 'Active' : 'Rest'}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        {currentStreak >= 14 && (
          <p className="text-sm text-yellow-400 mt-3">
            14+ day streak! Consider a recovery day to protect your wellbeing.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
