'use client';

import { MOOD_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Mood</label>
      <div className="flex justify-between gap-2">
        {MOOD_EMOJIS.map((emoji, i) => (
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
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs text-muted-foreground">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
