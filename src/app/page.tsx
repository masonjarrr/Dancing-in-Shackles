'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { StatusBanner } from '@/components/dashboard/status-banner';
import { DualGauge } from '@/components/dashboard/dual-gauge';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { ActiveAlerts } from '@/components/dashboard/active-alerts';
import { StreakDisplay } from '@/components/dashboard/streak-display';
import { calculateBurnoutScore, calcDaysSinceBreak } from '@/lib/burnout-engine';
import { calculatePerformanceScore, calculateWellbeingScore, detectDancingInShackles } from '@/lib/scoring';
import type { Task, DailyLog, WellbeingAlert, StatusColor } from '@/types/database';

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusColor>('green');
  const [perfScore, setPerfScore] = useState(0);
  const [wellScore, setWellScore] = useState(0);
  const [alerts, setAlerts] = useState<WellbeingAlert[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; performance: number; wellbeing: number }[]>([]);
  const [streakDays, setStreakDays] = useState<{ date: string; completed: boolean }[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Fetch all data in parallel
      const [tasksRes, logsRes, alertsRes] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('daily_logs').select('*').order('log_date', { ascending: false }).limit(30),
        supabase.from('wellbeing_alerts').select('*').order('created_at', { ascending: false }),
      ]);

      const tasks: Task[] = tasksRes.data || [];
      const logs: DailyLog[] = logsRes.data || [];
      const allAlerts: WellbeingAlert[] = alertsRes.data || [];

      setAlerts(allAlerts);

      // Calculate burnout score
      const activeTasks = tasks.filter((t) => t.status === 'active');
      const last3Logs = logs.slice(0, 3);
      const hoursToday = logs.length > 0 && logs[0].log_date === new Date().toISOString().split('T')[0]
        ? logs[0].hours_worked
        : 0;
      const daysSinceBreak = calcDaysSinceBreak(logs);

      const burnout = calculateBurnoutScore(activeTasks, last3Logs, hoursToday, daysSinceBreak);
      setStatus(burnout.status);

      // Calculate scores
      const completedTasks = tasks.filter((t) => t.status === 'completed');
      const allNonAbandoned = tasks.filter((t) => t.status !== 'abandoned');
      const perf = calculatePerformanceScore(completedTasks, allNonAbandoned);
      const unackedAlerts = allAlerts.filter((a) => !a.acknowledged);
      const well = calculateWellbeingScore(last3Logs, unackedAlerts);

      setPerfScore(perf.score);
      setWellScore(well.score);

      // Check for dancing in shackles
      if (detectDancingInShackles(perf.score, well.score)) {
        const existing = allAlerts.find(
          (a) => a.alert_type === 'dancing_in_shackles' && !a.acknowledged
        );
        if (!existing) {
          await supabase.from('wellbeing_alerts').insert({
            alert_type: 'dancing_in_shackles',
            severity: 'red',
            message:
              'High performance but low wellbeing detected. You may be "dancing in shackles" — performing well but at great personal cost.',
          });
        }
      }

      // Build trend data
      const trend = logs
        .slice(0, 30)
        .reverse()
        .map((log) => {
          const dayPerf = calculatePerformanceScore(
            completedTasks.filter(
              (t) => t.updated_at && t.updated_at.split('T')[0] <= log.log_date
            ),
            allNonAbandoned
          );
          const dayWell = calculateWellbeingScore([log], []);
          return {
            date: log.log_date,
            performance: dayPerf.score,
            wellbeing: dayWell.score,
          };
        });
      setTrendData(trend);

      // Build streak heatmap (last 14 days)
      const today = new Date();
      const heatmap: { date: string; completed: boolean }[] = [];
      let streak = 0;
      let streakBroken = false;

      for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = logs.find((l) => l.log_date === dateStr);
        const hasActivity = log ? log.tasks_completed > 0 : false;
        heatmap.push({ date: dateStr, completed: hasActivity });

        if (!streakBroken) {
          if (hasActivity) streak++;
          else streakBroken = true;
        }
      }

      setStreakDays(heatmap.reverse());
      setCurrentStreak(streak);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleAcknowledge(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <StatusBanner status={status} />

      <DualGauge performanceScore={perfScore} wellbeingScore={wellScore} />

      <TrendChart data={trendData} />

      <div className="grid md:grid-cols-2 gap-6">
        <ActiveAlerts alerts={alerts} onAcknowledge={handleAcknowledge} />
        <StreakDisplay days={streakDays} currentStreak={currentStreak} />
      </div>
    </div>
  );
}
