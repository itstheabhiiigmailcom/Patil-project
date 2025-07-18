// ✅ src/components/WatchAds/useWatchAds.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchCurrentUser } from '../store/authSlice';
import { sendAdView } from '../api/AdView';

export default function useWatchAds() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loadingUser, setLoadingUser] = useState(true);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [age, setAge] = useState(null);
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);

  const currentAd = ads[currentIndex] || null;

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user || !user._id) {
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, [dispatch, user]);

  useEffect(() => {
    if (!loadingUser && user) {
      if (!user.age) {
        setShowAgeModal(true);
      } else {
        fetchAds(user._id);
      }
    }
  }, [loadingUser, user]);

  const fetchAds = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/ads/for-user/${userId}`,
        { withCredentials: true }
      );
      setAds(res.data.ads || []);
    } catch (err) {
      console.error('Ad Fetch Error:', err);
    }
  };

  const handleNextAd = () => {
    setShowFeedback(false);
    if (currentIndex + 1 < ads.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(ads.length); // this ensures currentAd becomes null
    }
  };

  const handleAgeSubmit = async () => {
    if (!age || age < 13 || age > 120) {
      return alert('Please enter a valid age between 13 and 120.');
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/set-age`,
        { age },
        { withCredentials: true }
      );
      const updatedUser = await dispatch(fetchCurrentUser()).unwrap();
      if (updatedUser?.age) {
        setShowAgeModal(false);
        fetchAds(updatedUser._id);
      }
    } catch (err) {
      console.error('Error setting age:', err);
    }
  };

  const handleFeedbackSubmit = () => {
    setTokensEarned((prev) => prev + 5);
    setShowFeedback(false);
    handleNextAd();
  };

useEffect(() => {
  if (!currentAd?._id || !user?._id) return;

  const timer = setTimeout(async () => {
    try {
      const res = await sendAdView(currentAd._id, user._id); // ensure it returns { counted: true }
      if (res?.counted) {
        setTokensEarned((prev) => prev + 0.3);
      }
    } catch (err) {
      console.error('View log failed:', err);
    }
  }, 3000);

  return () => clearTimeout(timer);
}, [currentAd?._id, user?._id]);


  return {
    user,
    loadingUser,
    showAgeModal,
    setShowAgeModal,
    age,
    setAge,
    handleAgeSubmit,
    ads,
    currentAd,
    currentIndex,
    showFeedback,
    setShowFeedback,
    handleFeedbackSubmit,
    handleNextAd,
  };
}
