import { useState } from 'react';
import { Modal, Steps, DatePicker, ConfigProvider } from 'antd';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Users, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import type { Activity } from '../activities/activitiesApi';
import { getActivityImage } from '../activities/activityImages';
import { useUserActivities, type BookedEntry } from '../../shared/store/userActivitiesStore';
import styles from './BookingFlow.module.css';

const PEOPLE_OPTIONS = [
  { value: 1, label: 'Solo', sub: 'Just you' },
  { value: 2, label: 'Duo', sub: '2 people' },
  { value: 3, label: 'Trio', sub: '3 people' },
  { value: 4, label: 'Group', sub: '4+ people' },
];

interface BookingFlowProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

export function BookingFlow({ activity, open, onClose, onBack }: BookingFlowProps) {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { addBooking } = useUserActivities();

  if (!activity) return null;

  const img = getActivityImage(activity.title, activity.category, activity.imageUrl || undefined);
  const totalPrice = activity.price * selectedPeople;

  const handleConfirm = async () => {
    if (!selectedDate) return;
    setIsConfirming(true);
    await new Promise(r => setTimeout(r, 1200));
    const entry: BookedEntry = {
      activityId: activity.id,
      activityTitle: activity.title,
      date: selectedDate.format('YYYY-MM-DD'),
      time: '19:00',
      people: selectedPeople,
      totalPrice,
      bookedAt: new Date().toISOString(),
      imageSlug: img,
    };
    addBooking(entry);
    setIsConfirming(false);
    setConfirmed(true);
  };

  const handleClose = () => {
    setStep(0);
    setSelectedDate(null);
    setSelectedPeople(1);
    setConfirmed(false);
    onClose();
  };

  const stepItems = [
    { title: 'Date', icon: <Calendar size={14} /> },
    { title: 'People', icon: <Users size={14} /> },
    { title: 'Confirm', icon: <CheckCircle size={14} /> },
  ];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={540}
      centered
      closeIcon={null}
      className={styles.modal}
      styles={{ body: { padding: 0 }, mask: { backdropFilter: 'blur(4px)' } }}
    >
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.activityMini}>
            <img src={img} alt={activity.title} className={styles.miniThumb} />
            <div>
              <p className={styles.miniTitle}>{activity.title}</p>
              <p className={styles.miniPrice}>€{activity.price} / person</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">✕</button>
        </div>

        {!confirmed ? (
          <>
            {/* Steps indicator */}
            <div className={styles.stepsWrap}>
              <Steps
                current={step}
                size="small"
                items={stepItems}
                className={styles.steps}
              />
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className={styles.stepContent}
              >
                {/* Step 0: Date */}
                {step === 0 && (
                  <div className={styles.dateStep}>
                    <h3 className={styles.stepTitle}>Choose a date</h3>
                    <p className={styles.stepSub}>When do you want to go?</p>

                    {/* Quick date slots — next 7 days */}
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' }}>
                      {Array.from({ length: 7 }, (_, i) => {
                        const d = dayjs().add(i + 1, 'day');
                        const isSelected = selectedDate?.isSame(d, 'day');
                        return (
                          <motion.button
                            key={i}
                            style={{
                              flexShrink: 0, minWidth: 56, padding: '8px 12px', borderRadius: 12,
                              border: isSelected ? 'none' : '1.5px solid #EAEAE8',
                              background: isSelected ? '#E31E24' : 'white',
                              color: isSelected ? 'white' : '#111827',
                              cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
                            }}
                            onClick={() => setSelectedDate(d)}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              {d.format('ddd')}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'Clash Display, sans-serif' }}>
                              {d.format('D')}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>
                              {d.format('MMM')}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <ConfigProvider theme={{ token: { colorPrimary: '#E31E24' } }}>
                      <DatePicker
                        value={selectedDate}
                        onChange={d => setSelectedDate(d)}
                        disabledDate={d => d.isBefore(dayjs(), 'day')}
                        format="D MMMM YYYY"
                        className={styles.datePicker}
                        size="large"
                        placeholder="Or pick a custom date"
                        allowClear={false}
                      />
                    </ConfigProvider>
                  </div>
                )}

                {/* Step 1: People — stepper + quick presets */}
                {step === 1 && (
                  <div className={styles.peopleStep}>
                    <h3 className={styles.stepTitle}>How many people?</h3>
                    <p className={styles.stepSub}>€{activity.price} × {selectedPeople} = <strong>€{totalPrice}</strong></p>

                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
                      <motion.button
                        style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #EAEAE8', background: 'white', fontSize: 24, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: selectedPeople <= 1 ? 'not-allowed' : 'pointer', opacity: selectedPeople <= 1 ? 0.4 : 1 }}
                        onClick={() => setSelectedPeople(p => Math.max(1, p - 1))}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedPeople <= 1}
                      >−</motion.button>
                      <span style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: 900, fontSize: 48, color: '#111827', minWidth: 60, textAlign: 'center', lineHeight: 1 }}>
                        {selectedPeople}
                      </span>
                      <motion.button
                        style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #EAEAE8', background: 'white', fontSize: 24, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: selectedPeople >= 50 ? 'not-allowed' : 'pointer', opacity: selectedPeople >= 50 ? 0.4 : 1 }}
                        onClick={() => setSelectedPeople(p => Math.min(50, p + 1))}
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedPeople >= 50}
                      >+</motion.button>
                    </div>

                    {/* Quick preset chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                      {[1, 2, 3, 4, 6, 8, 10, 12, 15, 20].map(n => (
                        <motion.button
                          key={n}
                          style={{
                            height: 34, minWidth: 40, padding: '0 12px', borderRadius: 9999,
                            border: selectedPeople === n ? 'none' : '1.5px solid #EAEAE8',
                            background: selectedPeople === n ? '#E31E24' : 'white',
                            color: selectedPeople === n ? 'white' : '#5F6B7A',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                          }}
                          onClick={() => setSelectedPeople(n)}
                          whileTap={{ scale: 0.95 }}
                        >
                          {n}
                        </motion.button>
                      ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>Use +/− for any number up to 50</p>
                  </div>
                )}

                {/* Step 2: Confirm */}
                {step === 2 && (
                  <div className={styles.confirmStep}>
                    <h3 className={styles.stepTitle}>Confirm your booking</h3>
                    <div className={styles.confirmCard}>
                      <img src={img} alt={activity.title} className={styles.confirmImg} />
                      <div className={styles.confirmDetails}>
                        <p className={styles.confirmActivity}>{activity.title}</p>
                        <div className={styles.confirmRow}>
                          <Calendar size={14} color="var(--color-navy)" />
                          <span>{selectedDate?.format('D MMMM YYYY')}</span>
                        </div>
                        <div className={styles.confirmRow}>
                          <Users size={14} color="var(--color-navy)" />
                          <span>{selectedPeople} {selectedPeople === 1 ? 'person' : 'people'}</span>
                        </div>
                        <div className={styles.confirmTotal}>
                          Total: <strong>€{totalPrice}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className={styles.navBtns}>
              {step > 0 ? (
                <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <button className={styles.backBtn} onClick={onBack}>
                  <ArrowLeft size={16} /> Details
                </button>
              )}

              {step < 2 ? (
                <motion.button
                  className={styles.nextBtn}
                  disabled={step === 0 && !selectedDate}
                  onClick={() => setStep(s => s + 1)}
                  whileTap={{ scale: 0.97 }}
                >
                  Next <ArrowRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  className={styles.confirmBtn}
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  whileTap={{ scale: 0.97 }}
                >
                  {isConfirming ? 'Booking...' : 'Confirm Booking'}
                  {!isConfirming && <CheckCircle size={16} />}
                </motion.button>
              )}
            </div>
          </>
        ) : (
          /* Success screen */
          <motion.div
            className={styles.successScreen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className={styles.successIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
            >
              <CheckCircle size={52} color="var(--color-success)" />
            </motion.div>
            <h2 className={styles.successTitle}>¡Reservado!</h2>
            <p className={styles.successSub}>
              <strong>{activity.title}</strong> on {selectedDate?.format('D MMMM')} is booked for {selectedPeople} {selectedPeople === 1 ? 'person' : 'people'}.
            </p>
            <p className={styles.successHint}>Check your calendar to see your upcoming activities.</p>
            <button className={styles.successClose} onClick={handleClose}>
              Done
            </button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
