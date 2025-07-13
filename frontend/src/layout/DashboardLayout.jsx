import { Outlet, useLocation } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import AdvertiserAnalytics from '../components/AdvertiserAnalytics';

export default function DashboardLayout() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();

  const isRootDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex flex-1 flex-col">
        <AuthNavbar />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {/* Show analytics on root dashboard only for advertiser */}
          {isRootDashboard && user?.role === 'advertiser' ? (
            <AdvertiserAnalytics />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
