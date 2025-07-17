import { useSelector } from 'react-redux';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthNavbar() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Greeting Section */}
      <div className="flex items-center gap-3">
        <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
          Hi,&nbsp;
          <span className="text-indigo-600 font-bold">{user?.name || 'User'}</span>
        </div>
      </div>

      {/* Logo + Profile */}
      <div className="flex items-center gap-5">
        <h1
          className="text-xl sm:text-2xl font-extrabold text-indigo-500 tracking-wide cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate('/')}
        >
          Advestore
        </h1>

        <UserCircle
          className="h-9 w-9 text-indigo-400 cursor-pointer transition-colors duration-300 hover:text-indigo-600"
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  );
}
