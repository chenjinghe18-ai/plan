import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Trash2, Flag, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAppStore, getGoalProgress } from '@/store/useAppStore';
import { formatFullDisplayDate, getDaysDiff } from '@/utils/date';
import { cn } from '@/lib/utils';

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newMilestone, setNewMilestone] = useState('');
  const [newTask, setNewTask] = useState('');
  const [activeTab, setActiveTab] = useState<'milestones' | 'tasks'>('milestones');
  
  const {
    goals,
    milestones,
    goalTasks,
    toggleGoalStatus,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    addGoalTask,
    toggleGoalTask,
    deleteGoalTask,
  } = useAppStore();

  const goal = goals.find((g) => g.id === id);
  const goalMilestones = milestones
    .filter((m) => m.goalId === id)
    .sort((a, b) => a.order - b.order);
  const tasks = goalTasks
    .filter((t) => t.goalId === id)
    .sort((a, b) => a.order - b.order);

  if (!goal) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-brown-700/50">目标不存在</p>
      </div>
    );
  }

  const progress = getGoalProgress(goal.id);
  const daysLeft = getDaysDiff(goal.endDate, new Date().toISOString().split('T')[0]);

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;
    addMilestone({
      goalId: goal.id,
      title: newMilestone.trim(),
      order: goalMilestones.length,
    });
    setNewMilestone('');
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addGoalTask({
      goalId: goal.id,
      title: newTask.trim(),
      order: tasks.length,
    });
    setNewTask('');
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个目标吗？')) {
      deleteGoal(goal.id);
      navigate('/goals');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 animate-fade-in pb-28">
      <div className="sticky top-0 z-30 bg-cream-100/80 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-cream-200 transition-colors text-brown-700"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-rose-50 text-brown-700/50 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-3xl shadow-paper p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{goal.emoji}</div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-brown-900 font-serif mb-1">
                {goal.title}
              </h1>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                goal.status === 'active'
                  ? 'bg-amber-400/10 text-amber-600'
                  : goal.status === 'completed'
                  ? 'bg-sage-400/10 text-sage-600'
                  : 'bg-brown-700/10 text-brown-700'
              }`}>
                {goal.status === 'active' ? '进行中' : goal.status === 'completed' ? '已完成' : '已暂停'}
              </span>
            </div>
          </div>

          {goal.description && (
            <p className="text-brown-700/70 mb-4 leading-relaxed">{goal.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-brown-700/60 mb-5">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatFullDisplayDate(goal.startDate)}
            </span>
            <span className="text-brown-700/30">→</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatFullDisplayDate(goal.endDate)}
            </span>
          </div>

          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-brown-700/60">目标进度</span>
              <span className="font-semibold text-amber-500">{progress}%</span>
            </div>
            <ProgressBar progress={progress} height="lg" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-cream-100">
            <span className={`text-sm font-medium ${goal.status === 'completed' ? 'text-sage-500' : daysLeft < 0 ? 'text-rose-500' : 'text-amber-500'}`}>
              {goal.status === 'completed' ? '已达成目标' : daysLeft < 0 ? `已超期 ${Math.abs(daysLeft)} 天` : `剩余 ${daysLeft} 天`}
            </span>
            <Button
              variant={goal.status === 'completed' ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => toggleGoalStatus(goal.id)}
            >
              <Check size={16} />
              {goal.status === 'completed' ? '标记未完成' : '标记完成'}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('milestones')}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
              activeTab === 'milestones'
                ? 'bg-amber-400 text-white shadow-soft'
                : 'bg-white text-brown-700 hover:bg-cream-200'
            )}
          >
            <Flag size={16} />
            里程碑
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
              activeTab === 'tasks'
                ? 'bg-amber-400 text-white shadow-soft'
                : 'bg-white text-brown-700 hover:bg-cream-200'
            )}
          >
            <Target size={16} />
            子任务
          </button>
        </div>

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-paper p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="添加里程碑..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
                  className="flex-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 placeholder-brown-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                />
                <button
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.trim()}
                  className="px-4 py-3 rounded-xl bg-amber-400 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {goalMilestones.length === 0 ? (
              <div className="text-center py-10">
                <Flag size={32} className="mx-auto text-brown-700/20 mb-2" />
                <p className="text-brown-700/40 text-sm">还没有里程碑</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-cream-200" />
                <div className="space-y-3">
                  {goalMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="relative flex items-start gap-4 pl-1"
                    >
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className={cn(
                          'relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                          milestone.completed
                            ? 'bg-sage-400 border-sage-400 text-white'
                            : 'bg-white border-cream-300 hover:border-amber-400'
                        )}
                      >
                        {milestone.completed && <Check size={14} strokeWidth={3} />}
                      </button>
                      <div className="flex-1 bg-white rounded-xl p-3 shadow-paper">
                        <p className={cn(
                          'font-medium',
                          milestone.completed ? 'text-brown-700/50 line-through' : 'text-brown-800'
                        )}>
                          {milestone.title}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="p-2 text-brown-700/30 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-paper p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="添加子任务..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-brown-900 placeholder-brown-700/30 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.trim()}
                  className="px-4 py-3 rounded-xl bg-amber-400 text-white hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-10">
                <Target size={32} className="mx-auto text-brown-700/20 mb-2" />
                <p className="text-brown-700/40 text-sm">还没有子任务</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-paper"
                  >
                    <button
                      onClick={() => toggleGoalTask(task.id)}
                      className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                        task.completed
                          ? 'bg-sage-400 border-sage-400 text-white'
                          : 'border-cream-300 hover:border-amber-400'
                      )}
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <p className={cn(
                      'flex-1 font-medium',
                      task.completed ? 'text-brown-700/50 line-through' : 'text-brown-800'
                    )}>
                      {task.title}
                    </p>
                    <button
                      onClick={() => deleteGoalTask(task.id)}
                      className="p-2 text-brown-700/30 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
