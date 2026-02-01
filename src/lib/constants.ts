// Burnout Engine Thresholds
export const BURNOUT = {
  TASK_THRESHOLD: 8,
  TASK_WEIGHT: 0.3,
  MOOD_WEIGHT: 0.3,
  HOURS_WEIGHT: 0.2,
  BREAK_WEIGHT: 0.2,
  GREEN_MAX: 39,
  YELLOW_MAX: 69,
  MAX_HEALTHY_HOURS: 8,
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

// Status Messages
export const STATUS_MESSAGES = {
  green: "You're in a healthy zone. Keep up the balanced work!",
  yellow: 'Caution: Your wellbeing indicators suggest rising strain. Consider easing up.',
  red: 'Recovery recommended. Your wellbeing is at risk. Consider forgiving some tasks.',
} as const;

// Mood Emojis
export const MOOD_EMOJIS = ['😫', '😟', '😐', '🙂', '😄'] as const;

// Energy Icons
export const ENERGY_LABELS = ['Empty', 'Low', 'Medium', 'High', 'Full'] as const;

// Forgive Messages
export const FORGIVE_MESSAGES = [
  "It's okay to let go. This shows wisdom, not weakness.",
  'Forgiving a task protects your wellbeing. That takes courage.',
  'You are choosing sustainability over burnout. Well done.',
  "Releasing this commitment is an act of self-care.",
  'Your health matters more than any task. This is the right call.',
] as const;
