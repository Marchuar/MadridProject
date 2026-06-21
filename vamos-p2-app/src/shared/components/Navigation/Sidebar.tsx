import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, UserCircle, LogOut, MapPin, CalendarDays, Heart } from 'lucide-react';
import { useAuth } from '../../../features/auth/useAuth';

const NAV_ITEMS = [
  { to: '/',                icon: LayoutDashboard, label: 'Home' },
  { to: '/activities',      icon: Compass,          label: 'Activities' },
  { to: '/map',             icon: MapPin,            label: 'Map' },
  { to: '/calendar',        icon: CalendarDays,      label: 'Calendar' },
  { to: '/recommendations', icon: Sparkles,          label: 'For You' },
  { to: '/my-madrid',       icon: Heart,             label: 'My Madrid' },
  { to: '/profile',         icon: UserCircle,        label: 'Profile' },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.displayName?.charAt(0).toUpperCase() ?? '?';

  return (
    <aside
      className="hidden md:flex w-[220px] bg-white border-r border-[#EAEAE8] flex-col fixed top-0 left-0 h-screen z-[100]"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#EAEAE8]">
        <div className="w-8 h-8 bg-[#E31E24] rounded-lg flex items-center justify-center text-white font-[Clash_Display] font-black text-base flex-shrink-0">
          V
        </div>
        <span className="font-[Clash_Display] font-black text-[#111827] text-[15px] tracking-tight">
          VamosMadrid
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px] ${
                isActive
                  ? 'bg-[#FEF2F2] text-[#E31E24] font-semibold'
                  : 'text-[#5F6B7A] hover:bg-[#F4F4F2] hover:text-[#111827]'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer: user + sign out */}
      <div className="px-3 py-4 border-t border-[#EAEAE8] flex flex-col gap-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#E31E24] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <span className="text-sm font-semibold text-[#111827] truncate flex-1">
              {user.displayName}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#E31E24] border border-[#FEF2F2] hover:bg-[#FEF2F2] transition-all duration-150 min-h-[44px] w-full"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
