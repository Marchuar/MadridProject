import { useState, useEffect } from 'react';
import { Calendar, ConfigProvider } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Users, X, CalendarDays } from 'lucide-react';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import { useUserActivities } from '../../shared/store/userActivitiesStore';
import styles from './CalendarPage.module.css';

const CAT_COLORS: Record<string, string> = {
  flamenco: '#E11D48', museum: '#7C3AED', city_tour: '#2563EB',
  football: '#16A34A', cooking_class: '#EA580C', tardeo: '#9333EA',
  language_exchange: '#0891B2', day_trip: '#D97706',
};

export function CalendarPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { booked } = useUserActivities();

  useEffect(() => { fetchActivities().then(setActivities); }, []);

  // Build lookup: date string → activities
  const activitiesByDate: Record<string, Activity[]> = {};
  activities.forEach(a => {
    const d = new Date(a.date);
    if (!isNaN(d.getTime())) {
      const key = dayjs(d).format('YYYY-MM-DD');
      activitiesByDate[key] = [...(activitiesByDate[key] ?? []), a];
    }
  });

  const bookedDates = new Set(booked.map(b => b.date));

  const activitiesOnDate = activitiesByDate[selectedDate.format('YYYY-MM-DD')] ?? [];
  const bookedOnDate = booked.filter(b => b.date === selectedDate.format('YYYY-MM-DD'));

  const dateCellRender = (value: Dayjs) => {
    const key = value.format('YYYY-MM-DD');
    const acts = activitiesByDate[key] ?? [];
    const hasBooked = bookedDates.has(key);
    if (acts.length === 0 && !hasBooked) return null;

    return (
      <div className={styles.cellDots}>
        {hasBooked && <span className={styles.dotBooked} title="Booked" />}
        {acts.slice(0, 3).map(a => (
          <span
            key={a.id}
            className={styles.dotActivity}
            style={{ background: CAT_COLORS[a.category] ?? '#E31E24' }}
            title={a.title}
          />
        ))}
      </div>
    );
  };

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    const key = date.format('YYYY-MM-DD');
    const hasActs = (activitiesByDate[key]?.length ?? 0) > 0 || bookedDates.has(key);
    if (hasActs) setPanelOpen(true);
  };

  const openDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>Your Madrid schedule at a glance</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.dotBooked} />Booked</span>
          <span className={styles.legendItem}><span className={styles.dotSample} />Available</span>
        </div>
      </div>

      <div className={styles.calendarWrap}>
        <ConfigProvider theme={{ token: { colorPrimary: '#07294D' } }}>
          <Calendar
            cellRender={dateCellRender}
            onSelect={onDateSelect}
            className={styles.calendar}
          />
        </ConfigProvider>
      </div>

      {/* Side panel for selected date */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className={styles.panelBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
            />
            <motion.aside
              className={styles.panel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelDate}>{selectedDate.format('dddd, D MMMM')}</p>
                  <p className={styles.panelCount}>
                    {activitiesOnDate.length + bookedOnDate.length} item{activitiesOnDate.length + bookedOnDate.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button className={styles.panelClose} onClick={() => setPanelOpen(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className={styles.panelContent}>
                {bookedOnDate.length > 0 && (
                  <div className={styles.panelSection}>
                    <p className={styles.panelSectionLabel}>Your bookings</p>
                    {bookedOnDate.map(b => {
                      const act = activities.find(a => a.id === b.activityId);
                      const img = getActivityImage(b.activityTitle, act?.category, act?.imageUrl || undefined);
                      return (
                        <motion.div
                          key={b.bookedAt}
                          className={styles.panelCard}
                          style={{ borderLeftColor: '#16A34A' }}
                          whileHover={{ x: 3 }}
                          onClick={() => act && openDetail(act)}
                        >
                          <img src={img} alt={b.activityTitle} className={styles.panelThumb} />
                          <div className={styles.panelCardBody}>
                            <p className={styles.panelCardTitle}>{b.activityTitle}</p>
                            <div className={styles.panelCardMeta}>
                              <span><Clock size={11} /> {b.time}</span>
                              <span><Users size={11} /> {b.people} {b.people === 1 ? 'person' : 'people'}</span>
                            </div>
                            <span className={styles.bookedBadge}>✓ Booked · €{b.totalPrice}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {activitiesOnDate.length > 0 && (
                  <div className={styles.panelSection}>
                    <p className={styles.panelSectionLabel}>Available activities</p>
                    {activitiesOnDate.map(a => {
                      const img = getActivityImage(a.title, a.category, a.imageUrl || undefined);
                      const color = CAT_COLORS[a.category] ?? '#E31E24';
                      return (
                        <motion.div
                          key={a.id}
                          className={styles.panelCard}
                          style={{ borderLeftColor: color }}
                          whileHover={{ x: 3 }}
                          onClick={() => openDetail(a)}
                        >
                          <img src={img} alt={a.title} className={styles.panelThumb} />
                          <div className={styles.panelCardBody}>
                            <p className={styles.panelCardTitle}>{a.title}</p>
                            <div className={styles.panelCardMeta}>
                              <span><Clock size={11} /> {a.location}</span>
                            </div>
                            <span className={styles.priceBadge}>€{a.price}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {activitiesOnDate.length === 0 && bookedDates.size === 0 && !panelOpen && (
        <div className={styles.emptyState}>
          <CalendarDays size={40} color="var(--color-text-muted)" />
          <p>No activities scheduled yet. Browse and book your first experience!</p>
        </div>
      )}

      <ActivityDetailModal
        activity={selectedActivity}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onBook={a => { setBookingActivity(a); setDetailOpen(false); setBookingOpen(true); }}
      />
      <BookingFlow
        activity={bookingActivity}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onBack={() => { setBookingOpen(false); if (bookingActivity) { setSelectedActivity(bookingActivity); setDetailOpen(true); } }}
      />
    </div>
  );
}
