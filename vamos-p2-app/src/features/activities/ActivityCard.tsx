import { motion } from 'framer-motion';
import { MapPin, Clock, Users } from 'lucide-react';
import { GlassCard } from '../../shared/components/GlassCard/GlassCard';
import type { Activity } from './activitiesApi';
import styles from './ActivityCard.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  flamenco:          'Flamenco',
  museum:            'Museum',
  city_tour:         'City Tour',
  football:          'Football',
  cooking_class:     'Cooking',
  tardeo:            'Tardeo',
  language_exchange: 'Language Exchange',
  day_trip:          'Day Trip',
};

function slotsVariant(left: number, total: number): 'green' | 'orange' | 'red' {
  const ratio = total > 0 ? left / total : 0;
  if (ratio > 0.4) return 'green';
  if (ratio > 0.15) return 'orange';
  return 'red';
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { title, category, date, location, price, slotsLeft, slotsTotal, description } = activity;
  const variant = slotsVariant(slotsLeft, slotsTotal);

  const dateObj = new Date(date);
  const dateStr = isNaN(dateObj.getTime())
    ? date
    : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const timeStr = isNaN(dateObj.getTime())
    ? ''
    : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <GlassCard as="article" className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>{CATEGORY_LABELS[category] ?? category}</span>
        <span className={styles.price}>€{price}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && (
        <p className={styles.desc}>{description}</p>
      )}
      <div className={styles.meta}>
        {(dateStr || timeStr) && (
          <span className={styles.metaItem}>
            <Clock size={13} aria-hidden="true" />
            {dateStr}{timeStr ? ` · ${timeStr}` : ''}
          </span>
        )}
        {location && (
          <span className={styles.metaItem}>
            <MapPin size={13} aria-hidden="true" />
            {location}
          </span>
        )}
      </div>
      <div className={styles.footer}>
        <span className={[styles.slots, styles[`slots_${variant}`]].join(' ')}>
          <Users size={13} aria-hidden="true" />
          {slotsLeft > 0
            ? `${slotsLeft} spot${slotsLeft !== 1 ? 's' : ''} left`
            : 'Sold out'}
        </span>
        <motion.button
          className={styles.bookBtn}
          whileTap={{ scale: 0.96 }}
          disabled={slotsLeft === 0}
          aria-label={`Book ${title}`}
        >
          Book Now
        </motion.button>
      </div>
    </GlassCard>
  );
}
