export interface DailyTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  date: string;
  note?: string;
  duration?: number;
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
