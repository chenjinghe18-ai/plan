import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate, getWeekDates, isToday, getWeekDayShort } from '@/utils/date';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DateNavigatorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const today = new Date();
  const weekStartDate = new Date(today);
  weekStartDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(formatDate(weekStartDate));

  const handlePrevWeek = () => setWeekOffset((w) => w - 1);
  const handleNextWeek = () => setWeekOffset((w) => w + 1);
  const handleToday = () => {
    setWeekOffset(0);
    onDateChange(formatDate(new Date()));
  };

  const monthYear = `${new Date(weekDates[0]).getFullYear()}年${new Date(weekDates[0]).getMonth() + 1}月`;

  return (
    <div className="bg-white rounded-2xl shadow-paper p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          className="p-2 rounded-full hover:bg-cream-100 transition-colors text-brown-700"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-brown-800 font-semibold font-serif">{monthYear}</span>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-xs rounded-full bg-amber-400/10 text-amber-500 font-medium hover:bg-amber-400/20 transition-colors"
          >
            今天
          </button>
        </div>
        <button
          onClick={handleNextWeek}
          className="p-2 rounded-full hover:bg-cream-100 transition-colors text-brown-700"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const isSelected = date === selectedDate;
          const isTodayDate = isToday(date);
          const dayNum = new Date(date).getDate();
          const weekDay = getWeekDayShort(date);
          
          return (
            <button
              key={date}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200',
                isSelected
                  ? 'bg-amber-400 text-white shadow-soft scale-105'
                  : 'hover:bg-cream-100 text-brown-700'
              )}
            >
              <span className={cn('text-xs', isSelected ? 'text-white/80' : 'text-brown-700/50')}>
                {weekDay}
              </span>
              <span className={cn('text-base font-semibold', isTodayDate && !isSelected && 'text-amber-500')}>
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };
