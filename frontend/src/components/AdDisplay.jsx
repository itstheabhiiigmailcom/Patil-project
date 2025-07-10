import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function AdDisplay({
  ad,
  index,
  total,
  showFeedback,
  setShowFeedback,
  handleFeedbackSubmit,
}) {
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [sentiment, setSentiment] = useState(null); // 'like', 'dislike', or null
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!user || !ad) return;

    const checkFeedback = () => {
      const matched = ad.feedbacks?.some(
        (fb) => fb.userId === user._id || fb.userId?._id === user._id
      );
      setAlreadySubmitted(matched);
    };

    checkFeedback();
  }, [user, ad]);

  const submitFeedback = async () => {
    if (!comment.trim()) {
      return alert('Please enter a comment.');
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/ads/feedback/${ad._id}`,
        {
          comment,
          sentiment: sentiment || 'not-reacted',
        },
        { withCredentials: true }
      );
      setAlreadySubmitted(true);
      handleFeedbackSubmit();
    } catch (err) {
      alert(err?.response?.data?.message || 'Feedback submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Sponsored Ad</h1>
      <img
        src={ad.imageUrl}
        alt="Ad"
        className="w-full h-auto mx-auto rounded-lg shadow-md"
      />
      <p className="text-lg">{ad.description}</p>

      {alreadySubmitted ? (
        <div className="text-green-400 font-semibold">
          ✅ You have already submitted feedback for this ad.
        </div>
      ) : !showFeedback ? (
        <button
          onClick={() => setShowFeedback(true)}
          className="bg-yellow-500 text-black px-6 py-2 rounded mt-4"
        >
          Give Feedback + Earn 5 Tokens
        </button>
      ) : (
        <div className="space-y-4 text-left">
          <textarea
            rows={3}
            className="w-full text-white p-2 rounded bg-gray-800"
            placeholder="What did you like/dislike?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={() => setSentiment('like')}
              className={`px-4 py-2 rounded-full text-xl transition ${
                sentiment === 'like'
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-gray-200 text-black'
              }`}
            >
              👍
            </button>
            <button
              onClick={() => setSentiment('dislike')}
              className={`px-4 py-2 rounded-full text-xl transition ${
                sentiment === 'dislike'
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-gray-200 text-black'
              }`}
            >
              👎
            </button>
          </div>

          <button
            onClick={submitFeedback}
            disabled={loading}
            className="bg-green-600 px-4 py-2 rounded w-full"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}

      <p className="text-sm text-gray-400">
        Ad {index + 1} of {total}
      </p>
    </div>
  );
}
