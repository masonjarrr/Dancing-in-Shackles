export type CommitmentLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'active' | 'completed' | 'forgiven' | 'abandoned';
export type AlertType = 'overload' | 'exhaustion' | 'streak_pressure' | 'low_mood' | 'dancing_in_shackles';
export type AlertSeverity = 'yellow' | 'red';
export type StatusColor = 'green' | 'yellow' | 'red';
export type TaskCategory =
  | 'case_review'
  | 'drafting'
  | 'depositions'
  | 'discovery'
  | 'research'
  | 'client_communication'
  | 'court_appearances'
  | 'administrative'
  | 'other';

export interface Task {
  id: string;
  title: string;
  commitment_level: CommitmentLevel;
  status: TaskStatus;
  category: TaskCategory;
  due_date: string | null;
  streak_count: number;
  recurring: boolean;
  created_at: string;
  updated_at: string;
  forgive_reason?: string | null;
}

export interface DailyLog {
  id: string;
  log_date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  hours_worked: number;
  tasks_completed: number;
  tasks_forgiven: number;
  notes: string | null;
  created_at: string;
}

export interface AccountabilityReview {
  id: string;
  review_date: string;
  performance_score: number; // 1-10
  wellbeing_score: number; // 1-10
  commitments_kept: number;
  commitments_total: number;
  reflection: string | null;
  improvement: string | null;
  recovery_needed: boolean;
  created_at: string;
}

export interface WellbeingAlert {
  id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

export interface BurnoutScore {
  total: number;
  status: StatusColor;
  factors: {
    taskLoad: number;
    moodAvg: number;
    hoursWorked: number;
    daysSinceBreak: number;
  };
  recommendations: string[];
}

export interface PerformanceScore {
  score: number;
  tasksCompleted: number;
  pointsEarned: number;
  pointsPossible: number;
  billingHours: number;
  billingTarget: number;
  billingMet: boolean;
}

export interface WellbeingScore {
  score: number;
  avgMood: number;
  avgEnergy: number;
  unacknowledgedAlerts: number;
}
