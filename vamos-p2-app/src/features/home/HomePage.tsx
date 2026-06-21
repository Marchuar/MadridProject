import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowDown, Music2, Building2, MapIcon, Trophy, ChefHat, Moon, Languages, Compass, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { fetchActivities, type Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { ActivityDetailModal } from '../activities/ActivityDetailModal';
import { BookingFlow } from '../booking/BookingFlow';
import { TextAnimate } from '../../shared/components/MagicUI/TextAnimate';
import { TypingAnimation } from '../../shared/components/MagicUI/TypingAnimation';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getAssetsBase } from '../activities/activityImages';

function CATEGORY_PHOTOS() {
  const b = getAssetsBase();
  return [
    { key: 'flamenco',      label: 'Flamenco',    img: b + '/activities/flamenco.webp',  color: '#E11D48' },
    { key: 'museum',        label: 'Art & Culture',img: b + '/activities/prado.webp',     color: '#7C3AED' },
    { key: 'cooking_class', label: 'Food & Wine',  img: b + '/activities/tapas.webp',     color: '#EA580C' },
    { key: 'day_trip',      label: 'Day Trips',    img: b + '/activities/toledo.webp',    color: '#0C3F75' },
  ];
}

const CAT_ICONS: Record<string, React.ElementType> = {
  flamenco: Music2, museum: Building2, city_tour: MapIcon,
  football: Trophy, cooking_class: ChefHat, tardeo: Moon,
  language_exchange: Languages, day_trip: Compass,
};

const STATS = [
  { value: '200+', label: 'Curated experiences' },
  { value: '8',    label: 'Categories to explore' },
  { value: '50+',  label: 'Local experts' },
];

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [bookingActivity, setBookingActivity] = useState<Activity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const firstName = user?.displayName?.split(' ')[0] ?? '';
  const assetsBase = getAssetsBase();

  const autoplay = useRef(Autoplay({ delay: 3200, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: false },
    [autoplay.current]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetchActivities().then(a => setActivities(a.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[600px] flex items-center overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={assetsBase + '/madrid-evening.jpg'}
            alt="Madrid evening skyline"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 max-w-[1320px] mx-auto px-6 xl:px-10 w-full"
          style={{ opacity: heroOpacity }}
        >
          {firstName && (
            <motion.p
              className="text-white/60 text-xs font-semibold tracking-[0.14em] uppercase mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Buenas, {firstName}
            </motion.p>
          )}

          <h1
            className="font-[Clash_Display] font-black text-white leading-[0.96] mb-6"
            style={{ fontSize: 'clamp(52px, 8vw, 104px)' }}
          >
            <TextAnimate text="Your Madrid" mode="words" delay={0.04} duration={0.5} className="block" />
            <TextAnimate text="Begins Here" mode="words" delay={0.22} duration={0.5} className="block" />
          </h1>

          <div className="flex items-center gap-2 text-white/70 text-[17px] font-medium mb-10 min-h-[1.8em]">
            <span className="text-white/40">Discover</span>
            <TypingAnimation
              texts={['flamenco nights', 'tapas & wine', 'rooftop sunsets', 'history & art', 'football magic', 'cooking classes']}
              className="text-white"
              speed={55}
              pauseDuration={1800}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              className="flex items-center gap-2 h-12 px-8 bg-[#E31E24] text-white font-[Clash_Display] font-black text-[14px] tracking-wide hover:bg-[#C91018] transition-colors rounded-[6px]"
              onClick={() => navigate('/activities')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore activities <ArrowRight size={15} />
            </motion.button>
            <motion.button
              className="h-12 px-8 border border-white/40 text-white font-medium text-[14px] hover:border-white/80 hover:bg-white/8 transition-all rounded-[6px]"
              onClick={() => navigate('/recommendations')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
            >
              Pick for me
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-[11px] font-medium tracking-[0.1em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span>Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-[#E5E5E3] bg-white">
        <div className="max-w-[1320px] mx-auto px-6 xl:px-10 py-8 grid grid-cols-3 divide-x divide-[#E5E5E3]">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="px-6 first:pl-0 last:pr-0 text-center"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="font-[Clash_Display] font-black text-[36px] text-[#E31E24] leading-none mb-1">{value}</div>
              <div className="text-[13px] text-[#6B7280] font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── EXPLORE BY CATEGORY ── */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]">
        <div className="max-w-[1320px] mx-auto px-6 xl:px-10">
          <div className="mb-12">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E31E24] mb-3">What we offer</p>
            <h2 className="font-[Clash_Display] font-black text-[#111827] leading-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
              Explore Madrid<br />your way
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORY_PHOTOS().map(({ key, label, img, color }, i) => (
              <motion.button
                key={key}
                className="relative group overflow-hidden text-left cursor-pointer rounded-[10px]"
                style={{ aspectRatio: '3/4' }}
                onClick={() => navigate('/activities?category=' + key)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                aria-label={`Browse ${label}`}
              >
                <img
                  src={img}
                  alt={label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-1 h-5 mb-2" style={{ background: color }} />
                  <span className="block font-[Clash_Display] font-black text-white text-[17px] leading-tight">
                    {label}
                  </span>
                  <span className="flex items-center gap-1 text-white/60 text-[12px] font-medium mt-1.5 group-hover:text-white/90 transition-colors">
                    Browse <ArrowRight size={11} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S HAPPENING ── */}
      {activities.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-[1320px] mx-auto px-6 xl:px-10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#E31E24] mb-3">Coming up</p>
                <h2 className="font-[Clash_Display] font-black text-[#111827] leading-tight"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
                  What's on in Madrid
                </h2>
              </div>
              <button
                onClick={() => navigate('/activities')}
                className="hidden md:flex items-center gap-1.5 text-[13.5px] font-semibold text-[#E31E24] hover:opacity-70 transition-opacity"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((a, i) => {
                const img = getActivityImage(a.title, a.category, a.imageUrl || undefined);
                const Icon = CAT_ICONS[a.category] ?? Compass;
                const dateObj = new Date(a.date);
                const dateStr = isNaN(dateObj.getTime())
                  ? a.date
                  : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                return (
                  <motion.article
                    key={a.id}
                    className="group cursor-pointer rounded-[10px] overflow-hidden border border-[#EAEAE8] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => { setSelectedActivity(a); setDetailOpen(true); }}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && (() => { setSelectedActivity(a); setDetailOpen(true); })()}
                    aria-label={`View ${a.title}`}
                  >
                    {/* Photo */}
                    <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={img}
                        alt={a.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 px-2.5 py-1">
                        <Icon size={11} style={{ color: '#E31E24' }} />
                        <span className="text-[11px] font-semibold text-[#111827] uppercase tracking-[0.06em]">
                          {a.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      {a.slotsLeft === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-[Clash_Display] font-black text-sm tracking-widest uppercase">Sold Out</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-[Clash_Display] font-black text-[#111827] text-[17px] leading-snug mb-2 group-hover:text-[#E31E24] transition-colors">
                        {a.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[12px] text-[#9CA3AF] mb-3">
                        {dateStr && (
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {dateStr}
                          </span>
                        )}
                        {a.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {a.location}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-[Clash_Display] font-black text-[20px] text-[#111827]">
                          €{a.price}
                        </span>
                        <span className="text-[12px] text-[#9CA3AF]">
                          {a.slotsLeft > 0 ? `${a.slotsLeft} spots left` : 'Sold out'}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-10 flex md:hidden">
              <button
                onClick={() => navigate('/activities')}
                className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#E31E24] hover:opacity-70 transition-opacity"
              >
                View all activities <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── DISCOVER STRIP ── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <img
          src={assetsBase + '/el-retiro.avif'}
          alt="El Retiro park"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#07294D]/80" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 xl:px-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-5">
              Personalized for you
            </p>
            <h2
              className="font-[Clash_Display] font-black text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}
            >
              Not sure where to start?
            </h2>
            <p className="text-white/65 text-[16px] leading-relaxed mb-8 max-w-sm">
              Tell us what you love — we'll pick the best activities in Madrid that match your interests and budget.
            </p>
            <motion.button
              className="flex items-center gap-2 h-12 px-8 bg-white text-[#111827] font-[Clash_Display] font-black text-[14px] tracking-wide hover:bg-white/90 transition-colors"
              onClick={() => navigate('/recommendations')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get my picks <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── PHOTO CAROUSEL ── */}
      <section className="py-16 bg-[#FAFAF8]">
        <div className="max-w-[1320px] mx-auto px-6 xl:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-1">Madrid through our lens</p>
              <h2 className="font-[Clash_Display] font-black text-[#111827] text-[22px]">The city, captured</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border border-[#E5E5E3] bg-white flex items-center justify-center text-[#111827] hover:bg-[#FAFAF8] transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full border border-[#E5E5E3] bg-white flex items-center justify-center text-[#111827] hover:bg-[#FAFAF8] transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Embla: использует pl на слайдах вместо gap — так loop работает без швов */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex" style={{ marginLeft: '-16px' }}>
              {[
                { src: assetsBase + '/madrid-evening.jpg',         label: 'Gran Vía at sunset' },
                { src: assetsBase + '/activities/flamenco.webp',   label: 'Flamenco night' },
                { src: assetsBase + '/activities/bernabeu.webp',   label: 'Santiago Bernabéu' },
                { src: assetsBase + '/activities/malasana.webp',   label: 'Malasaña streets' },
                { src: assetsBase + '/activities/prado.webp',      label: 'Prado Museum' },
                { src: assetsBase + '/activities/churros.webp',    label: 'Churros & chocolate' },
                { src: assetsBase + '/activities/reina_sofia.webp',label: 'Reina Sofía' },
                { src: assetsBase + '/activities/retiro.webp',     label: 'El Retiro park' },
              ].map(({ src, label }) => (
                <div
                  key={src}
                  className="flex-shrink-0 min-w-0"
                  style={{ paddingLeft: '16px', width: 'clamp(220px, 22vw, 300px)' }}
                >
                  <div
                    className="relative overflow-hidden rounded-[10px] group"
                    style={{ aspectRatio: '3/4' }}
                  >
                    <img
                      src={src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-4 left-4 text-white text-[13px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-[#E31E24] py-20">
        <div className="max-w-[1320px] mx-auto px-6 xl:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="font-[Clash_Display] font-black text-white leading-tight mb-2"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)' }}
            >
              Ready to discover Madrid?
            </h2>
            <p className="text-white/65 text-[15px]">Join thousands of visitors who found their perfect Madrid experience.</p>
          </div>
          <motion.button
            className="flex items-center gap-2 h-12 px-8 bg-white text-[#E31E24] font-[Clash_Display] font-black text-[14px] tracking-wide flex-shrink-0 hover:bg-white/90 transition-colors"
            onClick={() => navigate('/activities')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Browse all activities <ArrowRight size={15} />
          </motion.button>
        </div>
      </section>

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
