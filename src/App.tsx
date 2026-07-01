import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Daily from '@/pages/Daily';
import Goals from '@/pages/Goals';
import GoalDetail from '@/pages/GoalDetail';
import Stats from '@/pages/Stats';

export default function App() {
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
