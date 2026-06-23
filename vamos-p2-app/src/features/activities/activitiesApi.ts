export interface Activity {
  id: number;
  title: string;
  category: string;
  date: string;
  availableDates?: string[];
  location: string;
  price: number;
  slotsLeft: number;
  slotsTotal: number;
  imageUrl: string;
  description: string;
}

function getRestUrl(): string {
  return window.vamosp2Config?.restUrl ?? '/wp-json/';
}

export async function fetchActivities(category?: string): Promise<Activity[]> {
  const base = `${getRestUrl()}vamos-p2/v1/activities`;
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${base}${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load activities');
  return res.json() as Promise<Activity[]>;
}
