// src/components/GlobalCreditWatcher.jsx
import { useEffect, useRef } from 'react';
import { fetchMyAds, updateCredit } from '../api/addApi';
import { fetchUserProfile } from '../api/getProfile';

export default function GlobalCreditWatcher({ pollingInterval = 5000 }) {
  const prevViewsRef = useRef(null); // Used to store previous total views
  const creditRef = useRef(0);       // Used to track credit updates
  const userRef = useRef(null);      // Store user details after first fetch

  useEffect(() => {
    let intervalId;

    const fetchAndUpdate = async () => {
      try {
        // Fetch and store user only once
        if (!userRef.current) {
          const user = await fetchUserProfile();
          if (!user || user.role !== 'advertiser') return;

          userRef.current = user;
          creditRef.current = user.credit || 0;
        }

        // Fetch all ads
        const ads = await fetchMyAds();
        const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);

        // If this is the first view count recorded, store and skip
        if (prevViewsRef.current === null) {
          prevViewsRef.current = totalViews;
          return;
        }

        // Calculate view difference
        const newViews = totalViews - prevViewsRef.current;

        if (newViews > 0) {
          const cost = newViews * 0.5;
          const updatedCredit = Math.max(0, creditRef.current - cost);

          await updateCredit(updatedCredit);

          // Update refs
          creditRef.current = updatedCredit;
          prevViewsRef.current = totalViews;
        }
      } catch (err) {
        console.error('GlobalCreditWatcher Error:', err);
      }
    };

    fetchAndUpdate(); // Initial fetch
    intervalId = setInterval(fetchAndUpdate, pollingInterval);

    return () => clearInterval(intervalId); // Cleanup
  }, [pollingInterval]);

  return null; // No UI needed
}
