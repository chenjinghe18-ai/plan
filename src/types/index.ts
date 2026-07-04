export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DailyTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  date: string;
  note?: string;
  duration?: number;
  repeatDays?: WeekDay[];
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  emoji: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetDate?: string;
  completed: boolean;
  order: number;
}

export interface GoalTask {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  date?: string;
  order: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  startOfWeek: 'monday' | 'sunday';
}

export interface AppState {
  dailyTasks: DailyTask[];
  goals: Goal[];
  milestones: Milestone[];
  goalTasks: GoalTask[];
  settings: AppSettings;
}
