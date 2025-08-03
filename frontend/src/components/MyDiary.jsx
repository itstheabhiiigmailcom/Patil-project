// src/components/Diary/DiaryList.jsx
import React, { useEffect, useState } from 'react';
import { showDiaryEntry, deleteDiaryEntry } from '../api/userApi';

export default function DiaryList({ onEntryDeleted }) {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
  try {
    const res = await showDiaryEntry(); // res is an object: { diaryEntries: [...] }
    setEntries([...res.diaryEntries].reverse());
  } catch (err) {
    console.error('Fetch failed', err);
  }
};

  const handleDelete = async (index) => {
    try {
      await deleteDiaryEntry(index);
      setEntries((prev) => prev.filter((_, i) => i !== index));
      if (onEntryDeleted) onEntryDeleted(); // Notify parent to refresh
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {entries.length === 0 && <p className="text-gray-500">No entries yet.</p>}
      {entries.map((entry, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
          <button
            onClick={() => handleDelete(entries.length - 1 - index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            &times;
          </button>
          <h3 className="text-xl font-semibold">{entry.title || 'Untitled'}</h3>
          <p className="text-gray-700 whitespace-pre-line mt-1">{entry.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            Mood: {entry.mood} | Date: {new Date(entry.date).toLocaleDateString()}
          </div>
          {entry.tags && entry.tags.length > 0 && (
            <div className="text-sm text-blue-500 mt-1">
              Tags: {entry.tags.join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
