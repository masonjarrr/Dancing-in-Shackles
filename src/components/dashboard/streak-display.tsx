'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BILLING } from '@/lib/constants';

interface StreakDay {
  date: string;
  hours: number;
}

interface StreakDisplayProps {
  days: StreakDay[];
  currentStreak: number;
}

function getDayColor(hours: number): string {
  if (hours >= BILLING.TARGET_HOURS) return 'bg-emerald-500';
  if (hours >= 6) return 'bg-amber-500';
  return 'bg-muted';
}

function getDayLabel(hours: number): string {
  if (hours >= BILLING.TARGET_HOURS) return `${hours.toFixed(1)}h (target met)`;
  if (hours >= 6) return `${hours.toFixed(1)}h (close)`;
  if (hours > 0) return `${hours.toFixed(1)}h`;
  return 'No billing';
}

export function StreakDisplay({ days, currentStreak }: StreakDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Billing Streak: {currentStreak} day{currentStreak !== 1 ? 's' : ''} at {BILLING.TARGET_HOURS}+ hrs
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
                      getDayColor(day.hours)
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day.date}: {getDayLabel(day.hours)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        {currentStreak >= 14 && (
          <p className="text-sm text-yellow-400 mt-3">
            14+ day billing streak! Consider a recovery day to avoid diminishing returns.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
