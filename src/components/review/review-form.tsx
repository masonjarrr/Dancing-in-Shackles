'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface ReviewFormProps {
  commitmentsKept: number;
  commitmentsTotal: number;
  onSubmit: (data: {
    performance_score: number;
    wellbeing_score: number;
    reflection: string;
    improvement: string;
    recovery_needed: boolean;
  }) => void;
  isSubmitting: boolean;
}

export function ReviewForm({
  commitmentsKept,
  commitmentsTotal,
  onSubmit,
  isSubmitting,
}: ReviewFormProps) {
  const [perfScore, setPerfScore] = useState(5);
  const [wellScore, setWellScore] = useState(5);
  const [reflection, setReflection] = useState('');
  const [improvement, setImprovement] = useState('');
  const [recovery, setRecovery] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      performance_score: perfScore,
      wellbeing_score: wellScore,
      reflection,
      improvement,
      recovery_needed: recovery,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium">This Week&apos;s Commitments</p>
            <p className="text-2xl font-bold mt-1">
              {commitmentsKept} / {commitmentsTotal}
            </p>
            <p className="text-xs text-muted-foreground">tasks completed</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Performance Score</Label>
              <span className="text-sm font-medium">{perfScore}/10</span>
            </div>
            <Slider
              value={[perfScore]}
              onValueChange={([v]) => setPerfScore(v)}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Wellbeing Score</Label>
              <span className="text-sm font-medium">{wellScore}/10</span>
            </div>
            <Slider
              value={[wellScore]}
              onValueChange={([v]) => setWellScore(v)}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reflection">Reflection</Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What went well this week? What was challenging?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvement">Improvement Plan</Label>
            <Textarea
              id="improvement"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="What will you do differently next week?"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recovery"
              checked={recovery}
              onChange={(e) => setRecovery(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="recovery" className="text-sm font-normal">
              I need recovery time next week
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
