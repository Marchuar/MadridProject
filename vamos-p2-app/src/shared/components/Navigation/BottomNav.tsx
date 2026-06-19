import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, MapPin, CalendarDays, UserCircle } from 'lucide-react';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Home' },
  { to: '/activities', icon: Compass,          label: 'Explore' },
  { to: '/map',        icon: MapPin,            label: 'Map' },
  { to: '/calendar',   icon: CalendarDays,      label: 'Calendar' },
  { to: '/profile',    icon: UserCircle,        label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className={styles.bottomNav} aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [styles.bottomNavItem, isActive ? styles.bottomNavItemActive : ''].join(' ')
          }
        >
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
