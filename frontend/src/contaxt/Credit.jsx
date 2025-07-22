import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fetchMyAds, updateCredit } from '../api/addApi';
import { fetchUserProfile } from '../api/getProfile';

const CreditContext = createContext();

export const useCredit = () => useContext(CreditContext);

export function CreditProvider({ children, pollingInterval = 5000 }) {
  const [credit, setCredit] = useState(0);
  const [views, setViews] = useState(0);
  const prevViewsRef = useRef(null);
  const creditRef = useRef(0);
  const userRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const fetchAndUpdate = async () => {
      try {
        // Fetch user only once
        if (!userRef.current) {
          const user = await fetchUserProfile();
          if (!user) return;
          userRef.current = user;
          creditRef.current = user.credit || 0;
          setCredit(creditRef.current);
        }

        const user = userRef.current;

        // 📉 For advertisers: deduct credit for ad views
        if (user.role === 'advertiser') {
          const ads = await fetchMyAds();
          const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
          setViews(totalViews);

          if (prevViewsRef.current === null) {
            prevViewsRef.current = totalViews;
            return;
          }

          const newViews = totalViews - prevViewsRef.current;
          if (newViews > 0) {
            const cost = newViews * 0.5;
            const newCredit = Math.max(0, creditRef.current - cost);
            await updateCredit(newCredit);
            creditRef.current = newCredit;
            setCredit(newCredit);
            prevViewsRef.current = totalViews;
          }

        // 📈 For users: update credit if server-side awarded credit (e.g., 0.3 per valid ad view)
        } else if (user.role === 'user') {
          const updated = await fetchUserProfile(); // refetch to get updated credit
          const serverCredit = updated.credit || 0;

          if (serverCredit !== creditRef.current) {
            creditRef.current = serverCredit;
            setCredit(serverCredit);
          }
        }

      } catch (err) {
        console.error('Credit Context Error:', err);
      }
    };

    fetchAndUpdate(); // Initial fetch
    intervalId = setInterval(fetchAndUpdate, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval]);

  return (
    <CreditContext.Provider value={{ credit, views }}>
      {children}
    </CreditContext.Provider>
  );
}
