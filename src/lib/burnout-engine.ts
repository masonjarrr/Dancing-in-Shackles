import { BURNOUT, BILLING } from './constants';
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
 * 8 hours (billing target) = 0 burnout risk — that's the goal.
 * Only ramp up from hours above 8, hitting 100% at BURNOUT_HOURS_THRESHOLD (11).
 */
function calcHoursFactor(hoursToday: number): number {
  if (hoursToday <= BILLING.TARGET_HOURS) return 0;
  const overHours = hoursToday - BILLING.TARGET_HOURS;
  const maxOver = BURNOUT.MAX_HEALTHY_HOURS - BILLING.TARGET_HOURS; // 11 - 8 = 3
  return clamp((overHours / maxOver) * 100, 0, 100);
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
    recs.push('Heavy caseload detected. Consider deprioritizing low-value matters or delegating to paralegals.');
  }
  if (factors.moodAvg > 60) {
    recs.push('Your mood has been trending low. Step away from the desk — even 15 minutes helps reset.');
  }
  if (factors.hoursWorked > 70) {
    recs.push('Extended hours increase error risk. Wrap up and protect your capacity for tomorrow.');
  }
  if (factors.daysSinceBreak > 70) {
    recs.push('No days off in a while. Schedule a recovery day to avoid diminishing returns.');
  }
  if (score >= 70) {
    recs.push('RECOVERY MODE: Sustained overwork creates malpractice exposure. Triage your docket aggressively.');
    recs.push('Consider blocking a half-day for recovery before taking on new matters.');
  }
  if (recs.length === 0) {
    recs.push("You're in a sustainable rhythm. Keep billing at this pace.");
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
