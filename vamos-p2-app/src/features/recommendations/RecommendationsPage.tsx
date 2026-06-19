import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { apiGetProfile } from '../profile/profileApi';
import { scoreActivities, type ScoredActivity } from './recommendationsLogic';
import { GlassCard } from '../../shared/components/GlassCard/GlassCard';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import styles from './RecommendationsPage.module.css';

export function RecommendationsPage() {
  const { user } = useAuth();
  const [picks, setPicks] = useState<ScoredActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchActivities(), apiGetProfile()])
      .then(([activities, profile]) => {
        setPicks(scoreActivities(activities, profile));
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Could not load recommendations'))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <Sparkles size={22} aria-hidden="true" />
        </div>
        <div>
          <h1 className={styles.title}>Picked for You</h1>
          <p className={styles.subtitle}>Based on your interests and budget</p>
        </div>
      </header>

      {isLoading && (
        <div className={styles.loadingWrap}>
          {[0, 1, 2].map(i => (
            <div key={i} className={styles.skeleton} aria-hidden="true" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <GlassCard className={styles.emptyCard}>
          <p className={styles.errorMsg}>{error}</p>
        </GlassCard>
      )}

      {!isLoading && !error && picks.length === 0 && (
        <GlassCard className={styles.emptyCard}>
          <Sparkles size={36} color="var(--color-text-muted)" aria-hidden="true" />
          <p className={styles.emptyTitle}>Nothing to recommend yet</p>
          <p className={styles.emptyHint}>
            Complete your profile — add your interests and budget — and we'll find the best activities for you.
          </p>
        </GlassCard>
      )}

      {!isLoading && !error && picks.length > 0 && (
        <div className={styles.picksGrid}>
          {picks.map(({ activity, score, reasons }, i) => {
            const dateObj = new Date(activity.date);
            const dateStr = isNaN(dateObj.getTime())
              ? activity.date
              : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const timeStr = isNaN(dateObj.getTime())
              ? ''
              : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.45, ease: 'easeOut' }}
              >
                <GlassCard
                  as="article"
                  className={[styles.pickCard, i === 0 ? styles.pickCardFeatured : ''].join(' ')}
                >
                  <div className={styles.pickTop}>
                    <span className={styles.rank}>#{i + 1}</span>
                    <div className={styles.scoreChip}>
                      <Star size={12} aria-hidden="true" />
                      {score} pts
                    </div>
                  </div>
                  <h2 className={styles.pickTitle}>{activity.title}</h2>
                  {activity.description && (
                    <p className={styles.pickDesc}>{activity.description}</p>
                  )}
                  <div className={styles.pickMeta}>
                    {(dateStr || timeStr) && (
                      <span className={styles.metaItem}>
                        <Clock size={13} aria-hidden="true" />
                        {dateStr}{timeStr ? ` · ${timeStr}` : ''}
                      </span>
                    )}
                    {activity.location && (
                      <span className={styles.metaItem}>
                        <MapPin size={13} aria-hidden="true" />
                        {activity.location}
                      </span>
                    )}
                  </div>
                  <div className={styles.reasons}>
                    {reasons.map(r => (
                      <span key={r} className={styles.reasonChip}>{r}</span>
                    ))}
                  </div>
                  <div className={styles.pickFooter}>
                    <span className={styles.pickPrice}>€{activity.price}</span>
                    <button className={styles.bookBtn} onClick={() => { setSelectedActivity(activity); setDetailOpen(true); }}>Book Now</button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
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
