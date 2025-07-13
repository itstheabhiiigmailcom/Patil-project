// src/components/EditProfile.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateUserProfile } from '../api/editProfileRoute';

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    interests: user?.interests || '',
    time: user?.time || '',
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.name || !user?.email || !user?._id) {
      return setStatus('❌ User not authenticated. Please login again.');
    }

    try {
      setLoading(true);
      const { success, msg, error } = await updateUserProfile(form);
      if (error) {
        setStatus(`❌ ${msg}`);
      } else {
        setStatus(`✅ ${msg}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow-md rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-sm text-gray-600">
          Editing profile as <span className="font-medium text-gray-900">{user?.name}</span> (
          <span className="text-blue-600">{user?.email}</span>)
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time
          </label>
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            Interest
          </label>
          <select
            name="interests"
            value={form.interests}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an interest</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="movies">Movies</option>
            <option value="travel">Travel</option>
            <option value="gaming">Gaming</option>
            <option value="reading">Reading</option>
            <option value="cooking">Cooking</option>
            <option value="art">Art</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-md disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        {status && (
          <div
            className={`text-sm font-medium ${
              status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
