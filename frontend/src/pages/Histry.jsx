import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';

export default function History() {
  const dispatch = useDispatch();
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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/ads/history/${user._id}`,
          { withCredentials: true }
        );
        setAds(res.data.ads || []);
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
      <h1 className="text-3xl font-bold mb-6 text-center">Your Ad Feedback History</h1>

      {ads.length === 0 ? (
        <p className="text-lg text-center">You haven't given feedback on any ads yet.</p>
      ) : (
        <div className="grid gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="border p-4 rounded-lg shadow bg-white text-black">
              <img
                src={ad.imageUrl}
                alt="Ad"
                className="w-full max-w-md mx-auto mb-4 rounded"
              />
              <p className="text-lg font-semibold mb-2">{ad.description}</p>
              <p className="text-sm text-gray-600">
                Feedbacks: {ad.feedbacks.length}
              </p>
              <ul className="mt-2 list-disc pl-6">
                {ad.feedbacks
                  .filter((fb) => fb.userId === user._id || fb.userId?._id === user._id)
                  .map((fb, idx) => (
                    <li key={idx} className="text-sm">
                      <div>
                        <strong>
                          {fb.sentiment === 'like'
                            ? '👍 Liked'
                            : fb.sentiment === 'dislike'
                            ? '👎 Disliked'
                            : '📝 Commented'}
                        </strong>
                      </div>
                      <div className="ml-2">Comment: {fb.comment || 'No comment provided.'}</div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
