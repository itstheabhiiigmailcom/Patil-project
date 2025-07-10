// src/pages/AdvertiserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdvertiserDashboard() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/my-ads`, {
        withCredentials: true,
      });
      setAds(res.data.ads || []);
    } catch (err) {
      console.error('Failed to load your ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAds();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading your ads...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-6">Your Ads Dashboard</h1>

      {ads.length === 0 ? (
        <p>No ads found. Create one to get started!</p>
      ) : (
        ads.map((ad) => (
          <div key={ad._id} className="bg-white rounded-lg p-6 mb-6 shadow">
            <div className="flex gap-4 items-center">
              <img src={ad.imageUrl} alt="Ad" className="w-32 h-auto rounded" />
              <div>
                <h2 className="text-xl font-semibold">{ad.description}</h2>
                <p className="text-sm text-gray-600">Views: {ad.views}</p>
                <p className="text-sm text-gray-600">
                  Feedback Count: {ad.feedbacks.length}
                </p>
              </div>
            </div>

            {ad.feedbacks.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">Feedback:</h3>
                <ul className="list-disc ml-6 mt-2">
                  {ad.feedbacks.map((fb, i) => (
                    <li key={i}>
                      <strong>{fb.userId?.name || 'Unknown'}:</strong>{' '}
                      <em>({fb.sentiment || 'not reacted'})</em> – {fb.comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
