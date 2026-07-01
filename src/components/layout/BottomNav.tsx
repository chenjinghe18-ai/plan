import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/daily', icon: Calendar, label: '每日' },
  { path: '/goals', icon: Target, label: '阶段' },
  { path: '/stats', icon: BarChart3, label: '统计' },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-cream-200 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-200 ${
                active ? 'text-amber-500' : 'text-brown-700/50'
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={active ? 'animate-bounce-soft' : ''}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
