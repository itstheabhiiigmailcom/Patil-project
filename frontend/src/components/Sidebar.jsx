import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { logout } from '../store/authSlice';

export default function Sidebar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items =
    user?.role === 'advertiser'
      ? [
          { path: 'upload', label: 'Upload Ad' },
          { path: 'stats', label: 'Statistics' },
          { path: 'my-ads', label: 'Your Ads' },
        ]
      : [
          { path: 'watch', label: 'Watch Ads' },
          { path: 'Account', label: 'Account' },
        ];

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/signin');
  };

  return (
    <aside className="h-full w-64 bg-[#e7e6e1] shadow-lg">
      <div className="px-4 py-6">
        <h2 className="mb-6 text-xl font-bold text-indigo-600">Dashboard</h2>

        <nav className="space-y-2">
          {items.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-200'
                }`
              }
              end
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-100 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
