import { Check, Trash2, Flag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DailyTask } from '@/types';

interface TaskItemProps {
  task: DailyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: { color: 'bg-rose-400', label: '高', textColor: 'text-rose-500' },
  medium: { color: 'bg-slateblue-400', label: '中', textColor: 'text-slateblue-500' },
  low: { color: 'bg-sage-400', label: '低', textColor: 'text-sage-500' },
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priority = priorityConfig[task.priority];
  
  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-4 bg-white rounded-2xl shadow-paper transition-all duration-300',
        task.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
          task.completed
            ? 'bg-sage-400 border-sage-400 text-white'
            : 'border-cream-300 hover:border-amber-400'
        )}
      >
        {task.completed && <Check size={14} strokeWidth={3} className="animate-bounce-soft" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            'text-brown-800 font-medium truncate',
            task.completed && 'line-through text-brown-700/50'
          )}>
            {task.title}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <span className={cn('flex items-center gap-1', priority.textColor)}>
            <Flag size={12} fill="currentColor" />
            {priority.label}优先级
          </span>
          {task.duration && (
            <span className="flex items-center gap-1 text-brown-700/50">
              <Clock size={12} />
              {task.duration}分钟
            </span>
          )}
        </div>
        {task.note && (
          <p className="text-sm text-brown-700/60 mt-1 truncate">{task.note}</p>
        )}
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 rounded-full text-brown-700/30 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
