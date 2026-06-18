import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music2, Building2, Map, Trophy, ChefHat, Moon, Languages, Compass } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { key: 'flamenco',          label: 'Flamenco',    Icon: Music2,     color: '#E11D48' },
  { key: 'museum',            label: 'Museums',     Icon: Building2,  color: '#7C3AED' },
  { key: 'city_tour',         label: 'City Tours',  Icon: Map,        color: '#2563EB' },
  { key: 'football',          label: 'Football',    Icon: Trophy,     color: '#16A34A' },
  { key: 'cooking_class',     label: 'Cooking',     Icon: ChefHat,    color: '#EA580C' },
  { key: 'tardeo',            label: 'Tardeo',      Icon: Moon,       color: '#9333EA' },
  { key: 'language_exchange', label: 'Language',    Icon: Languages,  color: '#0891B2' },
  { key: 'day_trip',          label: 'Day Trips',   Icon: Compass,    color: '#D97706' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <div className={styles.page}>
      {/* ── Hero band (navy) ── */}
      <section className={styles.hero}>
        <div className={styles.heroCircle} aria-hidden="true" />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span className={styles.heroBadge}>BUENAS, {firstName.toUpperCase()}</span>
          <h1 className={styles.heroTitle}>
            What's on<br />in Madrid?
          </h1>
          <p className={styles.heroSub}>
            Handpicked flamenco, food, tours and football — just for you.
          </p>
          <div className={styles.heroCTAs}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/activities')}>
              Browse activities
            </button>
            <button className={styles.ctaGhost} onClick={() => navigate('/recommendations')}>
              ¡Vamos! Pick for me
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Category tiles ── */}
      <section className={styles.categories}>
        <p className={styles.sectionLabel}>Explore by vibe</p>
        <motion.div
          className={styles.catGrid}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.map(({ key, label, Icon, color }) => (
            <motion.button
              key={key}
              className={styles.catTile}
              style={{ '--tile-color': color } as React.CSSProperties}
              variants={item}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/activities?category=${key}`)}
              aria-label={`Browse ${label} activities`}
            >
              <div className={styles.catIcon}>
                <Icon size={22} aria-hidden="true" />
              </div>
              <span className={styles.catName}>{label}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
