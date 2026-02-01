import { BURNOUT } from './constants';
import type { BurnoutScore, DailyLog, StatusColor, Task } from '@/types/database';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate task load factor (0-100).
 * More active tasks relative to threshold = higher score.
 */
function calcTaskLoad(activeTasks: number): number {
  const ratio = activeTasks / BURNOUT.TASK_THRESHOLD;
  return clamp(ratio * 100, 0, 100);
}

/**
 * Calculate mood factor (0-100).
 * Lower average mood = higher burnout risk.
 */
function calcMoodFactor(recentLogs: DailyLog[]): number {
  if (recentLogs.length === 0) return 50; // neutral default
  const avgMood = recentLogs.reduce((sum, l) => sum + l.mood, 0) / recentLogs.length;
  // Mood is 1-5, invert so low mood = high risk
  return clamp(((5 - avgMood) / 4) * 100, 0, 100);
}

/**
 * Calculate hours worked factor (0-100).
 */
function calcHoursFactor(hoursToday: number): number {
  const ratio = hoursToday / BURNOUT.MAX_HEALTHY_HOURS;
  return clamp(ratio * 100, 0, 100);
}

/**
 * Calculate days since break factor (0-100).
 */
function calcBreakFactor(daysSinceBreak: number): number {
  const ratio = daysSinceBreak / BURNOUT.MAX_DAYS_WITHOUT_BREAK;
  return clamp(ratio * 100, 0, 100);
}

function getStatus(score: number): StatusColor {
  if (score <= BURNOUT.GREEN_MAX) return 'green';
  if (score <= BURNOUT.YELLOW_MAX) return 'yellow';
  return 'red';
}

function getRecommendations(score: number, factors: BurnoutScore['factors']): string[] {
  const recs: string[] = [];

  if (factors.taskLoad > 70) {
    recs.push('Consider forgiving or postponing low-priority tasks to reduce your load.');
  }
  if (factors.moodAvg > 60) {
    recs.push('Your mood has been low recently. Take a break or do something you enjoy.');
  }
  if (factors.hoursWorked > 70) {
    recs.push("You've been working long hours. Step away and rest.");
  }
  if (factors.daysSinceBreak > 70) {
    recs.push("It's been a while since your last break day. Consider taking one tomorrow.");
  }
  if (score >= 70) {
    recs.push('RECOVERY MODE: Consider forgiving low-commitment tasks and extending deadlines.');
    recs.push('Pause any active streaks to focus on wellbeing.');
  }
  if (recs.length === 0) {
    recs.push("You're doing well! Maintain your current balance.");
  }

  return recs;
}

/**
 * Calculate days since last break (a day with 0 hours worked or no log).
 */
export function calcDaysSinceBreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const sorted = [...logs].sort(
    (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  );

  let days = 0;
  for (const log of sorted) {
    if (log.hours_worked === 0) break;
    days++;
  }
  return days;
}

/**
 * Main burnout risk calculator.
 */
export function calculateBurnoutScore(
  activeTasks: Task[],
  recentLogs: DailyLog[], // last 3 days
  hoursToday: number,
  daysSinceBreak: number
): BurnoutScore {
  const factors = {
    taskLoad: calcTaskLoad(activeTasks.length),
    moodAvg: calcMoodFactor(recentLogs),
    hoursWorked: calcHoursFactor(hoursToday),
    daysSinceBreak: calcBreakFactor(daysSinceBreak),
  };

  const total = Math.round(
    factors.taskLoad * BURNOUT.TASK_WEIGHT +
    factors.moodAvg * BURNOUT.MOOD_WEIGHT +
    factors.hoursWorked * BURNOUT.HOURS_WEIGHT +
    factors.daysSinceBreak * BURNOUT.BREAK_WEIGHT
  );

  const clampedTotal = clamp(total, 0, 100);

  return {
    total: clampedTotal,
    status: getStatus(clampedTotal),
    factors,
    recommendations: getRecommendations(clampedTotal, factors),
  };
}
