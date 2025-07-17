import React, { useEffect, useState } from 'react';
import { updateUserProfile } from '../api/editProfileRoute';
import { fetchUserProfile } from '../api/getProfile';
import Select from 'react-select';

const interestOptions = [
  { value: 'sports', label: 'Sports' },
  { value: 'music', label: 'Music' },
  { value: 'movies', label: 'Movies' },
  { value: 'travel', label: 'Travel' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'reading', label: 'Reading' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'art', label: 'Art' },
  { value: 'technology', label: 'Technology' },
];

const timeOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ interests: [], time: [] });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUserProfile();
        setUser(data);
        setForm({
          interests: Array.isArray(data.interests) ? data.interests : [],
          time: Array.isArray(data.time) ? data.time : [],
        });
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        setStatus('❌ Failed to load user. Please login again.');
      }
    }

    loadUser();
  }, []);

  const handleMultiChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setForm((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.name || !user?.email) {
      return setStatus('❌ User not authenticated. Please login again.');
    }

    try {
      setLoading(true);
      const { success, msg, error } = await updateUserProfile(form);
      if (error || !success) {
        setStatus(`❌ ${msg || 'Failed to update profile'}`);
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

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-500 text-lg">Loading user...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 px-6 py-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Edit Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            Editing profile for <strong className="text-gray-900">{user.name}</strong>{' '}
            (<span className="text-indigo-600">{user.email}</span>)
          </p>
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time <span className="text-xs text-gray-500">(Select one or more)</span>
          </label>
          <Select
            isMulti
            name="time"
            options={timeOptions}
            value={timeOptions.filter((opt) => form.time.includes(opt.value))}
            onChange={(selected) => handleMultiChange(selected, 'time')}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests <span className="text-xs text-gray-500">(Select one or more)</span>
          </label>
          <Select
            isMulti
            name="interests"
            options={interestOptions}
            value={interestOptions.filter((opt) => form.interests.includes(opt.value))}
            onChange={(selected) => handleMultiChange(selected, 'interests')}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        {/* Status Message */}
        {status && (
          <div
            className={`text-center text-sm font-medium px-4 py-2 rounded-md ${
              status.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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

