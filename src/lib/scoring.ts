import { TASK_POINTS, SHACKLES, WELLBEING_ALERT_PENALTY, BILLING } from './constants';
import type {
  Task,
  DailyLog,
  WellbeingAlert,
  PerformanceScore,
  WellbeingScore,
} from '@/types/database';

/**
 * Calculate performance score (0-100).
 * 60% task completion (weighted by commitment level) + 40% billing hours.
 */
export function calculatePerformanceScore(
  completedTasks: Task[],
  allTasks: Task[],
  hoursToday: number = 0,
  billingTarget: number = BILLING.TARGET_HOURS
): PerformanceScore {
  const pointsEarned = completedTasks.reduce(
    (sum, t) => sum + (TASK_POINTS[t.commitment_level] || 1),
    0
  );

  const pointsPossible = allTasks.reduce(
    (sum, t) => sum + (TASK_POINTS[t.commitment_level] || 1),
    0
  );

  const taskScore = pointsPossible > 0 ? (pointsEarned / pointsPossible) * 100 : 0;

  // Billing component: percentage of target met, capped at 100%
  const billingScore = billingTarget > 0
    ? Math.min((hoursToday / billingTarget) * 100, 100)
    : 0;

  // 60% tasks + 40% billing
  const score = Math.round(taskScore * 0.6 + billingScore * 0.4);

  return {
    score: Math.min(score, 100),
    tasksCompleted: completedTasks.length,
    pointsEarned,
    pointsPossible,
    billingHours: hoursToday,
    billingTarget,
    billingMet: hoursToday >= billingTarget,
  };
}

/**
 * Calculate wellbeing score (0-100) from mood, energy, and alert penalties.
 */
export function calculateWellbeingScore(
  recentLogs: DailyLog[],
  unacknowledgedAlerts: WellbeingAlert[]
): WellbeingScore {
  if (recentLogs.length === 0) {
    return { score: 50, avgMood: 3, avgEnergy: 3, unacknowledgedAlerts: unacknowledgedAlerts.length };
  }

  const avgMood = recentLogs.reduce((s, l) => s + l.mood, 0) / recentLogs.length;
  const avgEnergy = recentLogs.reduce((s, l) => s + l.energy, 0) / recentLogs.length;

  // Normalize mood+energy (each 1-5) to 0-100
  const baseScore = (((avgMood + avgEnergy) / 2 - 1) / 4) * 100;

  // Penalize for unacknowledged alerts
  const penalty = unacknowledgedAlerts.length * WELLBEING_ALERT_PENALTY;
  const score = Math.max(0, Math.round(baseScore - penalty));

  return {
    score: Math.min(score, 100),
    avgMood: Math.round(avgMood * 10) / 10,
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    unacknowledgedAlerts: unacknowledgedAlerts.length,
  };
}

/**
 * Detect "Dancing in Shackles" pattern:
 * High performance + low wellbeing = unsustainable pace.
 */
export function detectDancingInShackles(
  performanceScore: number,
  wellbeingScore: number
): boolean {
  return (
    performanceScore > SHACKLES.PERFORMANCE_THRESHOLD &&
    wellbeingScore < SHACKLES.WELLBEING_THRESHOLD
  );
}
