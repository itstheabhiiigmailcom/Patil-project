// src/components/GlobalCreditWatcher.jsx
import { useEffect, useRef } from 'react';
import { fetchMyAds, updateCredit } from '../api/addApi';
import { fetchUserProfile } from '../api/getProfile';

export default function GlobalCreditWatcher({ pollingInterval = 5000 }) {
  const prevViewsRef = useRef(null); // use `null` to detect first fetch
  const creditRef = useRef(0);
  const userRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const fetchAndUpdate = async () => {
      try {
        // Fetch user once
        if (!userRef.current) {
          const user = await fetchUserProfile();
          if (!user || user.role !== 'advertiser') return;
          userRef.current = user;
          creditRef.current = user.credit || 0;
        }

        // Fetch ads
        const ads = await fetchMyAds();
        const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);

        // First fetch: just store baseline view count
        if (prevViewsRef.current === null) {
          prevViewsRef.current = totalViews;
          return;
        }

        const prevViews = prevViewsRef.current;
        const newViews = totalViews - prevViews;

        if (newViews > 0) {
          const cost = newViews * 0.5;
          const updatedCredit = Math.max(0, creditRef.current - cost);
          await updateCredit(updatedCredit);
          creditRef.current = updatedCredit;
          prevViewsRef.current = totalViews;
        }
      } catch (err) {
        console.error('GlobalCreditWatcher Error:', err);
      }
    };

    fetchAndUpdate(); // initial
    intervalId = setInterval(fetchAndUpdate, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return null;
}
