import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyTask, Goal, Milestone, GoalTask, AppSettings } from '@/types';
import { generateId, getToday } from '@/utils/date';

interface AppState {
  dailyTasks: DailyTask[];
  goals: Goal[];
  milestones: Milestone[];
  goalTasks: GoalTask[];
  settings: AppSettings;
  
  addDailyTask: (task: Omit<DailyTask, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  toggleDailyTask: (id: string) => void;
  deleteDailyTask: (id: string) => void;
  updateDailyTask: (id: string, updates: Partial<DailyTask>) => void;
  
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalStatus: (id: string) => void;
  
  addMilestone: (milestone: Omit<Milestone, 'id' | 'completed'>) => void;
  toggleMilestone: (id: string) => void;
  deleteMilestone: (id: string) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  
  addGoalTask: (task: Omit<GoalTask, 'id' | 'completed'>) => void;
  toggleGoalTask: (id: string) => void;
  deleteGoalTask: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      dailyTasks: [],
      goals: [],
      milestones: [],
      goalTasks: [],
      settings: {
        theme: 'light',
        startOfWeek: 'monday',
      },

      addDailyTask: (task) =>
        set((state) => ({
          dailyTasks: [
            ...state.dailyTasks,
            {
              ...task,
              id: generateId(),
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      toggleDailyTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      deleteDailyTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.filter((task) => task.id !== id),
        })),

      updateDailyTask: (id, updates) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: generateId(),
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
              : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          milestones: state.milestones.filter((m) => m.goalId !== id),
          goalTasks: state.goalTasks.filter((t) => t.goalId !== id),
        })),

      toggleGoalStatus: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  status: goal.status === 'active' ? 'completed' : 'active',
                  updatedAt: new Date().toISOString(),
                }
              : goal
          ),
        })),

      addMilestone: (milestone) =>
        set((state) => ({
          milestones: [
            ...state.milestones,
            {
              ...milestone,
              id: generateId(),
              completed: false,
            },
          ],
        })),

      toggleMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, completed: !m.completed } : m
          ),
        })),

      deleteMilestone: (id) =>
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        })),

      updateMilestone: (id, updates) =>
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      addGoalTask: (task) =>
        set((state) => ({
          goalTasks: [
            ...state.goalTasks,
            {
              ...task,
              id: generateId(),
              completed: false,
            },
          ],
        })),

      toggleGoalTask: (id) =>
        set((state) => ({
          goalTasks: state.goalTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),

      deleteGoalTask: (id) =>
        set((state) => ({
          goalTasks: state.goalTasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: 'planner-app-storage',
    }
  )
);

export const getDailyTasksByDate = (date: string) => {
  return useAppStore.getState().dailyTasks.filter((task) => task.date === date);
};

export const getGoalProgress = (goalId: string): number => {
  const state = useAppStore.getState();
  const goalMilestones = state.milestones.filter((m) => m.goalId === goalId);
  const goalTasks = state.goalTasks.filter((t) => t.goalId === goalId);
  
  const totalItems = goalMilestones.length + goalTasks.length;
  if (totalItems === 0) return 0;
  
  const completedMilestones = goalMilestones.filter((m) => m.completed).length;
  const completedTasks = goalTasks.filter((t) => t.completed).length;
  
  return Math.round(((completedMilestones + completedTasks) / totalItems) * 100);
};

export const getTodayStats = () => {
  const today = getToday();
  const tasks = useAppStore.getState().dailyTasks.filter((t) => t.date === today);
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, rate };
};
