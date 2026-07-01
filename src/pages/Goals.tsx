import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard';
import { AddGoalModal } from '@/components/goals/AddGoalModal';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

type FilterType = 'active' | 'completed' | 'all';

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('active');
  
  const { goals, addGoal } = useAppStore();
  
  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filters: { value: FilterType; label: string }[] = [
    { value: 'active', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'all', label: '全部' },
  ];

  return (
    <div className="min-h-screen bg-cream-100 animate-fade-in">
      <div className="px-4 pt-6 pb-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-brown-900 font-serif">阶段计划</h1>
          <p className="text-brown-700/60 text-sm mt-1">设定目标，步步为营</p>
        </div>

        <div className="flex gap-2 mb-5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                filter === f.value
                  ? 'bg-amber-400 text-white shadow-soft'
                  : 'bg-white text-brown-700 hover:bg-cream-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-28 space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mb-4">
              <Target size={36} className="text-brown-700/30" />
            </div>
            <p className="text-brown-700/50 text-center mb-1">
              {filter === 'active' ? '还没有进行中的目标' : filter === 'completed' ? '还没有已完成的目标' : '还没有任何目标'}
            </p>
            <p className="text-brown-700/40 text-sm text-center">点击下方按钮创建你的第一个目标</p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
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

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(goal) => addGoal(goal)}
      />
    </div>
  );
}
