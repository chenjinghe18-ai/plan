import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getGoalProgress } from '@/store/useAppStore';
import { formatDisplayDate, getDaysDiff } from '@/utils/date';
import type { Goal } from '@/types';
import { useNavigate } from 'react-router-dom';

interface GoalCardProps {
  goal: Goal;
}

const statusConfig = {
  active: { label: '进行中', color: 'bg-amber-400/10 text-amber-600' },
  completed: { label: '已完成', color: 'bg-sage-400/10 text-sage-600' },
  paused: { label: '已暂停', color: 'bg-brown-700/10 text-brown-700' },
};

export function GoalCard({ goal }: GoalCardProps) {
  const navigate = useNavigate();
  const progress = getGoalProgress(goal.id);
  const status = statusConfig[goal.status];
  const daysLeft = getDaysDiff(goal.endDate, new Date().toISOString().split('T')[0]);
  
  return (
    <Card
      hoverable
      className="overflow-hidden"
      onClick={() => navigate(`/goals/${goal.id}`)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{goal.emoji}</div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-brown-800 font-serif mb-2 line-clamp-2">
          {goal.title}
        </h3>
        
        {goal.description && (
          <p className="text-sm text-brown-700/60 mb-4 line-clamp-2">
            {goal.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-brown-700/60">
            <span>进度</span>
            <span className="font-medium text-brown-700">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
          <span className="text-xs text-brown-700/50">
            {formatDisplayDate(goal.startDate)} - {formatDisplayDate(goal.endDate)}
          </span>
          <span className={`text-xs font-medium ${goal.status === 'completed' ? 'text-sage-500' : daysLeft < 0 ? 'text-rose-500' : 'text-amber-500'}`}>
            {goal.status === 'completed' ? '已达成' : daysLeft < 0 ? `已超期${Math.abs(daysLeft)}天` : `剩余${daysLeft}天`}
          </span>
        </div>
      </div>
    </Card>
  );
}
