import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music2, Building2, Map, Trophy, ChefHat, Moon, Languages, Compass, ArrowRight, Calendar } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import { useUserActivities } from '../../shared/store/userActivitiesStore';
import { TypingAnimation } from '../../shared/components/MagicUI/TypingAnimation';
import { NumberTicker } from '../../shared/components/MagicUI/NumberTicker';
import { AnimatedList } from '../../shared/components/MagicUI/AnimatedList';
import styles from './HomePage.module.css';

const MOSAIC_IMAGES = [
  '/activities/rooftop.webp',
  '/activities/flamenco.webp',
  '/activities/retiro.webp',
  '/activities/tapas.webp',
];

const CATEGORIES = [
  { key: 'flamenco',          label: 'Flamenco',    Icon: Music2,     color: '#E11D48', img: '/activities/flamenco.webp' },
  { key: 'museum',            label: 'Museums',     Icon: Building2,  color: '#7C3AED', img: '/activities/prado.webp' },
  { key: 'city_tour',         label: 'City Tours',  Icon: Map,        color: '#2563EB', img: '/activities/malasana.webp' },
  { key: 'football',          label: 'Football',    Icon: Trophy,     color: '#16A34A', img: '/activities/bernabeu.webp' },
  { key: 'cooking_class',     label: 'Cooking',     Icon: ChefHat,    color: '#EA580C', img: '/activities/tapas.webp' },
  { key: 'tardeo',            label: 'Tardeo',      Icon: Moon,       color: '#9333EA', img: '/activities/rooftop.webp' },
  { key: 'language_exchange', label: 'Language',    Icon: Languages,  color: '#0891B2', img: '/activities/chueca.webp' },
  { key: 'day_trip',          label: 'Day Trips',   Icon: Compass,    color: '#D97706', img: '/activities/retiro.webp' },
];

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { booked } = useUserActivities();

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  useEffect(() => {
    fetchActivities().then(a => setActivities(a.slice(0, 6))).catch(() => {});
  }, []);

  const upcomingBookings = booked
    .filter(b => new Date(b.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className={styles.page}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={styles.heroBadge}>¡BUENAS, {firstName.toUpperCase()}!</span>
            <h1 className={styles.heroTitle}>
              Discover Madrid
            </h1>
            <div className={styles.heroTyping}>
              <span className={styles.heroTypingThrough}>through </span>
              <TypingAnimation
                texts={['flamenco nights', 'tapas & wine', 'rooftop sunsets', 'history & art', 'football magic']}
                className={styles.heroTypingText}
                speed={55}
                pauseDuration={2000}
              />
            </div>
            <p className={styles.heroSub}>
              Curated experiences for international students — handpicked just for you.
            </p>
            <div className={styles.heroCTAs}>
              <motion.button
                className={styles.ctaPrimary}
                onClick={() => navigate('/activities')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse activities
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                className={styles.ctaGhost}
                onClick={() => navigate('/recommendations')}
                whileTap={{ scale: 0.97 }}
              >
                ¡Vamos! Pick for me
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.mosaic}>
            {MOSAIC_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                className={styles.mosaicCell}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease: 'easeOut' }}
              >
                <img src={src} alt="" loading="eager" />
              </motion.div>
            ))}
          </div>
          <motion.div
            className={styles.statsBubble}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <NumberTicker value={activities.length || 20} className={styles.statsNum} suffix="+" />
            <span className={styles.statsLabel}>activities this week</span>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <motion.section
        className={styles.statsBar}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { value: 20, label: 'Activities', suffix: '' },
          { value: 15, label: 'Restaurants', suffix: '+' },
          { value: 3,  label: 'Day Trips', suffix: '' },
        ].map(stat => (
          <div key={stat.label} className={styles.statItem}>
            <NumberTicker value={stat.value} suffix={stat.suffix} className={styles.statNum} />
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </motion.section>

      {/* ── CATEGORIES ── */}
      <section className={styles.categories}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Explore by vibe</h2>
          <button className={styles.sectionLink} onClick={() => navigate('/activities')}>
            See all <ArrowRight size={14} />
          </button>
        </div>
        <div className={styles.catScroll}>
          {CATEGORIES.map(({ key, label, color, img }, i) => (
            <motion.button
              key={key}
              className={styles.catTile}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/activities?category=${key}`)}
              aria-label={`Browse ${label}`}
            >
              <img src={img} alt={label} className={styles.catImg} />
              <div className={styles.catOverlay} style={{ background: `linear-gradient(180deg, transparent 40%, ${color}CC 100%)` }} />
              <span className={styles.catName}>{label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── UPCOMING BOOKINGS (if any) ── */}
      {upcomingBookings.length > 0 && (
        <section className={styles.upcomingSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <button className={styles.sectionLink} onClick={() => navigate('/calendar')}>
              Calendar <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.upcomingList}>
            {upcomingBookings.map((b, i) => {
              const img = getActivityImage(b.activityTitle);
              return (
                <motion.div
                  key={b.bookedAt}
                  className={styles.upcomingCard}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate('/calendar')}
                >
                  <div className={styles.upcomingDateBadge}>
                    <span className={styles.upcomingDay}>{new Date(b.date).getDate()}</span>
                    <span className={styles.upcomingMonth}>
                      {new Date(b.date).toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </div>
                  <img src={img} alt={b.activityTitle} className={styles.upcomingThumb} />
                  <div>
                    <p className={styles.upcomingTitle}>{b.activityTitle}</p>
                    <p className={styles.upcomingMeta}>{b.time} · {b.people} {b.people === 1 ? 'person' : 'people'}</p>
                  </div>
                  <Calendar size={16} color="var(--color-text-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── RECENT ACTIVITIES ── */}
      {activities.length > 0 && (
        <section className={styles.recentSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Latest activities</h2>
            <button className={styles.sectionLink} onClick={() => navigate('/activities')}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <AnimatedList className={styles.recentList} stagger={0.08}>
            {activities.map(a => {
              const img = getActivityImage(a.title, a.category, a.imageUrl || undefined);
              return (
                <motion.div
                  key={a.id}
                  className={styles.recentCard}
                  whileHover={{ x: 4 }}
                  onClick={() => { setSelectedActivity(a); setDetailOpen(true); }}
                >
                  <img src={img} alt={a.title} className={styles.recentThumb} />
                  <div className={styles.recentInfo}>
                    <p className={styles.recentTitle}>{a.title}</p>
                    <p className={styles.recentMeta}>
                      €{a.price} · {a.slotsLeft > 0 ? `${a.slotsLeft} spots left` : 'Sold out'}
                    </p>
                  </div>
                  <ArrowRight size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                </motion.div>
              );
            })}
          </AnimatedList>
        </section>
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
