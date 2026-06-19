import type { User } from '../../shared/types/user';

interface LoginResult { userId: number; displayName: string; nonce: string; }
interface RegisterResult { userId: number; nonce: string; }

function getRestUrl() { return window.vamosp2Config?.restUrl ?? '/wp-json/'; }

// ── Dev mode (localhost without WP) ──────────────────────────────────────────
const IS_DEV = import.meta.env.DEV && !window.location.hostname.includes('vamosmadrid');

const DEV_USER: User = { id: 99, username: 'testuser', email: 'test@vamosmadrid.dev', displayName: 'Alex Morales' };
const DEV_ACTIVITIES = [
  { id: 1, title: 'Flamenco Show', category: 'flamenco', date: '2026-07-05T20:00:00', location: 'Tablao Villa Rosa, Centro', price: 25, slotsLeft: 8, slotsTotal: 20, imageUrl: '', description: 'Experience authentic flamenco dancing and live guitar in a traditional tablao. An unmissable slice of Spanish culture.' },
  { id: 2, title: 'Prado Museum Tour', category: 'museum', date: '2026-07-06T10:00:00', location: 'Paseo del Prado, 28014', price: 12, slotsLeft: 15, slotsTotal: 30, imageUrl: '', description: 'Guided tour through Spain\'s greatest art museum. See Velázquez, Goya and El Greco up close.' },
  { id: 3, title: 'Tapas Tour Malasaña', category: 'cooking_class', date: '2026-07-07T19:00:00', location: 'Malasaña neighborhood', price: 18, slotsLeft: 3, slotsTotal: 15, imageUrl: '', description: 'Walking tapas route through Malasaña\'s best bars. Four stops, four classic dishes, one unforgettable evening.' },
  { id: 4, title: 'Rooftop Sunset Bar', category: 'tardeo', date: '2026-07-08T19:30:00', location: 'Gran Vía, Madrid Centro', price: 15, slotsLeft: 10, slotsTotal: 25, imageUrl: '', description: 'Watch the Madrid sunset from a stunning rooftop bar with panoramic views over the city skyline.' },
  { id: 5, title: 'Bernabéu Stadium Tour', category: 'football', date: '2026-07-09T11:00:00', location: 'Av. Concha Espina, Chamartín', price: 22, slotsLeft: 20, slotsTotal: 40, imageUrl: '', description: 'Behind-the-scenes access to the legendary Santiago Bernabéu — dressing rooms, pitch and trophy room.' },
  { id: 6, title: 'Retiro Park & Drinks', category: 'day_trip', date: '2026-07-10T17:00:00', location: 'Parque del Retiro, 28009', price: 8, slotsLeft: 2, slotsTotal: 20, imageUrl: '', description: 'Evening stroll through Madrid\'s most beautiful park, finishing with drinks by the lake at sunset.' },
  { id: 7, title: 'Escape Room Adventure', category: 'tardeo', date: '2026-07-11T18:00:00', location: 'Centro Madrid', price: 14, slotsLeft: 6, slotsTotal: 12, imageUrl: '', description: 'Solve puzzles and escape before the clock runs out — perfect for groups and team building.' },
  { id: 8, title: 'Malasaña Neighbourhood Walk', category: 'city_tour', date: '2026-07-12T11:00:00', location: 'Plaza del Dos de Mayo', price: 10, slotsLeft: 12, slotsTotal: 20, imageUrl: '', description: 'Discover the bohemian streets, street art and indie shops of Madrid\'s coolest neighborhood.' },
  { id: 9, title: 'Toledo Day Trip', category: 'day_trip', date: '2026-07-13T09:00:00', location: 'Toledo (45 min from Madrid)', price: 35, slotsLeft: 8, slotsTotal: 25, imageUrl: '', description: 'Day trip to the medieval city of Toledo — three cultures, one spectacular hilltop panorama.' },
  { id: 10, title: 'Bowling Night Chamartín', category: 'tardeo', date: '2026-07-14T20:00:00', location: 'Chamartín, 28036 Madrid', price: 12, slotsLeft: 14, slotsTotal: 24, imageUrl: '', description: 'Chill bowling night at Chamartín. Fun for everyone — no bowling experience required!' },
  { id: 11, title: 'Mercado de San Miguel', category: 'cooking_class', date: '2026-07-15T12:00:00', location: 'Plaza de San Miguel, Centro', price: 20, slotsLeft: 0, slotsTotal: 16, imageUrl: '', description: 'Guided tasting tour of Madrid\'s iconic iron-and-glass food market. Pintxos, wine and jamón included.' },
  { id: 12, title: 'Reina Sofía Museum', category: 'museum', date: '2026-07-16T10:30:00', location: 'Calle Santa Isabel, 52', price: 14, slotsLeft: 18, slotsTotal: 25, imageUrl: '', description: 'Home to Picasso\'s Guernica. Explore 20th-century Spanish art with a knowledgeable guide.' },
];

let devLoggedIn = sessionStorage.getItem('vamos_dev_auth') === '1';

// In dev mode, mock the fetch for WP endpoints
if (IS_DEV) {
  // Auto-inject WP config so App.tsx treats user as logged in when session exists
  if (!window.vamosp2Config) {
    window.vamosp2Config = { restUrl: '/wp-json/', nonce: 'dev-nonce', userId: devLoggedIn ? DEV_USER.id : 0, isLoggedIn: devLoggedIn };
  }

  const origFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    if (url.includes('/wp-json/') || url.includes('/wp/v2/') || url.includes('/vamos-p2/')) {
      if (url.includes('users/me')) {
        if (!devLoggedIn) return new Response(JSON.stringify({ code: 'rest_not_logged_in' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        return new Response(JSON.stringify({ id: DEV_USER.id, name: DEV_USER.displayName, slug: DEV_USER.username, email: DEV_USER.email, avatar_urls: {} }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.includes('/vamos-p2/v1/login')) {
        const body = JSON.parse((init?.body as string) ?? '{}');
        if ((body.username === 'testuser' || body.username === 'test@vamosmadrid.dev') && body.password === 'test123') {
          devLoggedIn = true;
          sessionStorage.setItem('vamos_dev_auth', '1');
          return new Response(JSON.stringify({ userId: DEV_USER.id, displayName: DEV_USER.displayName, nonce: 'dev-nonce' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ message: 'Wrong credentials. Use testuser / test123' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.includes('/vamos-p2/v1/register')) {
        devLoggedIn = true;
        return new Response(JSON.stringify({ userId: DEV_USER.id, nonce: 'dev-nonce' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.includes('/vamos-p2/v1/logout')) {
        devLoggedIn = false;
        sessionStorage.removeItem('vamos_dev_auth');
        return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.includes('/vamos-p2/v1/activities')) {
        const urlObj = new URL(url, window.location.href);
        const cat = urlObj.searchParams.get('category');
        const result = cat ? DEV_ACTIVITIES.filter(a => a.category === cat) : DEV_ACTIVITIES;
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.includes('/vamos-p2/v1/profile')) {
        if ((init?.method ?? 'GET').toUpperCase() === 'PATCH') {
          return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ p2_age: '', p2_nationality: 'German', p2_budget: 'medium', p2_stay_duration: '1_month', p2_interests: 'flamenco,museum,tardeo' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return origFetch(input, init);
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${getRestUrl()}vamos-p2/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Login failed');
  }
  return res.json();
}

export async function apiRegister(username: string, email: string, password: string): Promise<RegisterResult> {
  const res = await fetch(`${getRestUrl()}vamos-p2/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Registration failed');
  }
  return res.json();
}

export async function apiLogout(nonce: string): Promise<void> {
  await fetch(`${getRestUrl()}vamos-p2/v1/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
    credentials: 'include',
  });
}

export async function apiGetCurrentUser(nonce: string): Promise<User> {
  const res = await fetch(`${getRestUrl()}wp/v2/users/me`, {
    headers: { 'X-WP-Nonce': nonce },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not authenticated');
  const data = await res.json();
  return {
    id: data.id,
    username: data.slug,
    email: data.email ?? '',
    displayName: data.name,
    avatarUrl: data.avatar_urls?.['96'],
  };
}
