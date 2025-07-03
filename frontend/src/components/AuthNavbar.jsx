import { useSelector } from 'react-redux';
import { UserCircle } from 'lucide-react';

export default function AuthNavbar() {
  const { user } = useSelector((s) => s.auth.user);

  return (
    <header className="flex h-16 items-center justify-between bg-[#e7e6e1] px-6 text-gray-900 shadow-lg">
      {/* Hi, Name on the left - now with better styling */}
      <span className="text-lg font-semibold text-indigo-600">
        Hi,{' '}
        <span className="font-bold text-indigo-800">
          {user?.name || 'User'}
        </span>
      </span>

      {/* brand + icon on the right */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-indigo-400">AdVision</h1>
        <UserCircle className="h-8 w-8 text-indigo-400 hover:cursor-pointer" />
      </div>
    </header>
  );
}
