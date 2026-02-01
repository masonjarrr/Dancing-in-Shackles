'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoodSlider } from './mood-slider';
import { EnergySlider } from './energy-slider';

interface CheckinFormProps {
  onSubmit: (data: {
    mood: number;
    energy: number;
    hours_worked: number;
    notes: string;
  }) => void;
  isSubmitting: boolean;
  todayCompleted: boolean;
}

export function CheckinForm({ onSubmit, isSubmitting, todayCompleted }: CheckinFormProps) {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      mood,
      energy,
      hours_worked: parseFloat(hours) || 0,
      notes,
    });
  }

  if (todayCompleted) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium">Check-in complete for today</p>
          <p className="text-sm text-muted-foreground mt-1">
            Come back tomorrow for your next check-in.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <MoodSlider value={mood} onChange={setMood} />
          <EnergySlider value={energy} onChange={setEnergy} />

          <div className="space-y-2">
            <Label htmlFor="hours">Hours Worked Today</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Anything on your mind?"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Check-in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
