import { motion } from 'motion/react';
import { MapPin, Clock, Users, Heart, ArrowRight } from 'lucide-react';
import type { Activity } from './activitiesApi';
import { getActivityImage } from './activityImages';
import { useUserActivities } from '../../shared/store/userActivitiesStore';
import styles from './ActivityCard.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  flamenco:          'Flamenco',
  museum:            'Museum',
  city_tour:         'City Tour',
  football:          'Football',
  cooking_class:     'Cooking',
  tardeo:            'Tardeo',
  language_exchange: 'Language',
  day_trip:          'Day Trip',
};

const CAT_COLORS: Record<string, string> = {
  flamenco:          '#E11D48',
  museum:            '#7C3AED',
  city_tour:         '#2563EB',
  football:          '#16A34A',
  cooking_class:     '#EA580C',
  tardeo:            '#9333EA',
  language_exchange: '#0891B2',
  day_trip:          '#D97706',
};

function slotsVariant(left: number, total: number): 'green' | 'orange' | 'red' {
  const ratio = total > 0 ? left / total : 0;
  if (ratio > 0.4) return 'green';
  if (ratio > 0.15) return 'orange';
  return 'red';
}

interface ActivityCardProps {
  activity: Activity;
  onOpen?: (activity: Activity) => void;
  compact?: boolean;
}

export function ActivityCard({ activity, onOpen, compact }: ActivityCardProps) {
  const { title, category, date, location, price, slotsLeft, slotsTotal, description, imageUrl } = activity;
  const { toggleLike, isLiked } = useUserActivities();
  const liked = isLiked(activity.id);
  const variant = slotsVariant(slotsLeft, slotsTotal);

  const dateObj = new Date(date);
  const dateStr = isNaN(dateObj.getTime())
    ? date
    : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const timeStr = isNaN(dateObj.getTime())
    ? ''
    : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const catColor = CAT_COLORS[category] ?? '#E31E24';
  const img = getActivityImage(title, category, imageUrl || undefined);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(activity.id);
  };

  return (
    <motion.article
      className={[styles.card, compact ? styles.cardCompact : ''].join(' ')}
      style={{ '--cat-color': catColor } as React.CSSProperties}
      whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.16)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen?.(activity)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      onKeyDown={e => e.key === 'Enter' && onOpen?.(activity)}
    >
      {/* Photo area */}
      <div className={styles.photo}>
        <img src={img} alt={title} loading="lazy" className={styles.photoImg} />
        <div className={styles.photoOverlay} />

        <span className={styles.catBadge} style={{ background: catColor }}>
          {CATEGORY_LABELS[category] ?? category}
        </span>

        <motion.button
          className={[styles.likeBtn, liked ? styles.likeBtnActive : ''].join(' ')}
          onClick={handleLike}
          whileTap={{ scale: 1.3 }}
          aria-label={liked ? 'Unlike' : 'Like'}
          aria-pressed={liked}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </motion.button>

        <div className={styles.priceBadge}>€{price}</div>

        {slotsLeft === 0 && <div className={styles.soldOutBadge}>Sold Out</div>}
      </div>

      {/* Text area */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {description && !compact && (
          <p className={styles.desc}>{description}</p>
        )}

        <div className={styles.meta}>
          {(dateStr || timeStr) && (
            <span className={styles.metaItem}>
              <Clock size={12} aria-hidden="true" />
              {dateStr}{timeStr ? ` · ${timeStr}` : ''}
            </span>
          )}
          {location && (
            <span className={styles.metaItem}>
              <MapPin size={12} aria-hidden="true" />
              {location}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={[styles.slots, styles[`slots_${variant}`]].join(' ')}>
            <Users size={12} aria-hidden="true" />
            {slotsLeft > 0 ? `${slotsLeft} left` : 'Sold out'}
          </span>
          <motion.button
            className={styles.bookBtn}
            whileTap={{ scale: 0.95 }}
            disabled={slotsLeft === 0}
            onClick={e => { e.stopPropagation(); onOpen?.(activity); }}
            aria-label={`Book ${title}`}
          >
            Book
            <ArrowRight size={13} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
