import { TASK_POINTS, SHACKLES, WELLBEING_ALERT_PENALTY } from './constants';
import type {
  Task,
  DailyLog,
  WellbeingAlert,
  PerformanceScore,
  WellbeingScore,
} from '@/types/database';

/**
 * Calculate performance score (0-100) based on completed tasks.
 * High = 5pts, Medium = 3pts, Low = 1pt.
 */
export function calculatePerformanceScore(
  completedTasks: Task[],
  allTasks: Task[]
): PerformanceScore {
  const pointsEarned = completedTasks.reduce(
    (sum, t) => sum + (TASK_POINTS[t.commitment_level] || 1),
    0
  );

  const pointsPossible = allTasks.reduce(
    (sum, t) => sum + (TASK_POINTS[t.commitment_level] || 1),
    0
  );

  const score = pointsPossible > 0 ? Math.round((pointsEarned / pointsPossible) * 100) : 0;

  return {
    score: Math.min(score, 100),
    tasksCompleted: completedTasks.length,
    pointsEarned,
    pointsPossible,
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
