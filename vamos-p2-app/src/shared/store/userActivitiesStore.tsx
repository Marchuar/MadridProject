// TODO: migrate to WP REST API endpoints (vamos-p2/v1/user-activities) in next iteration
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type React from 'react';

export interface BookedEntry {
  activityId: number;
  activityTitle: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  people: number;
  totalPrice: number;
  bookedAt: string;   // ISO timestamp
  imageSlug?: string;
}

interface UserActivitiesState {
  liked: number[];
  booked: BookedEntry[];
  visited: number[];
  toggleLike: (id: number) => void;
  addBooking: (entry: BookedEntry) => void;
  markVisited: (activityId: number) => void;
  isLiked: (id: number) => boolean;
  isBooked: (id: number) => boolean;
  isVisited: (id: number) => boolean;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const UserActivitiesContext = createContext<UserActivitiesState | null>(null);

export function UserActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useState<number[]>(() => load('vamos_liked', []));
  const [booked, setBooked] = useState<BookedEntry[]>(() => load('vamos_booked', []));
  const [visited, setVisited] = useState<number[]>(() => load('vamos_visited', []));

  useEffect(() => { localStorage.setItem('vamos_liked', JSON.stringify(liked)); }, [liked]);
  useEffect(() => { localStorage.setItem('vamos_booked', JSON.stringify(booked)); }, [booked]);
  useEffect(() => { localStorage.setItem('vamos_visited', JSON.stringify(visited)); }, [visited]);

  const toggleLike = useCallback((id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const addBooking = useCallback((entry: BookedEntry) => {
    setBooked(prev => {
      const filtered = prev.filter(b => b.activityId !== entry.activityId || b.date !== entry.date);
      return [...filtered, entry];
    });
  }, []);

  const markVisited = useCallback((activityId: number) => {
    setVisited(prev => prev.includes(activityId) ? prev : [...prev, activityId]);
  }, []);

  const isLiked = useCallback((id: number) => liked.includes(id), [liked]);
  const isBooked = useCallback((id: number) => booked.some(b => b.activityId === id), [booked]);
  const isVisited = useCallback((id: number) => visited.includes(id), [visited]);

  return (
    <UserActivitiesContext.Provider value={{ liked, booked, visited, toggleLike, addBooking, markVisited, isLiked, isBooked, isVisited }}>
      {children}
    </UserActivitiesContext.Provider>
  );
}

export function useUserActivities(): UserActivitiesState {
  const ctx = useContext(UserActivitiesContext);
  if (!ctx) throw new Error('useUserActivities must be inside UserActivitiesProvider');
  return ctx;
}
