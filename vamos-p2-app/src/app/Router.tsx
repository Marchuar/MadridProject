import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { ActivitiesPage } from '../features/activities/ActivitiesPage';
import { HomePage } from '../features/home/HomePage';
import { RecommendationsPage } from '../features/recommendations/RecommendationsPage';
import { MapPage } from '../features/map/MapPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { MyMadridPage } from '../features/my-madrid/MyMadridPage';
import { AppShell } from './AppShell';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="my-madrid" element={<MyMadridPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
