// src/pages/Banned.jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // optional, if using lucide icons

export default function Banned() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const bannedUntil = user?.ban?.bannedUntil
    ? new Date(user.ban.bannedUntil).toLocaleString()
    : 'an unknown time';

  return (
    <div className="flex h-screen items-center justify-center bg-red-50 relative px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <div className="max-w-md bg-white shadow-xl rounded-xl p-6 text-center border border-red-300">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          🚫 You Are Banned
        </h1>
        <p className="text-gray-700 mb-2">
          Your account has been temporarily banned by the admin.
        </p>
        <p className="text-gray-800 font-medium">
          Ban valid until: <span className="text-red-600">{bannedUntil}</span>
        </p>
        <p className="mt-4 text-sm text-gray-500">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
