'use client';

import { AlertTriangle, XCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WellbeingAlert } from '@/types/database';
import { supabase } from '@/lib/supabase/client';

interface ActiveAlertsProps {
  alerts: WellbeingAlert[];
  onAcknowledge: (id: string) => void;
}

export function ActiveAlerts({ alerts, onAcknowledge }: ActiveAlertsProps) {
  const unacked = alerts.filter((a) => !a.acknowledged);

  async function handleAcknowledge(id: string) {
    await supabase.from('wellbeing_alerts').update({ acknowledged: true }).eq('id', id);
    onAcknowledge(id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Active Alerts {unacked.length > 0 && `(${unacked.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {unacked.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts. All clear.</p>
        ) : (
          unacked.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                alert.severity === 'red'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              )}
            >
              {alert.severity === 'red' ? (
                <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium capitalize">
                  {alert.alert_type.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAcknowledge(alert.id)}
                className="shrink-0"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
