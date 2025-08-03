import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import AdvertiserAnalytics from '../components/AdvertiserAnalytics';
import AdminAnalytics from '../components/AdminAnalytics';
import Diary from '../components/Diary';

export default function DashboardLayout() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';

  // Sidebar open state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar with toggle support */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Right side */}
      <div className="flex flex-1 flex-col">
        {/* Navbar with hamburger menu */}
        <AuthNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {/* Show analytics on root dashboard only */}
          {isRootDashboard ? (
            user?.role === 'advertiser' ? (
              <AdvertiserAnalytics />
            ) : user?.role === 'admin' ? (
              <AdminAnalytics />
            ) : user?.role === 'user' ? (
              <Diary/>
            ) : (
              <div className="text-gray-600 text-center">No dashboard content available for your role.</div>
            )
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
