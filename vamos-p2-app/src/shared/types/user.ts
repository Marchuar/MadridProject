export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export type Budget = 'low' | 'medium' | 'high';
export type StayDuration = '1_week' | '2_weeks' | '1_month' | '3_plus_months';

export type Interest =
  | 'flamenco'
  | 'city_tour'
  | 'museum'
  | 'day_trip'
  | 'tardeo'
  | 'cooking_class'
  | 'language_exchange'
  | 'football';

export interface UserProfile {
  age?: number;
  nationality?: string;
  budget?: Budget;
  stayDuration?: StayDuration;
  interests: Interest[];
}

export interface AuthState {
  user: User | null;
  nonce: string;
  isLoggedIn: boolean;
}
