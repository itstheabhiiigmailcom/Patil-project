// src/components/WatchAds/AgeModal.jsx
import React from 'react';

export default function AgeModal({ age, setAge, handleAgeSubmit }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-semibold text-center">Enter Your Date of Birth</h2>
        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) => {
            const dob = new Date(e.target.value);
            const today = new Date();
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
              calculatedAge--;
            }
            setAge(calculatedAge);
          }}
        />
        <button
          onClick={handleAgeSubmit}
          className="bg-green-600 text-white px-4 py-2 w-full mt-4 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
