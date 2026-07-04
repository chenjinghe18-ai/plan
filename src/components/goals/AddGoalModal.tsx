import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToday, addDays } from '@/utils/date';

const emojiOptions = ['🎯', '📚', '💪', '🏃', '💼', '🎨', '✈️', '💰', '🌟', '📝', '🎵', '🏠'];

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    emoji: string;
    reminderEnabled: boolean;
    reminderDaysBefore: number;
    reminderTime: string;
  }) => void;
}

export function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(addDays(getToday(), 30));
  const [emoji, setEmoji] = useState('🎯');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(5);
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      emoji,
      reminderEnabled,
      reminderDaysBefore,
      reminderTime,
    });
    setTitle('');
    setDescription('');
    setStartDate(getToday());
    setEndDate(addDays(getToday(), 30));
    setEmoji('🎯');
    setReminderEnabled(true);
    setReminderDaysBefore(5);
    setReminderTime('09:00');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建阶段目标">
      <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
        <div>
          <label className="text-sm font-medium text-brown-700 mb-2 block">
            选择图标
          </label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200 ${
                  emoji === e
                    ? 'bg-amber-400/20 ring-2 ring-amber-400 scale-110'
                    : 'bg-cream-100 hover:bg-cream-200'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="目标名称"
          placeholder="输入目标名称..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <Textarea
          label="目标描述"
          placeholder="描述一下这个目标..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="开始日期"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="截止日期"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
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
              启用截止提醒
            </span>
          </label>
          
          {reminderEnabled && (
            <div className="space-y-3 bg-cream-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600 flex items-center gap-2">
                  <Clock size={16} className="text-amber-500" />
                  提醒时间
                </span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-white border border-cream-200 rounded-lg px-3 py-2 text-brown-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">提前提醒天数</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReminderDaysBefore(Math.max(1, reminderDaysBefore - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-cream-200 flex items-center justify-center text-brown-700 hover:bg-cream-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium text-brown-800">
                    {reminderDaysBefore}天
                  </span>
                  <button
                    onClick={() => setReminderDaysBefore(Math.min(30, reminderDaysBefore + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-cream-200 flex items-center justify-center text-brown-700 hover:bg-cream-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-brown-500 text-center mt-2">
                将在截止日期前 {reminderDaysBefore} 天的 {reminderTime} 提醒您
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            创建
          </Button>
        </div>
      </div>
    </Modal>
  );
}
