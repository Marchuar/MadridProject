import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, UserCircle, LogOut, MapPin, CalendarDays, Heart } from 'lucide-react';
import { useAuth } from '../../../features/auth/useAuth';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
  { to: '/',               icon: LayoutDashboard, label: 'Home' },
  { to: '/activities',     icon: Compass,          label: 'Activities' },
  { to: '/map',            icon: MapPin,            label: 'Map' },
  { to: '/calendar',       icon: CalendarDays,      label: 'Calendar' },
  { to: '/recommendations', icon: Sparkles,          label: 'For You' },
  { to: '/my-madrid',      icon: Heart,             label: 'My Madrid' },
  { to: '/profile',        icon: UserCircle,        label: 'Profile' },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.sidebarLogo}>
        <span className={styles.logoMark}>V</span>
        <span className={styles.logoText}>VamosMadrid</span>
      </div>

      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.navItemActive : ''].join(' ')
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        {user && (
          <div className={styles.userChip}>
            <div className={styles.avatar}>{user.displayName.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{user.displayName}</span>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Sign out">
          <LogOut size={16} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
