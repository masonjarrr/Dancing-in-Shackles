import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { calculateBurnoutScore, calcDaysSinceBreak } from '@/lib/burnout-engine';
import { calculatePerformanceScore, calculateWellbeingScore, detectDancingInShackles } from '@/lib/scoring';
import type { Task, DailyLog, WellbeingAlert } from '@/types/database';

export async function GET() {
  try {
    const supabase = createServerClient();

    const [tasksRes, logsRes, alertsRes] = await Promise.all([
      supabase.from('tasks').select('*'),
      supabase.from('daily_logs').select('*').order('log_date', { ascending: false }).limit(7),
      supabase.from('wellbeing_alerts').select('*').eq('acknowledged', false),
    ]);

    const tasks: Task[] = tasksRes.data || [];
    const logs: DailyLog[] = logsRes.data || [];
    const alerts: WellbeingAlert[] = alertsRes.data || [];

    const activeTasks = tasks.filter((t) => t.status === 'active');
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    const allNonAbandoned = tasks.filter((t) => t.status !== 'abandoned');

    const last3Logs = logs.slice(0, 3);
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find((l) => l.log_date === today);
    const hoursToday = todayLog?.hours_worked || 0;
    const daysSinceBreak = calcDaysSinceBreak(logs);

    const burnout = calculateBurnoutScore(activeTasks, last3Logs, hoursToday, daysSinceBreak);
    const performance = calculatePerformanceScore(completedTasks, allNonAbandoned);
    const wellbeing = calculateWellbeingScore(last3Logs, alerts);
    const dancingInShackles = detectDancingInShackles(performance.score, wellbeing.score);

    return NextResponse.json({
      burnout,
      performance,
      wellbeing,
      dancingInShackles,
      activeTasks: activeTasks.length,
      unacknowledgedAlerts: alerts.length,
    });
  } catch (error) {
    console.error('Burnout check error:', error);
    return NextResponse.json({ error: 'Failed to run burnout check' }, { status: 500 });
  }
}
