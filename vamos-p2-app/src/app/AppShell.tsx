import { Outlet } from 'react-router-dom';
import { Sidebar } from '../shared/components/Navigation/Sidebar';
import { BottomNav } from '../shared/components/Navigation/BottomNav';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
