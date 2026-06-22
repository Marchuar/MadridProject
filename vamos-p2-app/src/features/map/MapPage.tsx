import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { getActivityCoords } from '../activities/activityCoords';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import styles from './MapPage.module.css';

const CAT_COLORS: Record<string, string> = {
  flamenco: '#E11D48', museum: '#7C3AED', city_tour: '#2563EB',
  football: '#16A34A', cooking_class: '#EA580C', tardeo: '#9333EA',
  language_exchange: '#0891B2', day_trip: '#D97706',
};
const CAT_LABELS: Record<string, string> = {
  flamenco: 'Flamenco', museum: 'Museum', city_tour: 'City Tour',
  football: 'Football', cooking_class: 'Cooking', tardeo: 'Tardeo',
  language_exchange: 'Language', day_trip: 'Day Trip',
};
const FILTERS = [
  { value: '', label: 'All' },
  ...Object.entries(CAT_LABELS).map(([value, label]) => ({ value, label })),
];

// Fix Leaflet's missing default icon in Vite builds
function FixLeaflet() {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  return null;
}

export function MapPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchActivities()
      .then(setActivities)
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filter ? activities.filter(a => a.category === filter) : activities;

  const openDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailOpen(true);
  };

  return (
    <div className={styles.page}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={[styles.filterPill, filter === f.value ? styles.filterPillActive : ''].join(' ')}
            onClick={() => setFilter(f.value)}
          >
            {f.value && <span className={styles.filterDot} style={{ background: CAT_COLORS[f.value] }} />}
            {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className={styles.mapWrap}>
        {isLoading && (
          <div className={styles.mapLoading}>
            <div className={styles.spinner} />
          </div>
        )}

        <MapContainer
          center={[40.4300, -3.6900]}
          zoom={11}
          className={styles.map}
          zoomControl={false}
        >
          <FixLeaflet />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />

          {filtered.map(activity => {
            const coords = getActivityCoords(activity.title, activity.category, activity.location);
            const color = CAT_COLORS[activity.category] ?? '#E31E24';
            const img = getActivityImage(activity.title, activity.category, activity.imageUrl || undefined);

            return (
              <CircleMarker
                key={activity.id}
                center={[coords.lat, coords.lng]}
                radius={10}
                pathOptions={{
                  color: 'white',
                  weight: 2.5,
                  fillColor: color,
                  fillOpacity: 0.92,
                }}
                eventHandlers={{}}
              >
                <Popup className={styles.popup} maxWidth={260} closeButton={false}>
                  <div className={styles.popupCard}>
                    <img src={img} alt={activity.title} className={styles.popupImg} />
                    <div className={styles.popupBody}>
                      <span className={styles.popupBadge} style={{ background: color }}>
                        {CAT_LABELS[activity.category] ?? activity.category}
                      </span>
                      <p className={styles.popupTitle}>{activity.title}</p>
                      {coords.address && <p className={styles.popupAddr}>{coords.address}</p>}
                      <div className={styles.popupFooter}>
                        <span className={styles.popupPrice}>€{activity.price}</span>
                        <button className={styles.popupBtn} onClick={() => openDetail(activity)}>
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

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
