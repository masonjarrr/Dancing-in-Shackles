'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BILLING, BILLING_MILESTONES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BillingProgressProps {
  hoursToday: number;
}

function getBarColor(hours: number): string {
  if (hours >= BILLING.TARGET_HOURS) return 'bg-emerald-500';
  if (hours >= 6) return 'bg-blue-500';
  if (hours >= 4) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getMilestoneMessage(hours: number): string {
  const milestones = Object.keys(BILLING_MILESTONES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const m of milestones) {
    if (hours >= m) return BILLING_MILESTONES[m];
  }
  return BILLING_MILESTONES[0];
}

export function BillingProgress({ hoursToday }: BillingProgressProps) {
  const percentage = Math.min((hoursToday / BILLING.TARGET_HOURS) * 100, 125);
  const barColor = getBarColor(hoursToday);
  const message = getMilestoneMessage(hoursToday);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Daily Billing</span>
          <span className={cn(
            'text-lg font-bold',
            hoursToday >= BILLING.TARGET_HOURS ? 'text-emerald-400' : 'text-muted-foreground'
          )}>
            {hoursToday.toFixed(1)} / {BILLING.TARGET_HOURS}.0 hrs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
        {hoursToday >= BILLING.OVERTIME_WARNING && (
          <p className="text-sm text-yellow-400">
            Over {BILLING.OVERTIME_WARNING} hours — consider wrapping up to protect tomorrow.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
