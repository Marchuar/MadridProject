import type { User } from '../../shared/types/user';

interface LoginResult {
  userId: number;
  displayName: string;
  nonce: string;
}

interface RegisterResult {
  userId: number;
  nonce: string;
}

function getRestUrl() {
  return window.vamosp2Config?.restUrl ?? '/wp-json/';
}

export async function apiLogin(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${getRestUrl()}vamos-p2/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Login failed');
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
    throw new Error(err.message ?? 'Registration failed');
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
