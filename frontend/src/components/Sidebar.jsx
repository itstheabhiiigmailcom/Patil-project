import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';
import '../App.css';

export default function Sidebar({ open, setOpen }) {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

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
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-indigo-50 border-r shadow-xl transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
      >
        <div className="flex flex-col h-full px-6 py-5">
          {/* Logo */}
          <h2 className="text-2xl font-extrabold text-indigo-700 mb-8 tracking-tight">Advestore</h2>

          {/* Nav Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {items.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`
                }
                onClick={() => setOpen(false)}
                end
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User Info + Logout */}
          <div className="mt-6 border-t pt-4">
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{user?.name}</span> &middot;
              <span className="ml-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 text-sm font-semibold text-gray-600 rounded-lg bg-white border border-gray-200 shadow-inner hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
            >
              🔓 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
