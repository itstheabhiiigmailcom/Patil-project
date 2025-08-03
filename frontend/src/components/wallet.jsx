import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/getProfile';
import { Wallet, Activity, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserWallet() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const credit = user?.credit || 0; // Default to 0 if user or credit is not available
  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUserProfile();
      if (data) setUser(data);
    };
    getUser();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <Wallet className="w-6 h-6 text-green-600" /> Wallet
      </h2>

      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600">Credit Amount</p>
        <p className="text-lg font-medium text-green-700">
          ₹{credit.toFixed(2)} {/* ✅ Live Credit Display */}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-gray-50 text-center">
          <Activity className="w-5 h-5 mx-auto text-blue-600 mb-1" />
          <p className="text-sm text-gray-600">Spent This Month</p>
          <p className="text-lg font-medium text-blue-700">₹0</p>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50 text-center">
          <BarChart className="w-5 h-5 mx-auto text-purple-600 mb-1" />
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-lg font-medium text-purple-700">₹0</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 px-12 py-5 text-xs uppercase tracking-widest font-medium text-black bg-white rounded-full shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#23c483] hover:text-white hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] transform hover:-translate-y-2 active:translate-y-0 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
