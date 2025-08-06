import React, { useState, useEffect } from 'react';
import { updateUser, deleteUser, banUser, unbanUser } from '../api/adminApi';

export default function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState(user);
  const [banFrom, setBanFrom] = useState('');
  const [banTo, setBanTo] = useState('');
  const [useNow, setUseNow] = useState(true);

  useEffect(() => {
    if (useNow) {
      const now = new Date().toISOString().slice(0, 16);
      setBanFrom(now);
    }
  }, [useNow]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser(user._id, form);
    onUpdated();
    onClose();
  };

  const handleBanUnban = async () => {
    try {
      if (user.ban?.isBanned) {
        // Unban
        await unbanUser(user._id);
      } else {
        // Ban
        const banStart = useNow ? new Date() : new Date(banFrom);
        const banEnd = new Date(banTo);

        if (banEnd <= banStart) {
          alert('Ban To must be after Ban From.');
          return;
        }
        await banUser(user._id, {
          banFrom: banStart.toISOString(),
          banTo: banEnd.toISOString(),
        });
      }
      onUpdated();
      onClose();
    } catch (err) {
      console.log('Ban/Unban action failed: ', err);
      alert('Failed to perform ban/unban action.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(user._id);
      onUpdated();
      onClose();
    }
  };

  const isBanned = user.ban?.isBanned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          ✏️ Edit User Profile
        </h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all"
            name="age"
            value={form.age || ''}
            onChange={handleChange}
            placeholder="Age"
          />
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all"
            name="credit"
            value={form.credit || ''}
            onChange={handleChange}
            placeholder="Credit"
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all"
            name="interests"
            value={form.interests?.join(', ') || ''}
            onChange={(e) =>
              setForm({
                ...form,
                interests: e.target.value.split(',').map((i) => i.trim()),
              })
            }
            placeholder="Interests (comma separated)"
          />
        </div>

        {/* Save/Delete Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
          >
            💾 Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
          >
            🗑️ Delete
          </button>
        </div>

        {/* Ban/Unban Section */}
        {!isBanned && (
          <>
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useNow}
                  onChange={() => setUseNow(!useNow)}
                  id="useNow"
                />
                <label htmlFor="useNow" className="text-sm text-gray-700">
                  Ban from Now
                </label>
              </div>
              {!useNow && (
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/90 placeholder-gray-500 transition-all"
                  value={banFrom}
                  onChange={(e) => setBanFrom(e.target.value)}
                />
              )}
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/90 placeholder-gray-500 transition-all"
                value={banTo}
                onChange={(e) => setBanTo(e.target.value)}
                placeholder="Ban To"
              />
            </div>
          </>
        )}

        {/* Single Ban/Unban Button */}
        <button
          onClick={handleBanUnban}
          className={`w-full mt-4 ${
            isBanned
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white font-medium px-4 py-2 rounded-lg shadow-md transition`}
        >
          {isBanned ? '✅ Unban User' : '⛔ Ban User'}
        </button>

        {/* Cancel Button */}
        <button
          className="w-full mt-5 text-sm text-gray-600 hover:underline text-center"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
