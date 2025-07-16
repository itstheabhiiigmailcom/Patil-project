import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/getProfile';
import { Mail, Clock, Heart, Pencil, X } from 'lucide-react';
import EditProfile from './EditProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const data = await fetchUserProfile();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-10">
      {/* Back Button */}
<button
  onClick={() => navigate('/dashboard')}
  className="mb-6 px-12 py-5 text-xs uppercase tracking-widest font-medium text-black bg-white rounded-full shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#23c483] hover:text-white hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] transform hover:-translate-y-2 active:translate-y-0 flex items-center gap-2"
>
  ← Back to Dashboard
</button>


      {/* Profile Card */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">👋 Hello, {profile.name}</h2>
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Pencil size={18} />
            Edit Profile
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span className="text-lg">{profile.email}</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Preferred Time</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.time.map((t, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1 rounded-full shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="text-xl font-semibold text-gray-800">Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, i) => (
                <span
                  key={i}
                  className="bg-pink-100 text-pink-800 text-sm font-medium px-4 py-1 rounded-full shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Canvas for EditProfile */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full sm:w-[500px] h-full bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b shadow-sm sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-indigo-700">Edit Profile</h2>
              <button onClick={() => setShowEditor(false)}>
                <X className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <EditProfile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
