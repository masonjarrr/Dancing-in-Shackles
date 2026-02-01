'use client';

import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging } from 'lucide-react';
import { ENERGY_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
}

const icons = [Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryCharging];

export function EnergySlider({ value, onChange }: EnergySliderProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Energy</label>
      <div className="flex justify-between gap-2">
        {ENERGY_LABELS.map((label, i) => {
          const Icon = icons[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all flex-1',
                value === i + 1
                  ? 'bg-primary/10 border-primary scale-105'
                  : 'bg-card border-border hover:bg-accent'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
