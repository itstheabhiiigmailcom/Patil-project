import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { fetchUserAdHistory } from '../api/userApi';
import AdCard from '../components/AdCard';

export default function History() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const [loadingUser, setLoadingUser] = useState(true);
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!user || !user._id) {
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, [dispatch, user]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingAds(true);
        const adsData = await fetchUserAdHistory(user._id);
        setAds(adsData);
      } catch (err) {
        console.error('Failed to fetch ad history:', err);
      } finally {
        setLoadingAds(false);
      }
    };

    if (!loadingUser && user?._id) {
      fetchHistory();
    }
  }, [loadingUser, user]);

  if (loadingUser || loadingAds) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Please log in first.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 px-12 py-5 text-xs uppercase tracking-widest font-medium text-black bg-white rounded-full shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#23c483] hover:text-white hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] transform hover:-translate-y-2 active:translate-y-0 flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Your Ad Feedback History</h1>

      {ads.length === 0 ? (
        <p className="text-lg text-center">You haven't given feedback on any ads yet.</p>
      ) : (
        <div className="grid gap-6">
          {ads.map((ad) => (
            <AdCard key={ad._id} ad={ad} userId={user._id} />
          ))}
        </div>
      )}
    </div>
  );
}
