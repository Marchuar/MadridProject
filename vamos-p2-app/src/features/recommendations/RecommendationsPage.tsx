import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Heart, MapPin, Clock, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { apiGetProfile } from '../profile/profileApi';
import { scoreActivities, type ScoredActivity } from './recommendationsLogic';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import { useUserActivities } from '../../shared/store/userActivitiesStore';

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

export function RecommendationsPage() {
  const { user } = useAuth();
  const [picks, setPicks] = useState<ScoredActivity[]>([]);
  const [profileEmpty, setProfileEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { toggleLike, isLiked } = useUserActivities();

  useEffect(() => {
    if (!user) return;
    apiGetProfile()
      .then(profile => {
        if (!profile.budget && profile.interests.length === 0) {
          setProfileEmpty(true);
          setIsLoading(false);
          return;
        }
        fetchActivities()
          .then(activities => setPicks(scoreActivities(activities, profile)))
          .catch(e => setError(e instanceof Error ? e.message : 'Could not load recommendations'))
          .finally(() => setIsLoading(false));
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : 'Could not load recommendations');
        setIsLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Page header */}
      <div className="border-b border-[#E5E5E3] bg-white px-8 md:px-12 py-10">
        <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E31E24] mb-3">Personalised</p>
        <h1 className="font-[Clash_Display] font-black text-[#111827] leading-none mb-2"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
          For You
        </h1>
        <p className="text-[14px] text-[#9CA3AF]">Picked based on your interests and budget</p>
      </div>

      <div className="px-8 md:px-12 py-10">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-[10px] border border-[#EAEAE8] overflow-hidden animate-pulse">
                <div className="h-52 bg-[#F4F4F2]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 bg-[#F4F4F2] rounded w-3/4" />
                  <div className="h-3 bg-[#F4F4F2] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && profileEmpty && (
          <div className="border border-[#E5E5E3] rounded-[10px] p-12 flex flex-col items-center gap-4 text-center max-w-sm mx-auto mt-8">
            <Sparkles size={32} color="#E31E24" />
            <p className="font-[Clash_Display] font-black text-[#111827] text-xl">Complete your profile</p>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">Add your interests and budget so we can pick the best activities for you.</p>
            <Link
              to="/profile"
              className="mt-2 inline-flex items-center gap-2 h-10 px-6 bg-[#E31E24] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#C91018] transition-colors"
            >
              Go to Profile <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {!isLoading && !profileEmpty && error && (
          <div className="border border-[#E5E5E3] rounded-[10px] p-10 text-center text-[#9CA3AF] text-sm">{error}</div>
        )}

        {!isLoading && !profileEmpty && !error && picks.length === 0 && (
          <div className="border border-[#E5E5E3] rounded-[10px] p-12 flex flex-col items-center gap-4 text-center max-w-sm mx-auto mt-8">
            <Sparkles size={32} color="#E31E24" />
            <p className="font-[Clash_Display] font-black text-[#111827] text-xl">Nothing yet</p>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">Complete your profile — add interests and budget — and we'll find the best activities for you.</p>
          </div>
        )}

        {!isLoading && !profileEmpty && !error && picks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {picks.map(({ activity, reasons }, i) => {
              const img = getActivityImage(activity.title, activity.category, activity.imageUrl || undefined);
              const catColor = CAT_COLORS[activity.category] ?? '#E31E24';
              const catLabel = CAT_LABELS[activity.category] ?? activity.category;
              const liked = isLiked(activity.id);

              const dateObj = new Date(activity.date);
              const dateStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
              const timeStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.article
                  key={activity.id}
                  className="bg-white rounded-[10px] border border-[#EAEAE8] overflow-hidden cursor-pointer group flex flex-col shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
                  onClick={() => { setSelectedActivity(activity); setDetailOpen(true); }}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && (() => { setSelectedActivity(activity); setDetailOpen(true); })()}
                  aria-label={`View ${activity.title}`}
                >
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <img
                      src={img}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Rank badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className="text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-[0.08em] rounded-[4px]"
                        style={{ background: catColor }}
                      >
                        {catLabel}
                      </span>
                      <span className="bg-black/60 text-white text-[10px] font-black px-2 py-0.5 rounded-[4px]">
                        #{i + 1}
                      </span>
                    </div>

                    {/* Like button */}
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                      onClick={e => { e.stopPropagation(); toggleLike(activity.id); }}
                      aria-label={liked ? 'Unlike' : 'Like'}
                    >
                      <Heart size={14} color={liked ? '#E31E24' : '#9CA3AF'} fill={liked ? '#E31E24' : 'none'} />
                    </button>

                    {/* Price bottom right */}
                    <span className="absolute bottom-3 right-3 bg-black/65 text-white font-[Clash_Display] font-black text-[13px] px-2.5 py-0.5 rounded-[4px]">
                      €{activity.price}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="font-[Clash_Display] font-black text-[#111827] text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#E31E24] transition-colors">
                      {activity.title}
                    </h2>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9CA3AF] mb-3">
                      {(dateStr || timeStr) && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {dateStr}{timeStr ? ` · ${timeStr}` : ''}
                        </span>
                      )}
                      {activity.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {activity.location}
                        </span>
                      )}
                    </div>

                    {/* Match tags */}
                    {reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {reasons.slice(0, 3).map(r => (
                          <span key={r} className="text-[10px] bg-[#FEF2F2] text-[#E31E24] font-semibold px-2 py-0.5 rounded-[4px] uppercase tracking-[0.06em]">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#EAEAE8]">
                      <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                        <Users size={11} />
                        <span>{activity.slotsLeft > 0 ? `${activity.slotsLeft} spots left` : 'Sold out'}</span>
                      </div>
                      <button
                        className="flex items-center gap-1.5 h-8 px-4 bg-[#E31E24] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#C91018] transition-colors"
                        onClick={e => { e.stopPropagation(); setSelectedActivity(activity); setDetailOpen(true); }}
                        disabled={activity.slotsLeft === 0}
                      >
                        Book <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
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
