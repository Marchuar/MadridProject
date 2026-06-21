import { Outlet } from 'react-router-dom';
import { TopNav } from '../shared/components/Navigation/TopNav';

export function AppShell() {
  return (
    <div className="min-h-dvh bg-white">
      <TopNav />
      <main id="main-content" className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
