import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Button } from '../../shared/components/Button/Button';
import styles from './HomePage.module.css';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <MapPin size={14} aria-hidden="true" />
            Madrid, Spain
          </div>
          <h1 className={styles.heroTitle}>
            Hola, {user?.displayName ?? 'there'}!<br />
            <span className={styles.heroHighlight}>What's your plan today?</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover handpicked activities in Madrid — from flamenco nights to hidden tapas spots.
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
        </div>
        <div className={styles.heroDecor} aria-hidden="true">
          <div className={styles.heroDecorCircle1} />
          <div className={styles.heroDecorCircle2} />
        </div>
      </div>

      <div className={styles.quickLinks}>
        {[
          { emoji: '💃', label: 'Flamenco', to: '/activities' },
          { emoji: '🏛️', label: 'Museums',  to: '/activities' },
          { emoji: '🌆', label: 'City Tours', to: '/activities' },
          { emoji: '⚽', label: 'Football',   to: '/activities' },
        ].map(({ emoji, label, to }) => (
          <Link key={label} to={to} className={styles.quickLink}>
            <span className={styles.quickLinkEmoji}>{emoji}</span>
            <span className={styles.quickLinkLabel}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
