import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, X } from 'lucide-react';
import { fetchActivities, type Activity } from './activitiesApi';
import { ActivityCard } from './ActivityCard';
import { ActivityDetailModal } from './ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
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
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') ?? '');
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchActivities(activeFilter || undefined)
      .then(setActivities)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load activities'))
      .finally(() => setIsLoading(false));
  }, [activeFilter]);

  const filtered = search.trim()
    ? activities.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase())
      )
    : activities;

  const openDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
  };

  const openBooking = (activity: Activity) => {
    setBookingActivity(activity);
    setDetailOpen(false);
    setBookingOpen(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.pageTitle}>Activities</h1>
            <p className={styles.pageSubtitle}>
              {isLoading ? 'Loading...' : `${filtered.length} experience${filtered.length !== 1 ? 's' : ''} in Madrid`}
            </p>
          </div>
          <button className={styles.mapBtn} onClick={() => navigate('/map')} aria-label="View on map">
            <Map size={18} />
            <span>Map</span>
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search activities or places..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search activities"
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

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
      </header>

      {/* Loading skeletons */}
      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeleton} aria-hidden="true">
              <div className={styles.skeletonPhoto} />
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonLine} style={{ width: '70%' }} />
                <div className={styles.skeletonLine} style={{ width: '90%' }} />
                <div className={styles.skeletonLine} style={{ width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className={styles.empty}>
          <p className={styles.errorMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={() => setActiveFilter(activeFilter)}>Try again</button>
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No activities found</p>
          <p className={styles.emptyHint}>{search ? `No results for "${search}"` : 'Nothing matches this filter.'}</p>
          <button className={styles.retryBtn} onClick={() => { setActiveFilter(''); setSearch(''); }}>
            View all activities
          </button>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <motion.div
          className={styles.grid}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filtered.map(a => (
              <motion.div
                key={a.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <ActivityCard activity={a} onOpen={openDetail} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ActivityDetailModal
        activity={selectedActivity}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onBook={openBooking}
      />

      <BookingFlow
        activity={bookingActivity}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onBack={() => {
          setBookingOpen(false);
          if (bookingActivity) {
            setSelectedActivity(bookingActivity);
            setDetailOpen(true);
          }
        }}
      />
    </div>
  );
}
