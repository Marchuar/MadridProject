import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchActivities, type Activity } from './activitiesApi';
import { ActivityCard } from './ActivityCard';
import styles from './ActivitiesPage.module.css';

const FILTERS = [
  { value: '',                  label: 'All' },
  { value: 'flamenco',          label: 'Flamenco' },
  { value: 'museum',            label: 'Museums' },
  { value: 'city_tour',         label: 'City Tours' },
  { value: 'day_trip',          label: 'Day Trips' },
  { value: 'tardeo',            label: 'Tardeo' },
  { value: 'cooking_class',     label: 'Cooking' },
  { value: 'football',          label: 'Football' },
  { value: 'language_exchange', label: 'Language' },
];

export function ActivitiesPage() {
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') ?? '');

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchActivities(activeFilter || undefined)
      .then(setActivities)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load activities'))
      .finally(() => setIsLoading(false));
  }, [activeFilter]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Activities in Madrid</h1>
        <p className={styles.pageSubtitle}>Explore things to do</p>
      </header>

      {/* Filter pills */}
      <div className={styles.filters} role="group" aria-label="Category filters">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={[styles.filterPill, activeFilter === f.value ? styles.filterPillActive : ''].join(' ')}
            onClick={() => setActiveFilter(f.value)}
            aria-pressed={activeFilter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} aria-hidden="true" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className={styles.empty}>
          <p className={styles.errorMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={() => setActiveFilter(activeFilter)}>
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && activities.length === 0 && (
        <div className={styles.empty}>
          <p>No activities match this filter.</p>
          <button className={styles.retryBtn} onClick={() => setActiveFilter('')}>
            View all activities
          </button>
        </div>
      )}

      {/* Cards grid */}
      {!isLoading && !error && activities.length > 0 && (
        <motion.div
          className={styles.grid}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {activities.map(a => (
              <motion.div
                key={a.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <ActivityCard activity={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
