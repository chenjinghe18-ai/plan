export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDisplayDate = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

export const formatFullDisplayDate = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

export const getWeekDay = (dateStr: string): string => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = parseDate(dateStr);
  return days[date.getDay()];
};

export const getWeekDayShort = (dateStr: string): string => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const date = parseDate(dateStr);
  return days[date.getDay()];
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const addDays = (dateStr: string, days: number): string => {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === getToday();
};

export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

export const isBefore = (date1: string, date2: string): boolean => {
  return parseDate(date1) < parseDate(date2);
};

export const isAfter = (date1: string, date2: string): boolean => {
  return parseDate(date1) > parseDate(date2);
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number, startOfWeek: 'monday' | 'sunday' = 'monday'): number => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  if (startOfWeek === 'monday') {
    return firstDay === 0 ? 6 : firstDay - 1;
  }
  return firstDay;
};

export const getWeekDates = (dateStr: string, startOfWeek: 'monday' | 'sunday' = 'monday'): string[] => {
  const date = parseDate(dateStr);
  const day = date.getDay();
  const diff = startOfWeek === 'monday' 
    ? (day === 0 ? -6 : 1 - day)
    : -day;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
};

export const getDaysDiff = (date1: string, date2: string): number => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
