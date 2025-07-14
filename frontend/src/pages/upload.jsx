import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

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

  useEffect(() => {
    if (user && user.role === 'advertiser' && user.email) {
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

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'file' && val) data.append('file', val);
      else if (val !== undefined && val !== null) data.append(key, val);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload-ad`,
        data,
        { withCredentials: true }
      );
      alert('Ad Uploaded ✅');
      console.log(res.data);
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
