// src/components/AuthNavbar.jsx
import { useSelector } from 'react-redux';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthNavbar() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between bg-[#e7e6e1] px-6 text-gray-900 shadow-lg">
      <span className="text-lg font-semibold text-indigo-600">
        Hi, <span className="font-bold text-indigo-800">{user?.name || 'User'}</span>
      </span>

      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-indigo-400">AdVision</h1>
        <UserCircle
          className="h-8 w-8 text-indigo-400 hover:cursor-pointer"
          onClick={() => navigate('/edit-profile')}
        />
      </div>
    </header>
  );
}
