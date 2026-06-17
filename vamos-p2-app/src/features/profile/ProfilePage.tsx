import { useEffect, useState } from 'react';
import { Save, User, Settings, Star } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../../shared/components/Toast/Toast';
import { Button } from '../../shared/components/Button/Button';
import { FormField } from '../../shared/components/FormField/FormField';
import { apiGetProfile, apiSaveProfile } from './profileApi';
import type { Budget, Interest, StayDuration, UserProfile } from '../../shared/types/user';
import styles from './ProfilePage.module.css';

const INTERESTS: { value: Interest; label: string }[] = [
  { value: 'flamenco',          label: 'Flamenco' },
  { value: 'city_tour',         label: 'City Tours' },
  { value: 'museum',            label: 'Museums' },
  { value: 'day_trip',          label: 'Day Trips' },
  { value: 'tardeo',            label: 'Tardeos' },
  { value: 'cooking_class',     label: 'Cooking Classes' },
  { value: 'language_exchange', label: 'Language Exchange' },
  { value: 'football',          label: 'Football' },
];

const BUDGET_OPTIONS: { value: Budget; label: string; desc: string }[] = [
  { value: 'low',    label: 'Budget',   desc: '< €20 / activity' },
  { value: 'medium', label: 'Mid-range', desc: '€20 – €60' },
  { value: 'high',   label: 'Premium',  desc: '> €60' },
];

const STAY_OPTIONS: { value: StayDuration; label: string }[] = [
  { value: '1_week',          label: '1 week' },
  { value: '2_weeks',         label: '2 weeks' },
  { value: '1_month',         label: '1 month' },
  { value: '3_plus_months',   label: '3+ months' },
];

const NATIONALITIES = [
  'American', 'British', 'Canadian', 'Chinese', 'Dutch', 'French', 'German',
  'Indian', 'Italian', 'Japanese', 'Korean', 'Mexican', 'Polish', 'Portuguese',
  'Russian', 'Spanish', 'Swedish', 'Turkish', 'Ukrainian', 'Other',
];

export function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile>({ interests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiGetProfile()
      .then(p => setProfile(p))
      .catch(() => { /* use empty default */ })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleInterest = (interest: Interest) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiSaveProfile(profile);
      showToast('Profile saved successfully!', 'success');
    } catch {
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading} aria-label="Loading profile">
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  const initials = user?.displayName.charAt(0).toUpperCase() ?? '?';

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>Manage your info and activity preferences</p>
      </header>

      {/* Avatar + name banner */}
      <div className={styles.profileBanner}>
        <div className={styles.avatarLarge}>{initials}</div>
        <div>
          <p className={styles.displayName}>{user?.displayName ?? 'User'}</p>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
      </div>

      <div className={styles.sections}>
        {/* Section 1 — Personal Info */}
        <section className={styles.section} aria-labelledby="personal-heading">
          <div className={styles.sectionHeader}>
            <User size={18} aria-hidden="true" />
            <h2 id="personal-heading" className={styles.sectionTitle}>Personal Information</h2>
          </div>
          <div className={styles.grid2}>
            <FormField
              label="Age"
              type="number"
              min={16}
              max={120}
              value={profile.age ?? ''}
              onChange={e => setProfile(p => ({ ...p, age: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="Your age"
            />
            <div className={styles.selectField}>
              <label className={styles.selectLabel} htmlFor="nationality">Nationality</label>
              <select
                id="nationality"
                className={styles.select}
                value={profile.nationality ?? ''}
                onChange={e => setProfile(p => ({ ...p, nationality: e.target.value }))}
              >
                <option value="">Select country</option>
                {NATIONALITIES.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.selectField}>
            <label className={styles.selectLabel} htmlFor="stay">Length of stay in Madrid</label>
            <select
              id="stay"
              className={styles.select}
              value={profile.stayDuration ?? ''}
              onChange={e => setProfile(p => ({ ...p, stayDuration: e.target.value as StayDuration || undefined }))}
            >
              <option value="">How long are you staying?</option>
              {STAY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Section 2 — Preferences */}
        <section className={styles.section} aria-labelledby="prefs-heading">
          <div className={styles.sectionHeader}>
            <Star size={18} aria-hidden="true" />
            <h2 id="prefs-heading" className={styles.sectionTitle}>Activity Preferences</h2>
          </div>
          <p className={styles.sectionHint}>Used to personalize your activity recommendations</p>

          <fieldset className={styles.fieldset}>
            <legend className={styles.fieldsetLegend}>Budget per activity</legend>
            <div className={styles.budgetGrid}>
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={[
                    styles.budgetCard,
                    profile.budget === opt.value ? styles.budgetCardActive : '',
                  ].join(' ')}
                  onClick={() => setProfile(p => ({ ...p, budget: opt.value }))}
                  aria-pressed={profile.budget === opt.value}
                >
                  <span className={styles.budgetLabel}>{opt.label}</span>
                  <span className={styles.budgetDesc}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend className={styles.fieldsetLegend}>Interests (select all that apply)</legend>
            <div className={styles.tagGrid}>
              {INTERESTS.map(({ value, label }) => {
                const selected = profile.interests.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    className={[styles.tag, selected ? styles.tagActive : ''].join(' ')}
                    onClick={() => toggleInterest(value)}
                    aria-pressed={selected}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        {/* Section 3 — Account */}
        <section className={styles.section} aria-labelledby="account-heading">
          <div className={styles.sectionHeader}>
            <Settings size={18} aria-hidden="true" />
            <h2 id="account-heading" className={styles.sectionTitle}>Account</h2>
          </div>
          <div className={styles.readOnlyField}>
            <span className={styles.readOnlyLabel}>Email</span>
            <span className={styles.readOnlyValue}>{user?.email}</span>
          </div>
          <div className={styles.readOnlyField}>
            <span className={styles.readOnlyLabel}>Username</span>
            <span className={styles.readOnlyValue}>{user?.username}</span>
          </div>
        </section>
      </div>

      <div className={styles.saveBar}>
        <Button size="lg" loading={isSaving} onClick={handleSave}>
          <Save size={18} aria-hidden="true" />
          Save changes
        </Button>
      </div>
    </div>
  );
}
