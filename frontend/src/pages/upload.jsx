import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uploadAd } from '../api/addApi';
import { fetchUserProfile } from '../api/getProfile';
import { moderateImage } from '../store/moderateImage';

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

  const [imagePreview, setImagePreview] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingModeration, setCheckingModeration] = useState(false);

  // Fetch credits
  const fetchCredits = async () => {
    try {
      const profile = await fetchUserProfile();
      const newCredits = profile.credit || 0;
      setCredits(newCredits);
      return newCredits;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setCredits(0);
      return 0;
    }
  };

  // Initial credit fetch
  useEffect(() => {
    const init = async () => {
      if (user?.role === 'advertiser') {
        await fetchCredits();
      } else {
        setCredits(0);
      }
      setLoading(false);
    };
    init();
  }, [user]);

  // Optional: Refresh credits every 5s
  useEffect(() => {
    if (user?.role === 'advertiser') {
      const intervalId = setInterval(fetchCredits, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Set advertiser ID
  useEffect(() => {
    if (user?.role === 'advertiser' && user.email) {
      setForm((prev) => ({ ...prev, advertiserId: user.email }));
      setIsAdvertiser(true);
    } else {
      setIsAdvertiser(false);
    }
  }, [user]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      const file = files[0];
      if (!file) return;

      setImagePreview(URL.createObjectURL(file));
      setCheckingModeration(true);

      const { passed, result } = await moderateImage(file);
      setModerationResult(result);

      if (!passed) {
        alert('⚠️ Image rejected due to inappropriate content.');
        setForm((prev) => ({ ...prev, file: null }));
        setImagePreview(null);
      } else {
        setForm((prev) => ({ ...prev, file }));
      }

      setCheckingModeration(false);
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

    const latestCredits = await fetchCredits();
    if (latestCredits < 1000) {
      alert('❌ You don’t have enough credits. Please top up your wallet.');
      return;
    }

    if (!form.file) {
      alert('Please upload a valid image');
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
    return <div className="text-center py-10 text-gray-500">Please log in to upload an ad.</div>;
  }

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Checking credits...</div>;
  }

  if (credits < 1000) {
    return (
      <div className="text-center py-10 text-yellow-600">
        You need at least 1000 credits to upload an advertisement.
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

        {checkingModeration && (
          <p className="text-blue-600 font-medium">Moderating image, please wait...</p>
        )}

        {imagePreview && (
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-2">Image Preview:</p>
            <img src={imagePreview} alt="Preview" className="w-full rounded-lg shadow" />
          </div>
        )}

        <input type="hidden" name="advertiserId" value={form.advertiserId} />

        <button
          type="submit"
          disabled={checkingModeration}
          className="w-full py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
        >
          Upload Ad
        </button>
      </form>
    </div>
  );
}
