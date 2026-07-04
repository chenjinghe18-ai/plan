import { useAppStore } from '@/store/useAppStore';
import { getToday, addDays, parseDate } from '@/utils/date';

let reminderInterval: number | null = null;
let notificationPermissionGranted = false;

export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    notificationPermissionGranted = permission === 'granted';
    return notificationPermissionGranted;
  }
  return false;
};

export const showNotification = (title: string, body: string, tag?: string): void => {
  if (!notificationPermissionGranted || !('Notification' in window)) {
    alert(`${title}\n${body}`);
    return;
  }

  new Notification(title, {
    body,
    tag,
    icon: '/icon-192.png',
  });
};

export const checkDailyTaskReminders = (): void => {
  const state = useAppStore.getState();
  const today = getToday();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  state.dailyTasks.forEach(task => {
    if (task.date === today && task.reminderTime && !task.completed) {
      if (task.reminderTime === currentTime) {
        showNotification(
          `任务提醒: ${task.title}`,
          `该任务计划在 ${task.reminderTime} 开始`,
          `task-${task.id}`
        );
      }
    }
  });
};

export const checkGoalReminders = (): void => {
  const state = useAppStore.getState();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  state.goals.forEach(goal => {
    if (goal.reminderEnabled && goal.status === 'active') {
      const reminderDate = addDays(goal.endDate, -goal.reminderDaysBefore);
      const today = getToday();
      
      if (reminderDate === today && goal.reminderTime === currentTime) {
        const daysLeft = goal.reminderDaysBefore;
        showNotification(
          `目标提醒: ${goal.emoji} ${goal.title}`,
          `距离目标截止还有 ${daysLeft} 天，请抓紧完成！`,
          `goal-${goal.id}`
        );
      }
    }
  });
};

export const startReminderService = (): void => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
  }

  requestNotificationPermission();

  checkDailyTaskReminders();
  checkGoalReminders();

  reminderInterval = window.setInterval(() => {
    checkDailyTaskReminders();
    checkGoalReminders();
  }, 60000);
};

export const stopReminderService = (): void => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
  }
};

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

export const getNotificationPermissionStatus = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};
