import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="pl-[260px] min-h-screen bg-background">
      <Sidebar />
      <main className="max-w-[1000px] mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
