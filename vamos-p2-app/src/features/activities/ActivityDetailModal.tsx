import { Modal } from 'antd';
import { motion } from 'motion/react';
import { MapPin, Clock, Users, Heart, X, ArrowRight } from 'lucide-react';
import type { Activity } from './activitiesApi';
import { getActivityImage } from './activityImages';
import { useUserActivities } from '../../shared/store/userActivitiesStore';
import styles from './ActivityDetailModal.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  flamenco: 'Flamenco', museum: 'Museum', city_tour: 'City Tour',
  football: 'Football', cooking_class: 'Cooking', tardeo: 'Tardeo',
  language_exchange: 'Language Exchange', day_trip: 'Day Trip',
};
const CAT_COLORS: Record<string, string> = {
  flamenco: '#E11D48', museum: '#7C3AED', city_tour: '#2563EB',
  football: '#16A34A', cooking_class: '#EA580C', tardeo: '#9333EA',
  language_exchange: '#0891B2', day_trip: '#D97706',
};

interface ActivityDetailModalProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onBook: (activity: Activity) => void;
}

export function ActivityDetailModal({ activity, open, onClose, onBook }: ActivityDetailModalProps) {
  const { toggleLike, isLiked } = useUserActivities();

  if (!activity) return null;

  const { title, category, date, location, price, slotsLeft, slotsTotal, description, imageUrl } = activity;
  const liked = isLiked(activity.id);
  const img = getActivityImage(title, category, imageUrl || undefined);
  const catColor = CAT_COLORS[category] ?? '#E31E24';

  const dateObj = new Date(date);
  const dateStr = isNaN(dateObj.getTime()) ? date
    : dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = isNaN(dateObj.getTime()) ? ''
    : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const slotsRatio = slotsTotal > 0 ? slotsLeft / slotsTotal : 0;
  const slotsPct = Math.round(slotsRatio * 100);
  const slotsColor = slotsRatio > 0.4 ? 'var(--color-success)' : slotsRatio > 0.15 ? 'var(--color-warning)' : 'var(--color-error)';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      closeIcon={null}
      className={styles.modal}
      styles={{ body: { padding: 0 }, mask: { backdropFilter: 'blur(4px)' } }}
    >
      <div className={styles.inner}>
        {/* Hero image */}
        <div className={styles.hero}>
          <img src={img} alt={title} className={styles.heroImg} />
          <div className={styles.heroOverlay} />

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>

          <motion.button
            className={[styles.likeBtn, liked ? styles.likeBtnActive : ''].join(' ')}
            onClick={() => toggleLike(activity.id)}
            whileTap={{ scale: 1.25 }}
            aria-label={liked ? 'Unlike' : 'Save'}
            aria-pressed={liked}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </motion.button>

          <div className={styles.heroBadge} style={{ background: catColor }}>
            {CATEGORY_LABELS[category] ?? category}
          </div>

          <div className={styles.heroPrice}>€{price} per person</div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>

          <div className={styles.metaRow}>
            {(dateStr || timeStr) && (
              <div className={styles.metaItem}>
                <Clock size={15} color={catColor} />
                <span>{dateStr}{timeStr ? ` at ${timeStr}` : ''}</span>
              </div>
            )}
            {location && (
              <div className={styles.metaItem}>
                <MapPin size={15} color={catColor} />
                <span>{location}</span>
              </div>
            )}
          </div>

          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {/* Slot availability */}
          <div className={styles.slotsSection}>
            <div className={styles.slotsHeader}>
              <Users size={15} color={slotsColor} />
              <span style={{ color: slotsColor, fontWeight: 600 }}>
                {slotsLeft > 0 ? `${slotsLeft} of ${slotsTotal} spots available` : 'Sold out'}
              </span>
            </div>
            {slotsLeft > 0 && (
              <div className={styles.slotsBar}>
                <div className={styles.slotsBarFill} style={{ width: `${slotsPct}%`, background: slotsColor }} />
              </div>
            )}
          </div>

          {/* CTA */}
          <div className={styles.ctas}>
            <motion.button
              className={styles.bookBtn}
              disabled={slotsLeft === 0}
              onClick={() => onBook(activity)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {slotsLeft > 0 ? 'Book This Activity' : 'Sold Out'}
              {slotsLeft > 0 && <ArrowRight size={18} />}
            </motion.button>

            <motion.button
              className={[styles.likeFullBtn, liked ? styles.likeFullBtnActive : ''].join(' ')}
              onClick={() => toggleLike(activity.id)}
              whileTap={{ scale: 0.97 }}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              {liked ? 'Saved' : 'Save for later'}
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
