import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Target, Sparkles, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAppStore, getGoalProgress } from '@/store/useAppStore';
import { getToday, formatFullDisplayDate, getWeekDay, addDays } from '@/utils/date';
import { useState } from 'react';
import { AddTaskModal } from '@/components/daily/AddTaskModal';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const { dailyTasks, goals, addDailyTask } = useAppStore();
  
  const today = getToday();
  const todayTasks = dailyTasks.filter((t) => t.date === today);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const activeGoals = goals.filter((g) => g.status === 'active');
  
  const upcomingTasks = dailyTasks
    .filter((t) => !t.completed && t.date >= today && t.date <= addDays(today, 7))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const highPriorityToday = todayTasks.filter((t) => t.priority === 'high' && !t.completed);

  return (
    <div className="min-h-screen bg-cream-100 animate-fade-in pb-28">
      <div className="px-4 pt-8 pb-6">
        <div className="mb-6">
          <p className="text-brown-700/50 text-sm">{formatFullDisplayDate(today)} {getWeekDay(today)}</p>
          <h1 className="text-3xl font-bold text-brown-900 font-serif mt-1">
            你好，今天也要加油 ✨
          </h1>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 text-white shadow-soft-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">今日完成率</p>
              <p className="text-4xl font-bold font-serif">{completionRate}%</p>
              <p className="text-white/70 text-sm mt-2">
                已完成 {completedToday} / {totalToday} 项任务
              </p>
            </div>
            <ProgressRing
              progress={completionRate}
              size={100}
              strokeWidth={7}
              color="white"
              bgColor="rgba(255,255,255,0.2)"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/daily')}
            className="bg-white rounded-2xl p-4 shadow-paper text-left hover:shadow-soft-lg transition-all hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center mb-3">
              <Calendar className="text-amber-500" size={22} />
            </div>
            <p className="text-brown-800 font-semibold">每日计划</p>
            <p className="text-brown-700/50 text-xs mt-1">{totalToday} 项待办</p>
          </button>
          <button
            onClick={() => navigate('/goals')}
            className="bg-white rounded-2xl p-4 shadow-paper text-left hover:shadow-soft-lg transition-all hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-sage-400/10 flex items-center justify-center mb-3">
              <Target className="text-sage-500" size={22} />
            </div>
            <p className="text-brown-800 font-semibold">阶段目标</p>
            <p className="text-brown-700/50 text-xs mt-1">{activeGoals.length} 个进行中</p>
          </button>
        </div>

        {highPriorityToday.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-rose-500" />
              <h2 className="text-lg font-semibold text-brown-800 font-serif">今日重要</h2>
            </div>
            <div className="space-y-2">
              {highPriorityToday.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 shadow-paper flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                  <p className="text-brown-800 font-medium flex-1 truncate">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeGoals.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-sage-500" />
                <h2 className="text-lg font-semibold text-brown-800 font-serif">进行中的目标</h2>
              </div>
              <button
                onClick={() => navigate('/goals')}
                className="text-sm text-amber-500 font-medium"
              >
                查看全部
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {activeGoals.slice(0, 5).map((goal) => {
                const progress = getGoalProgress(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => navigate(`/goals/${goal.id}`)}
                    className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-paper text-left hover:shadow-soft-lg transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-2xl mb-2">{goal.emoji}</div>
                    <p className="text-brown-800 font-semibold text-sm mb-2 line-clamp-1">
                      {goal.title}
                    </p>
                    <ProgressBar progress={progress} />
                    <p className="text-xs text-brown-700/50 mt-2 text-right">{progress}%</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-slateblue-500" />
              <h2 className="text-lg font-semibold text-brown-800 font-serif">即将到来</h2>
            </div>
            <Card>
              <Card.Content className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className={cn(
                        'flex-shrink-0',
                        task.completed ? 'text-sage-400' : 'text-brown-700/20'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm truncate',
                        task.completed ? 'text-brown-700/50 line-through' : 'text-brown-800'
                      )}>
                        {task.title}
                      </p>
                    </div>
                    <span className="text-xs text-brown-700/50 flex-shrink-0">
                      {task.date === today ? '今天' : getWeekDay(task.date)}
                    </span>
                  </div>
                ))}
              </Card.Content>
            </Card>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsTaskModalOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 w-14 h-14 rounded-full bg-amber-400 text-white',
          'flex items-center justify-center shadow-soft-lg hover:bg-amber-500',
          'transition-all duration-300 hover:scale-110 active:scale-95 z-40'
        )}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAdd={(task) => addDailyTask({ ...task, date: today })}
        defaultDate={today}
      />
    </div>
  );
}
