import { useState, useEffect } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { motion } from 'motion/react';
import { Heart, Calendar, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import { useUserActivities } from '../../shared/store/userActivitiesStore';
import styles from './MyMadridPage.module.css';

export function MyMadridPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { liked, booked, visited, markVisited } = useUserActivities();

  useEffect(() => { fetchActivities().then(setActivities); }, []);

  const likedActivities = activities.filter(a => liked.includes(a.id));
  const visitedIds = new Set(visited);

  const openDetail = (activity: Activity) => { setSelectedActivity(activity); setDetailOpen(true); };

  const upcomingBookings = booked
    .filter(b => dayjs(b.date).isAfter(dayjs().subtract(1, 'day')))
    .sort((a, b) => a.date.localeCompare(b.date));

  const pastBookings = booked
    .filter(b => dayjs(b.date).isBefore(dayjs()))
    .sort((a, b) => b.date.localeCompare(a.date));

  function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>{icon}</div>
        <p className={styles.emptyTitle}>{title}</p>
        <p className={styles.emptyHint}>{hint}</p>
      </div>
    );
  }

  const likedTab = (
    <div className={styles.tabContent}>
      {likedActivities.length === 0 ? (
        <EmptyState
          icon={<Heart size={36} color="var(--color-text-muted)" />}
          title="No saved activities yet"
          hint="Tap the heart on any activity to save it here."
        />
      ) : (
        <div className={styles.grid}>
          {likedActivities.map((a, i) => {
            const img = getActivityImage(a.title, a.category, a.imageUrl || undefined);
            return (
              <motion.article
                key={a.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => openDetail(a)}
              >
                <div className={styles.cardPhoto}>
                  <img src={img} alt={a.title} loading="lazy" />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{a.title}</p>
                  <p className={styles.cardMeta}>€{a.price} · {a.slotsLeft > 0 ? `${a.slotsLeft} left` : 'Sold out'}</p>
                </div>
                <button
                  className={styles.cardCta}
                  onClick={e => { e.stopPropagation(); openDetail(a); }}
                  disabled={a.slotsLeft === 0}
                >
                  Book <ArrowRight size={13} />
                </button>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );

  const bookedTab = (
    <div className={styles.tabContent}>
      {booked.length === 0 ? (
        <EmptyState
          icon={<Calendar size={36} color="var(--color-text-muted)" />}
          title="No bookings yet"
          hint="Book an activity and it will appear here."
        />
      ) : (
        <div className={styles.bookingsList}>
          {upcomingBookings.length > 0 && (
            <div className={styles.bookingsGroup}>
              <p className={styles.groupLabel}>Upcoming</p>
              {upcomingBookings.map(b => {
                const act = activities.find(a => a.id === b.activityId);
                const img = getActivityImage(b.activityTitle, act?.category, act?.imageUrl || undefined);
                return (
                  <motion.div
                    key={b.bookedAt}
                    className={styles.bookingCard}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => act && openDetail(act)}
                  >
                    <img src={img} alt={b.activityTitle} className={styles.bookingThumb} />
                    <div className={styles.bookingInfo}>
                      <p className={styles.bookingTitle}>{b.activityTitle}</p>
                      <div className={styles.bookingMeta}>
                        <span><Clock size={12} /> {dayjs(b.date).format('D MMM YYYY')}, {b.time}</span>
                        <span><Users size={12} /> {b.people} {b.people === 1 ? 'person' : 'people'}</span>
                      </div>
                      <p className={styles.bookingPrice}>Total: €{b.totalPrice}</p>
                    </div>
                    <div className={styles.upcomingBadge}>Soon</div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {pastBookings.length > 0 && (
            <div className={styles.bookingsGroup}>
              <p className={styles.groupLabel}>Past</p>
              {pastBookings.map(b => {
                const act = activities.find(a => a.id === b.activityId);
                const img = getActivityImage(b.activityTitle, act?.category, act?.imageUrl || undefined);
                const isVisit = visitedIds.has(b.activityId);
                return (
                  <motion.div
                    key={b.bookedAt}
                    className={[styles.bookingCard, styles.bookingCardPast].join(' ')}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => act && openDetail(act)}
                  >
                    <img src={img} alt={b.activityTitle} className={styles.bookingThumb} />
                    <div className={styles.bookingInfo}>
                      <p className={styles.bookingTitle}>{b.activityTitle}</p>
                      <div className={styles.bookingMeta}>
                        <span><Clock size={12} /> {dayjs(b.date).format('D MMM YYYY')}</span>
                      </div>
                    </div>
                    {!isVisit ? (
                      <button
                        className={styles.visitBtn}
                        onClick={e => { e.stopPropagation(); markVisited(b.activityId); }}
                      >
                        Mark visited
                      </button>
                    ) : (
                      <span className={styles.visitedBadge}><CheckCircle size={14} /> Done</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const visitedTab = (
    <div className={styles.tabContent}>
      {visited.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={36} color="var(--color-text-muted)" />}
          title="No visited activities yet"
          hint="After attending an activity, mark it as visited to build your Madrid memory wall."
        />
      ) : (
        <div className={styles.memoryWall}>
          {visited.map((id, i) => {
            const act = activities.find(a => a.id === id);
            if (!act) return null;
            const img = getActivityImage(act.title, act.category, act.imageUrl || undefined);
            const b = booked.find(b => b.activityId === id);
            return (
              <motion.div
                key={id}
                className={styles.memoryCard}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => openDetail(act)}
              >
                <img src={img} alt={act.title} className={styles.memoryImg} />
                <div className={styles.memoryOverlay} />
                <div className={styles.memoryContent}>
                  <span className={styles.memoryCheck}><CheckCircle size={14} /> Visited</span>
                  <p className={styles.memoryTitle}>{act.title}</p>
                  {b && <p className={styles.memoryDate}>{dayjs(b.date).format('D MMM YYYY')}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Madrid</h1>
        <p className={styles.subtitle}>Your activities, bookings & memories</p>
      </div>

      <ConfigProvider theme={{ token: { colorPrimary: '#07294D' } }}>
        <Tabs
          defaultActiveKey="liked"
          className={styles.tabs}
          size="large"
          items={[
            { key: 'liked',   label: <span><Heart size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Saved ({liked.length})</span>,   children: likedTab },
            { key: 'booked',  label: <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Booked ({booked.length})</span>, children: bookedTab },
            { key: 'visited', label: <span><CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Visited ({visited.length})</span>, children: visitedTab },
          ]}
        />
      </ConfigProvider>

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
