import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    priority: 'high' | 'medium' | 'low';
    note?: string;
    duration?: number;
  }) => void;
  defaultDate?: string;
}

const priorities = [
  { value: 'high', label: '高', color: 'bg-rose-400', activeColor: 'ring-rose-400 bg-rose-50' },
  { value: 'medium', label: '中', color: 'bg-slateblue-400', activeColor: 'ring-slateblue-400 bg-slateblue-50/50' },
  { value: 'low', label: '低', color: 'bg-sage-400', activeColor: 'ring-sage-400 bg-sage-50/50' },
] as const;

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      priority,
      note: note.trim() || undefined,
      duration: duration ? parseInt(duration) : undefined,
    });
    setTitle('');
    setPriority('medium');
    setNote('');
    setDuration('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加每日任务">
      <div className="p-6 space-y-5">
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
                <Flag size={16} className={priority === p.value ? '' : 'opacity-50'} style={{ color: priority === p.value ? '' : undefined }} />
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
