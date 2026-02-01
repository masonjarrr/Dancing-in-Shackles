'use client';

import { WORKLOAD } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface WorkloadMeterProps {
  activeCount: number;
}

export function WorkloadMeter({ activeCount }: WorkloadMeterProps) {
  const percentage = Math.min((activeCount / WORKLOAD.RED_THRESHOLD) * 100, 100);
  const status =
    activeCount <= WORKLOAD.GREEN_MAX
      ? 'green'
      : activeCount <= WORKLOAD.YELLOW_MAX
        ? 'yellow'
        : 'red';

  const statusColors = {
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const statusLabels = {
    green: 'Light',
    yellow: 'Moderate',
    red: 'Heavy',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Workload</span>
        <span className={cn(
          'font-medium',
          status === 'green' && 'text-emerald-400',
          status === 'yellow' && 'text-yellow-400',
          status === 'red' && 'text-red-400'
        )}>
          {activeCount} active — {statusLabels[status]}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', statusColors[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
