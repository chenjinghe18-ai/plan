import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Flag, Bell, Repeat, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WeekDay } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    priority: 'high' | 'medium' | 'low';
    note?: string;
    duration?: number;
    repeatDays?: WeekDay[];
    reminderTime?: string;
  }) => void;
  defaultDate?: string;
}

const priorities = [
  { value: 'high', label: '高', color: 'bg-rose-400', activeColor: 'ring-rose-400 bg-rose-50' },
  { value: 'medium', label: '中', color: 'bg-slateblue-400', activeColor: 'ring-slateblue-400 bg-slateblue-50/50' },
  { value: 'low', label: '低', color: 'bg-sage-400', activeColor: 'ring-sage-400 bg-sage-50/50' },
] as const;

const weekDays: { value: WeekDay; label: string }[] = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('');
  const [repeatDays, setRepeatDays] = useState<WeekDay[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');

  const toggleRepeatDay = (day: WeekDay) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleAllRepeatDays = () => {
    if (repeatDays.length === 7) {
      setRepeatDays([]);
    } else {
      setRepeatDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      priority,
      note: note.trim() || undefined,
      duration: duration ? parseInt(duration) : undefined,
      repeatDays: repeatDays.length > 0 ? repeatDays : undefined,
      reminderTime: reminderEnabled ? reminderTime : undefined,
    });
    setTitle('');
    setPriority('medium');
    setNote('');
    setDuration('');
    setRepeatDays([]);
    setReminderEnabled(false);
    setReminderTime('09:00');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加每日任务">
      <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
        <Input
          label="任务标题"
          placeholder="输入任务内容..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        
        <div>
          <label className="text-sm font-medium text-brown-700 mb-2 block">
            优先级
          </label>
          <div className="flex gap-3">
            {priorities.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all duration-200',
                  priority === p.value
                    ? p.activeColor + ' border-transparent ring-2'
                    : 'border-cream-200 hover:border-cream-300'
                )}
              >
                <Flag size={16} className={priority === p.value ? '' : 'opacity-50'} />
                <span className={cn(
                  'font-medium',
                  priority === p.value ? 'text-brown-800' : 'text-brown-700/60'
                )}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <Input
          label="预计时长（分钟）"
          type="number"
          placeholder="可选"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-brown-700 flex items-center gap-2">
              <Repeat size={16} />
              重复周期
            </label>
            <button
              onClick={toggleAllRepeatDays}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              {repeatDays.length === 7 ? '取消全选' : '全选'}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleRepeatDay(day.value)}
                className={cn(
                  'py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  repeatDays.includes(day.value)
                    ? 'bg-amber-400 text-white'
                    : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-cream-300 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-sm font-medium text-brown-700 flex items-center gap-2">
              <Bell size={16} />
              设置提醒
            </span>
          </label>
          
          {reminderEnabled && (
            <div className="flex items-center gap-3 bg-cream-50 p-3 rounded-xl">
              <Clock size={18} className="text-amber-500" />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="flex-1 bg-white border border-cream-200 rounded-lg px-3 py-2 text-brown-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}
        </div>
        
        <Textarea
          label="备注"
          placeholder="添加备注信息..."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            添加
          </Button>
        </div>
      </div>
    </Modal>
  );
}
