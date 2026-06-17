import { CalendarDays } from 'lucide-react';
import styles from './ActivitiesPage.module.css';

export function ActivitiesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Activities</h1>
        <p className={styles.pageSubtitle}>Explore things to do in Madrid</p>
      </header>
      <div className={styles.placeholder}>
        <CalendarDays size={48} color="var(--color-text-muted)" />
        <p>Activity browsing coming soon</p>
      </div>
    </div>
  );
}
