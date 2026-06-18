export interface Activity {
  id: number;
  title: string;
  category: string;
  date: string;
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
  const url = new URL(`${getRestUrl()}vamos-p2/v1/activities`);
  if (category) url.searchParams.set('category', category);
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load activities');
  return res.json() as Promise<Activity[]>;
}
