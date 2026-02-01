'use client';

import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_MESSAGES } from '@/lib/constants';
import type { StatusColor } from '@/types/database';

interface StatusBannerProps {
  status: StatusColor;
}

const statusConfig = {
  green: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
  },
  yellow: {
    icon: AlertTriangle,
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    text: 'text-yellow-400',
  },
  red: {
    icon: XCircle,
    bg: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-400',
  },
};

export function StatusBanner({ status }: StatusBannerProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3 p-4 rounded-lg border', config.bg)}>
      <Icon className={cn('h-6 w-6 shrink-0', config.text)} />
      <div>
        <p className={cn('font-semibold capitalize', config.text)}>
          {status === 'green' ? 'Healthy' : status === 'yellow' ? 'Caution' : 'Recovery Needed'}
        </p>
        <p className="text-sm text-muted-foreground">{STATUS_MESSAGES[status]}</p>
      </div>
    </div>
  );
}
