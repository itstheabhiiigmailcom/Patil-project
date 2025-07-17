import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // toggle sidebar on mobile

  // const isOnUserManagePage = location.pathname === '/dashboard/users';

  // Dynamic sidebar items based on role and current path
  let items = [];

 if (user?.role === 'advertiser') {
  items = [
    { path: '/dashboard', label: 'Home' },
    { path: '/dashboard/upload', label: 'Upload Ad' },
    { path: '/dashboard/my-ads', label: 'Your Ads' },
    { path: '/dashboard/wallet', label: 'Wallet' },
    { path: '/dashboard/contact', label: 'Contact' },
  ];
} else if (user?.role === 'admin') {
  items = [
    { path: '/dashboard', label: 'Home' },
    { path: '/dashboard/users/AllUsers', label: 'All Users' },
    { path: '/dashboard/users/search', label: 'Search by Email' },
    { path: '/dashboard/contact', label: 'Contact' },
  ];
} else {
  items = [
    { path: '/dashboard', label: 'Home' },
    { path: '/dashboard/watch', label: 'Watch Ads' },
    { path: '/dashboard/wallet', label: 'Wallet' },
    { path: '/dashboard/history', label: 'History' },
    { path: '/dashboard/contact', label: 'Contact' },
  ];
}


  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/signin');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-100 p-2 rounded-md shadow"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#e7e6e1] shadow-lg transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
      >
        <div className="px-4 py-6">
          <h2 className="mb-6 text-xl font-bold text-indigo-600">Dashboard</h2>

          <nav className="space-y-2">
            {items.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm font-medium ${isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
                onClick={() => setOpen(false)}
                end
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <div className="mb-1 text-xs text-gray-600">User role: ({user?.role})</div>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
        ></div>
      )}
    </>
  );
}
