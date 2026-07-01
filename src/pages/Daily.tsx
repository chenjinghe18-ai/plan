import { useState } from 'react';
import { Plus, ListChecks, Sparkles } from 'lucide-react';
import { DateNavigator } from '@/components/daily/DateNavigator';
import { TaskItem } from '@/components/daily/TaskItem';
import { AddTaskModal } from '@/components/daily/AddTaskModal';
import { useAppStore } from '@/store/useAppStore';
import { getToday, formatFullDisplayDate, getWeekDay } from '@/utils/date';
import { cn } from '@/lib/utils';

export default function DailyPage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { dailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask } = useAppStore();
  
  const dayTasks = dailyTasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  
  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (task: {
    title: string;
    priority: 'high' | 'medium' | 'low';
    note?: string;
    duration?: number;
  }) => {
    addDailyTask({
      ...task,
      date: selectedDate,
    });
  };

  const highPriorityTasks = dayTasks.filter((t) => t.priority === 'high' && !t.completed);
  const mediumPriorityTasks = dayTasks.filter((t) => t.priority === 'medium' && !t.completed);
  const lowPriorityTasks = dayTasks.filter((t) => t.priority === 'low' && !t.completed);
  const completedTasks = dayTasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-cream-100 animate-fade-in">
      <div className="px-4 pt-6 pb-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-brown-900 font-serif">每日计划</h1>
          <p className="text-brown-700/60 text-sm mt-1">
            {formatFullDisplayDate(selectedDate)} {getWeekDay(selectedDate)}
          </p>
        </div>

        <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-paper text-center">
            <p className="text-2xl font-bold text-amber-500 font-serif">{totalCount}</p>
            <p className="text-xs text-brown-700/60 mt-1">总任务</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-paper text-center">
            <p className="text-2xl font-bold text-sage-500 font-serif">{completedCount}</p>
            <p className="text-xs text-brown-700/60 mt-1">已完成</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-paper text-center">
            <p className="text-2xl font-bold text-amber-500 font-serif">{completionRate}%</p>
            <p className="text-xs text-brown-700/60 mt-1">完成率</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-28 space-y-6">
        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mb-4">
              <ListChecks size={36} className="text-brown-700/30" />
            </div>
            <p className="text-brown-700/50 text-center mb-1">今天还没有任务</p>
            <p className="text-brown-700/40 text-sm text-center">点击下方按钮添加你的第一个任务</p>
          </div>
        ) : (
          <>
            {highPriorityTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-sm font-medium text-rose-500">高优先级</span>
                </div>
                <div className="space-y-2">
                  {highPriorityTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleDailyTask}
                      onDelete={deleteDailyTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {mediumPriorityTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-slateblue-400" />
                  <span className="text-sm font-medium text-slateblue-500">中优先级</span>
                </div>
                <div className="space-y-2">
                  {mediumPriorityTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleDailyTask}
                      onDelete={deleteDailyTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {lowPriorityTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-sage-400" />
                  <span className="text-sm font-medium text-sage-500">低优先级</span>
                </div>
                <div className="space-y-2">
                  {lowPriorityTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleDailyTask}
                      onDelete={deleteDailyTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="text-sm font-medium text-brown-700/60">
                    已完成 ({completedTasks.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleDailyTask}
                      onDelete={deleteDailyTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 w-14 h-14 rounded-full bg-amber-400 text-white',
          'flex items-center justify-center shadow-soft-lg hover:bg-amber-500',
          'transition-all duration-300 hover:scale-110 active:scale-95 z-40'
        )}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
        defaultDate={selectedDate}
      />
    </div>
  );
}
