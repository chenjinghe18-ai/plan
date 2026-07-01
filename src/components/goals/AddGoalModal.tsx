import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
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
  }) => void;
}

export function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(addDays(getToday(), 30));
  const [emoji, setEmoji] = useState('🎯');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      emoji,
    });
    setTitle('');
    setDescription('');
    setStartDate(getToday());
    setEndDate(addDays(getToday(), 30));
    setEmoji('🎯');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建阶段目标">
      <div className="p-6 space-y-5">
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
