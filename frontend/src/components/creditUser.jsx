// src/components/AdViewer.jsx

import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/getProfile';
import { updateCredit } from '../api/updateCredit';
import { logAdView } from '../api/AdView';

export default function AdViewer({ adId }) {
  const [loading, setLoading] = useState(true);
  const [creditUpdated, setCreditUpdated] = useState(false);
  const [alreadyViewed, setAlreadyViewed] = useState(false);

  useEffect(() => {
    const handleAdView = async () => {
      try {
        const profile = await getProfile();
        if (!profile || !adId) return;

        const result = await logAdView(adId);

        if (result.counted) {
          const newCredit = (profile.credit || 0) + 0.3;
          await updateCredit(newCredit);
          setCreditUpdated(true);
        } else {
          setAlreadyViewed(true);
        }
      } catch (err) {
        console.error('Error processing ad view:', err);
      } finally {
        setLoading(false);
      }
    };

    handleAdView();
  }, [adId]);

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-bold">Ad Viewer</h2>

      {loading ? (
        <p className="text-gray-500 mt-2">Checking view status...</p>
      ) : creditUpdated ? (
        <p className="text-green-600 mt-2">✅ You earned 0.3 credits!</p>
      ) : alreadyViewed ? (
        <p className="text-yellow-600 mt-2">⏱️ You’ve already viewed this ad recently.</p>
      ) : (
        <p className="text-red-500 mt-2">❌ Something went wrong.</p>
      )}
    </div>
  );
}
