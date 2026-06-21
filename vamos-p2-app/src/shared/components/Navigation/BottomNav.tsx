import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, MapPin, CalendarDays, UserCircle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Home' },
  { to: '/activities', icon: Compass,          label: 'Explore' },
  { to: '/map',        icon: MapPin,            label: 'Map' },
  { to: '/calendar',   icon: CalendarDays,      label: 'Calendar' },
  { to: '/profile',    icon: UserCircle,        label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#EAEAE8] flex items-stretch z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium tracking-wide transition-colors duration-150 relative min-h-[44px] ${
              isActive ? 'text-[#E31E24]' : 'text-[#9CA3AF] hover:text-[#5F6B7A]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-[#E31E24] rounded-b-sm" />
              )}
              <Icon size={22} aria-hidden="true" />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
