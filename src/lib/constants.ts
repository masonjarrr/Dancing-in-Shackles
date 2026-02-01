import type { TaskCategory } from '@/types/database';

// Billing Configuration
export const BILLING = {
  TARGET_HOURS: 8,
  OVERTIME_WARNING: 10,
  BURNOUT_HOURS_THRESHOLD: 11,
} as const;

// Burnout Engine Thresholds
export const BURNOUT = {
  TASK_THRESHOLD: 8,
  TASK_WEIGHT: 0.3,
  MOOD_WEIGHT: 0.3,
  HOURS_WEIGHT: 0.2,
  BREAK_WEIGHT: 0.2,
  GREEN_MAX: 39,
  YELLOW_MAX: 69,
  MAX_HEALTHY_HOURS: 11,
  MAX_DAYS_WITHOUT_BREAK: 7,
} as const;

// Workload Meter
export const WORKLOAD = {
  GREEN_MAX: 5,
  YELLOW_MAX: 8,
  RED_THRESHOLD: 12,
} as const;

// Scoring
export const TASK_POINTS: Record<string, number> = {
  high: 5,
  medium: 3,
  low: 1,
};

// "Dancing in Shackles" Detection
export const SHACKLES = {
  PERFORMANCE_THRESHOLD: 80,
  WELLBEING_THRESHOLD: 50,
} as const;

// Streak Protection
export const STREAK = {
  RECOVERY_SUGGESTION_DAYS: 14,
} as const;

// Wellbeing Alert Penalty
export const WELLBEING_ALERT_PENALTY = 5;

// Legal Task Categories
export const LEGAL_CATEGORIES: Record<TaskCategory, { label: string; color: string }> = {
  case_review: { label: 'Case Review', color: 'bg-blue-500/20 text-blue-400' },
  drafting: { label: 'Drafting', color: 'bg-violet-500/20 text-violet-400' },
  depositions: { label: 'Depositions', color: 'bg-orange-500/20 text-orange-400' },
  discovery: { label: 'Discovery', color: 'bg-cyan-500/20 text-cyan-400' },
  research: { label: 'Research', color: 'bg-indigo-500/20 text-indigo-400' },
  client_communication: { label: 'Client Comms', color: 'bg-pink-500/20 text-pink-400' },
  court_appearances: { label: 'Court', color: 'bg-red-500/20 text-red-400' },
  administrative: { label: 'Admin', color: 'bg-gray-500/20 text-gray-400' },
  other: { label: 'Other', color: 'bg-slate-500/20 text-slate-400' },
};

// Status Messages (attorney context)
export const STATUS_MESSAGES = {
  green: "Solid billing pace. You're on track — keep the momentum going.",
  yellow: 'Watch your load. Sustained overwork leads to errors and missed deadlines.',
  red: 'Recovery needed. Exhaustion creates malpractice risk. Delegate or deprioritize now.',
} as const;

// Mood Emojis
export const MOOD_EMOJIS = ['😫', '😟', '😐', '🙂', '😄'] as const;

// Energy Icons
export const ENERGY_LABELS = ['Empty', 'Low', 'Medium', 'High', 'Full'] as const;

// Forgive Messages (legal strategic triage language)
export const FORGIVE_MESSAGES = [
  'Strategic triage — dropping low-value work protects your capacity for what matters.',
  'Good attorneys know when to cut losses. This is sound case management.',
  'Deprioritizing this frees bandwidth for higher-value billable work.',
  'Not every task deserves your time. This is resource allocation, not failure.',
  'Letting this go is a judgment call. Trust your instincts, counsel.',
] as const;

// Billing Milestone Messages
export const BILLING_MILESTONES: Record<number, string> = {
  0: "New day, clean slate. Let's get billing.",
  2: '2 hours down. Building momentum.',
  4: 'Halfway to target. Keep pushing.',
  6: '6 hours billed. The finish line is in sight.',
  7: 'Almost there — one more hour hits your daily target.',
  8: 'Target hit. 8 billable hours logged. Well done.',
  9: 'Over target. Make sure the extra hours are worth it.',
  10: 'Heavy day. Wrap up and protect tomorrow.',
};
