import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

export default function AdCard({ ad, userId }) {
  const [visible, setVisible] = useState(false);

  const toggleImage = () => setVisible((prev) => !prev);

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'like') return <ThumbsUp className="inline-block text-green-600 w-4 h-4 mr-1" />;
    if (sentiment === 'dislike') return <ThumbsDown className="inline-block text-red-600 w-4 h-4 mr-1" />;
    return <MessageCircle className="inline-block text-blue-500 w-4 h-4 mr-1" />;
  };

  return (
    <div className="relative p-[2px] rounded-xl bg-gradient-to-tr from-purple-400 via-pink-500 to-yellow-500 shadow-lg group hover:scale-[1.02] transition-transform duration-300">
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{ad.description}</h2>
        <p className="text-sm text-gray-500 mb-2">Feedbacks: {ad.feedbacks.length}</p>

        <ul className="space-y-2 mt-3">
          {ad.feedbacks
            .filter((fb) => fb.userId === userId || fb.userId?._id === userId)
            .map((fb, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                {getSentimentIcon(fb.sentiment)}
                <div>
                  <p className="font-medium">{fb.sentiment.charAt(0).toUpperCase() + fb.sentiment.slice(1)}</p>
                  <p className="ml-1 text-xs italic">{fb.comment || 'No comment provided.'}</p>
                </div>
              </li>
            ))}
        </ul>

        <button
          onClick={toggleImage}
          className="mt-5 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          {visible ? 'Hide' : 'View'} Ad
        </button>

        {visible && (
          <img
            src={ad.imageUrl}
            alt="Ad"
            className="w-full max-w-md mx-auto mt-4 rounded-lg border-4 border-indigo-100 shadow-xl transition-opacity duration-300"
          />
        )}
      </div>
    </div>
  );
}
