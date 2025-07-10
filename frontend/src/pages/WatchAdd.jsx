// src/components/WatchAds/WatchAds.jsx
import React from 'react';
import AgeModal from '../components/Agemodel';
import AdDisplay from '../components/AdDisplay';
import useWatchAds from '../components/UseWatchAds';

export default function WatchAds() {
  const {
    user,
    showAgeModal,
    setShowAgeModal,
    age,
    setAge,
    handleAgeSubmit,
    currentAd,
    currentIndex,
    ads,
    showFeedback,
    setShowFeedback,
    handleFeedbackSubmit,
    tokensEarned,
    handleNextAd,
  } = useWatchAds();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white text-xl">
        Please log in first.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center p-4 md:p-8 relative">
      
      {tokensEarned > 0 && (
        <div className="absolute top-4 right-4 bg-green-500 bg-opacity-80 text-white px-4 py-2 rounded-xl text-sm shadow-lg backdrop-blur-md">
          🎁 Tokens Earned: <span className="font-semibold">{tokensEarned}</span>
        </div>
      )}

      {showAgeModal && (
        <div className="w-full max-w-md">
          <AgeModal age={age} setAge={setAge} handleAgeSubmit={handleAgeSubmit} />
        </div>
      )}

      {!showAgeModal && currentAd && (
        <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
          <AdDisplay
            ad={currentAd}
            index={currentIndex}
            total={ads.length}
            showFeedback={showFeedback}
            setShowFeedback={setShowFeedback}
            handleFeedbackSubmit={handleFeedbackSubmit}
            handleNextAd={handleNextAd}
          />

          {!showFeedback && (
            <button
              onClick={handleNextAd}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-all duration-200 shadow-md w-full max-w-xs"
            >
              Next Ad
            </button>
          )}
        </div>
      )}

      {!showAgeModal && !currentAd && ads.length > 0 && (
        <div className="mt-10 text-center text-lg font-medium">
          🎉 You've watched all available ads!
        </div>
      )}

      {!showAgeModal && ads.length === 0 && (
        <div className="mt-10 text-center text-lg font-medium text-gray-400">
          No ads available for your age group right now.
        </div>
      )}
    </div>
  );
}
