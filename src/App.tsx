import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Daily from '@/pages/Daily';
import Goals from '@/pages/Goals';
import GoalDetail from '@/pages/GoalDetail';
import Stats from '@/pages/Stats';
import { startReminderService, stopReminderService } from '@/utils/reminder';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  useEffect(() => {
    startReminderService();
    useAppStore.getState().generateRecurringTasksForWeek();

    return () => {
      stopReminderService();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
        <Route path="/goals/:id" element={<GoalDetail />} />
      </Routes>
    </Router>
  );
}
