import { Outlet } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    /* full‑height flex row */
    <div className="flex h-screen">
      {/* ── Sidebar (sticks left, full height) ── */}
      <Sidebar />

      {/* ── Right side: column with navbar + page ── */}
      <div className="flex flex-1 flex-col">
        <AuthNavbar /> {/* now INSIDE this column, not fixed */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
