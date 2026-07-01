import { useMemo, useState } from 'react';
import { BarChart3, Trophy, Flame, Calendar, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAppStore, getGoalProgress } from '@/store/useAppStore';
import { formatDate, addDays, getToday, getWeekDayShort } from '@/utils/date';
import { cn } from '@/lib/utils';

export default function StatsPage() {
  const { dailyTasks, goals } = useAppStore();
  const [range, setRange] = useState<'7' | '30'>('7');

  const stats = useMemo(() => {
    const days = parseInt(range);
    const today = getToday();
    const dateMap = new Map<string, { total: number; completed: number }>();

    for (let i = days - 1; i >= 0; i--) {
      const date = addDays(today, -i);
      dateMap.set(date, { total: 0, completed: 0 });
    }

    dailyTasks.forEach((task) => {
      if (dateMap.has(task.date)) {
        const data = dateMap.get(task.date)!;
        data.total++;
        if (task.completed) data.completed++;
      }
    });

    const dailyData = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      ...data,
      rate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));

    const totalTasks = dailyData.reduce((sum, d) => sum + d.total, 0);
    const totalCompleted = dailyData.reduce((sum, d) => sum + d.completed, 0);
    const avgRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    let streak = 0;
    for (let i = 0; i < days; i++) {
      const date = addDays(today, -i);
      const dayTasks = dailyTasks.filter((t) => t.date === date);
      const completedCount = dayTasks.filter((t) => t.completed).length;
      if (completedCount > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const activeGoals = goals.filter((g) => g.status === 'active');
    const completedGoals = goals.filter((g) => g.status === 'completed');
    const goalCompletionRate = goals.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

    const maxRate = Math.max(...dailyData.map((d) => d.rate), 1);

    return {
      dailyData,
      totalTasks,
      totalCompleted,
      avgRate,
      streak,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      goalCompletionRate,
      maxRate,
    };
  }, [dailyTasks, goals, range]);

  const heatmapData = useMemo(() => {
    const weeks = 12;
    const today = getToday();
    const data: { date: string; count: number; week: number; day: number }[] = [];

    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < 7; d++) {
        const date = addDays(today, -(w * 7 + (6 - d)));
        const dayTasks = dailyTasks.filter((t) => t.date === date && t.completed);
        data.push({
          date,
          count: dayTasks.length,
          week: weeks - 1 - w,
          day: d,
        });
      }
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    return { data, maxCount };
  }, [dailyTasks]);

  const getHeatmapColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-cream-200';
    const ratio = count / maxCount;
    if (ratio < 0.25) return 'bg-amber-400/30';
    if (ratio < 0.5) return 'bg-amber-400/50';
    if (ratio < 0.75) return 'bg-amber-400/70';
    return 'bg-amber-500';
  };

  return (
    <div className="min-h-screen bg-cream-100 animate-fade-in pb-28">
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brown-900 font-serif">数据统计</h1>
          <p className="text-brown-700/60 text-sm mt-1">记录每一步成长</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-amber-400 to-amber-500 text-white border-0">
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} />
                <span className="text-sm opacity-80">连续完成</span>
              </div>
              <p className="text-3xl font-bold font-serif">{stats.streak}<span className="text-base font-normal ml-1">天</span></p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-amber-500" />
                <span className="text-sm text-brown-700/60">平均完成率</span>
              </div>
              <p className="text-3xl font-bold text-brown-800 font-serif">{stats.avgRate}<span className="text-base font-normal ml-1 text-brown-700/50">%</span></p>
            </Card.Content>
          </Card>
        </div>

        <Card className="mb-6">
          <Card.Header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-sage-500" />
              <h2 className="font-semibold text-brown-800">完成趋势</h2>
            </div>
            <div className="flex gap-1 bg-cream-100 rounded-full p-1">
              {(['7', '30'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all',
                    range === r
                      ? 'bg-white text-brown-800 shadow-soft'
                      : 'text-brown-700/60'
                  )}
                >
                  {r}天
                </button>
              ))}
            </div>
          </Card.Header>
          <Card.Content>
            <div className="h-40 flex items-end gap-1">
              {stats.dailyData.map((day, i) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(day.rate / stats.maxRate) * 100}%`,
                      minHeight: day.rate > 0 ? '4px' : '0',
                    }}
                  />
                  {i % Math.ceil(stats.dailyData.length / 7) === 0 && (
                    <span className="text-[10px] text-brown-700/40">
                      {getWeekDayShort(day.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-brown-700/50">
              <span>共 {stats.totalTasks} 个任务</span>
              <span>完成 {stats.totalCompleted} 个</span>
            </div>
          </Card.Content>
        </Card>

        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-amber-500" />
              <h2 className="font-semibold text-brown-800">完成热力图</h2>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 mr-1">
                {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
                  <div key={d} className="h-3 text-[9px] text-brown-700/40 flex items-center">
                    {i % 2 === 0 ? d : ''}
                  </div>
                ))}
              </div>
              <div className="flex-1 flex gap-1 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 12 }, (_, w) => (
                  <div key={w} className="flex flex-col gap-1 flex-shrink-0">
                    {Array.from({ length: 7 }, (_, d) => {
                      const item = heatmapData.data.find((item) => item.week === w && item.day === d);
                      return (
                        <div
                          key={d}
                          className={cn(
                            'w-3 h-3 rounded-sm transition-colors',
                            item ? getHeatmapColor(item.count, heatmapData.maxCount) : 'bg-cream-200'
                          )}
                          title={item ? `${item.date}: ${item.count} 个完成` : ''}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-brown-700/50">
              <span>少</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-cream-200" />
                <div className="w-3 h-3 rounded-sm bg-amber-400/30" />
                <div className="w-3 h-3 rounded-sm bg-amber-400/50" />
                <div className="w-3 h-3 rounded-sm bg-amber-400/70" />
                <div className="w-3 h-3 rounded-sm bg-amber-500" />
              </div>
              <span>多</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Target size={18} className="text-sage-500" />
              <h2 className="font-semibold text-brown-800">目标分析</h2>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500 font-serif">{goals.length}</p>
                <p className="text-xs text-brown-700/50 mt-1">总目标</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sage-500 font-serif">{stats.completedGoals}</p>
                <p className="text-xs text-brown-700/50 mt-1">已完成</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slateblue-500 font-serif">{stats.activeGoals}</p>
                <p className="text-xs text-brown-700/50 mt-1">进行中</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brown-700/60">目标达成率</span>
                <span className="font-medium text-brown-800">{stats.goalCompletionRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.goalCompletionRate}%` }}
                />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
