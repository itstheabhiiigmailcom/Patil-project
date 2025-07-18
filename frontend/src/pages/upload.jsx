// src/components/UploadAd.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uploadAd } from '../api/addApi';
import { fetchUserProfile } from '../api/getprofile';
export default function UploadAd() {
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    description: '',
    adType: '',
    advertiserId: '',
    ageMin: '',
    ageMax: '',
    file: null,
  });

  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [credits, setCredits] = useState(null); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCredits = async () => {
      if (user?.role === 'advertiser') {
        try {
          const profile = await fetchUserProfile();
          
          setCredits(profile.credit || 0);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setCredits(0);
        } finally {
          setLoading(false);
        }
      } else {
        setCredits(0);
        setLoading(false);
      }
    };
    fetchCredits();
  }, [user]);

  useEffect(() => {
    if (user?.role === 'advertiser' && user.email) {
      setForm((prev) => ({ ...prev, advertiserId: user.email }));
      setIsAdvertiser(true);
    } else {
      setIsAdvertiser(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdvertiser) {
      alert('Only advertisers can upload ads ❌');
      return;
    }

    if (credits < 1000) {
      alert('You must have at least 1000 credits to upload an ad ❌');
      return;
    }

    try {
      const data = await uploadAd(form);
      alert('Ad Uploaded ✅');
      console.log(data);
    } catch (err) {
      console.error('Upload Error:', err.response?.data || err.message);
      alert('Upload failed ❌');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-lg text-gray-600">
        Please log in to upload an ad.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-lg text-gray-500">
        Checking credits...
      </div>
    );
  }

  if (credits < 1000) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-yellow-600 text-center px-6 text-lg font-medium">
        You need at least 1000 credits to upload an advertisement. Please top-up your account.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl space-y-5 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Upload Advertisement</h2>

        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Description</label>
          <input
            name="description"
            onChange={handleChange}
            placeholder="Enter ad description"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Ad Type</label>
          <input
            name="adType"
            onChange={handleChange}
            placeholder="e.g., Tech, Fashion, Education"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 space-y-1">
            <label className="block font-medium text-gray-700">Min Age</label>
            <input
              name="ageMin"
              type="number"
              onChange={handleChange}
              placeholder="e.g., 18"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="block font-medium text-gray-700">Max Age</label>
            <input
              name="ageMax"
              type="number"
              onChange={handleChange}
              placeholder="e.g., 35"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-gray-700">Upload Image</label>
          <input
            name="file"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        <input type="hidden" name="advertiserId" value={form.advertiserId} />

        <button
          type="submit"
          className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
        >
          Upload Ad
        </button>
      </form>
    </div>
  );
}
