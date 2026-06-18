import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Music2, Building2, Map, Trophy, ChefHat, Moon, Languages, Compass, ArrowRight, Sparkles,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { Button } from '../../shared/components/Button/Button';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { icon: Music2,    label: 'Flamenco',   to: '/activities?category=flamenco',          color: '#E31E24' },
  { icon: Building2, label: 'Museums',    to: '/activities?category=museum',             color: '#1863DC' },
  { icon: Map,       label: 'City Tours', to: '/activities?category=city_tour',          color: '#10B981' },
  { icon: Trophy,    label: 'Football',   to: '/activities?category=football',           color: '#F59E0B' },
  { icon: ChefHat,   label: 'Cooking',    to: '/activities?category=cooking_class',      color: '#8B5CF6' },
  { icon: Moon,      label: 'Tardeo',     to: '/activities?category=tardeo',             color: '#EC4899' },
  { icon: Languages, label: 'Language',   to: '/activities?category=language_exchange',  color: '#06B6D4' },
  { icon: Compass,   label: 'Day Trips',  to: '/activities?category=day_trip',           color: '#84CC16' },
];

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  },
};

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.cityPulse} aria-hidden="true" />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className={styles.buenas} aria-hidden="true">Buenas</p>
          <h1 className={styles.heroTitle}>
            Hola, {user?.displayName ?? 'there'}!
            <br />
            <span className={styles.heroHighlight}>What's your plan?</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Handpicked activities in Madrid — flamenco nights to hidden tapas spots.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/activities">
              <Button size="lg">
                Browse activities
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button variant="secondary" size="lg">
                <Sparkles size={18} aria-hidden="true" />
                For you
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Category grid */}
      <motion.div
        className={styles.categories}
        variants={stagger.container}
        initial="hidden"
        animate="show"
      >
        {CATEGORIES.map(({ icon: Icon, label, to, color }) => (
          <motion.div key={label} variants={stagger.item}>
            <Link
              to={to}
              className={styles.categoryCard}
              style={{ '--cat-color': color } as React.CSSProperties}
            >
              <span className={styles.categoryIcon}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className={styles.categoryLabel}>{label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
