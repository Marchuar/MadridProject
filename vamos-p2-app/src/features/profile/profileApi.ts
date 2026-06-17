import type { Budget, Interest, StayDuration, UserProfile } from '../../shared/types/user';

function getRestUrl() {
  return window.vamosp2Config?.restUrl ?? '/wp-json/';
}

function getNonce() {
  return window.vamosp2Config?.nonce ?? '';
}

export async function apiGetProfile(): Promise<UserProfile> {
  const res = await fetch(`${getRestUrl()}vamos-p2/v1/profile`, {
    headers: { 'X-WP-Nonce': getNonce() },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load profile');
  const data = await res.json();
  return {
    age: data.p2_age ? Number(data.p2_age) : undefined,
    nationality: data.p2_nationality ?? '',
    budget: (data.p2_budget as Budget) ?? undefined,
    stayDuration: (data.p2_stay_duration as StayDuration) ?? undefined,
    interests: (data.p2_interests as Interest[]) ?? [],
  };
}

export async function apiSaveProfile(profile: UserProfile): Promise<void> {
  const res = await fetch(`${getRestUrl()}vamos-p2/v1/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': getNonce(),
    },
    credentials: 'include',
    body: JSON.stringify({
      p2_age: profile.age,
      p2_nationality: profile.nationality,
      p2_budget: profile.budget,
      p2_stay_duration: profile.stayDuration,
      p2_interests: profile.interests,
    }),
  });
  if (!res.ok) throw new Error('Failed to save profile');
}
