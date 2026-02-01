'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CheckinForm } from '@/components/checkin/checkin-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateBurnoutScore, calcDaysSinceBreak } from '@/lib/burnout-engine';
import type { Task, DailyLog, BurnoutScore } from '@/types/database';

export default function CheckinPage() {
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [burnoutResult, setBurnoutResult] = useState<BurnoutScore | null>(null);
  const [loading, setLoading] = useState(true);

  const checkToday = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('log_date', today)
      .limit(1);
    setTodayCompleted((data?.length || 0) > 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkToday();
  }, [checkToday]);

  async function handleSubmit(data: {
    mood: number;
    energy: number;
    hours_worked: number;
    notes: string;
  }) {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's task stats
      const { data: tasks } = await supabase.from('tasks').select('*');
      const allTasks: Task[] = tasks || [];
      const todayCompleted = allTasks.filter(
        (t) => t.status === 'completed' && t.updated_at?.split('T')[0] === today
      ).length;
      const todayForgiven = allTasks.filter(
        (t) => t.status === 'forgiven' && t.updated_at?.split('T')[0] === today
      ).length;

      // Insert daily log
      await supabase.from('daily_logs').insert({
        log_date: today,
        mood: data.mood,
        energy: data.energy,
        hours_worked: data.hours_worked,
        tasks_completed: todayCompleted,
        tasks_forgiven: todayForgiven,
        notes: data.notes || null,
      });

      // Run burnout assessment
      const { data: recentLogs } = await supabase
        .from('daily_logs')
        .select('*')
        .order('log_date', { ascending: false })
        .limit(3);

      const logs: DailyLog[] = recentLogs || [];
      const activeTasks = allTasks.filter((t) => t.status === 'active');
      const daysSinceBreak = calcDaysSinceBreak(logs);
      const burnout = calculateBurnoutScore(activeTasks, logs, data.hours_worked, daysSinceBreak);

      setBurnoutResult(burnout);

      // Create alerts based on burnout assessment
      if (burnout.status === 'red') {
        await supabase.from('wellbeing_alerts').insert({
          alert_type: 'exhaustion',
          severity: 'red',
          message: 'Burnout risk is high. Please consider taking a break and forgiving some tasks.',
        });
      } else if (burnout.status === 'yellow') {
        await supabase.from('wellbeing_alerts').insert({
          alert_type: 'overload',
          severity: 'yellow',
          message: 'Burnout risk is rising. Monitor your workload and take breaks.',
        });
      }

      // Low mood alert
      if (data.mood <= 2) {
        await supabase.from('wellbeing_alerts').insert({
          alert_type: 'low_mood',
          severity: data.mood === 1 ? 'red' : 'yellow',
          message: 'Low mood detected. Be gentle with yourself today.',
        });
      }

      setTodayCompleted(true);
    } catch (err) {
      console.error('Failed to submit check-in:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Daily Check-in</h2>

      <CheckinForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        todayCompleted={todayCompleted}
      />

      {burnoutResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Burnout Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  burnoutResult.status === 'green'
                    ? 'bg-emerald-500'
                    : burnoutResult.status === 'yellow'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
              <span className="text-sm font-medium capitalize">{burnoutResult.status}</span>
              <span className="text-sm text-muted-foreground">Score: {burnoutResult.total}/100</span>
            </div>
            <ul className="space-y-1">
              {burnoutResult.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
