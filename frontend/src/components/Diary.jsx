import React, { useState, useEffect } from 'react';
import { showDiaryEntry } from '../api/userApi';
import AddDiaryEntry from './AddDiary';
import DiaryList from './MyDiary';
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import TypeWriterEffect from 'react-typewriter-effect';
import '../style/Diary.css';

// ----- Data -----
const fallbackQuotes = [
  "“Start writing, no matter what. The water does not flow until the faucet is turned on.” – Louis L’Amour",
  "“Journaling is like whispering to one’s self and listening at the same time.” – Mina Murray",
  "“Fill your paper with the breathings of your heart.” – William Wordsworth",
  "“Sometimes, the best therapy is a long talk with your journal.”",
  "“You don't need to see the whole staircase, just take the first step.” – Martin Luther King Jr.",
];

const moodStyles = {
  Happy:   "bg-emerald-100 text-emerald-600 border-emerald-200",
  Sad:     "bg-blue-100 text-blue-600 border-blue-200",
  Anxious: "bg-orange-100 text-orange-600 border-orange-200",
  Grateful:"bg-yellow-100 text-yellow-700 border-yellow-200",
};

const moodEmoji = {
  Happy:   "😊",
  Sad:     "😢",
  Anxious: "😬",
  Grateful:"🙏",
};

const prompts = [
  "What made you smile today?",
  "What's something you’re grateful for right now?",
  "Describe a challenge you overcame this week.",
  "What's an act of kindness you experienced/revealed?",
  "What do you want more of in your tomorrow?",
];

// ----- Component -----
export default function DiaryOverview() {
  const [entries, setEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [prompt, setPrompt] = useState(prompts[0]);

  // Daily Prompt
  useEffect(() => {
    setPrompt(prompts[Math.floor((Date.now() / 1000) % prompts.length)]);
  }, []);

  // Fetch diary entries
  const fetchEntries = async () => {
    try {
      const res = await showDiaryEntry();
      const latest = [...res.diaryEntries].reverse().slice(0, 3);
      setEntries(latest);
    } catch (err) {
      console.error('Error fetching diary entries:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Confetti and refresh on add
  const handleEntryAdded = () => {
    fetchEntries();
    setShowAddModal(false);
    confetti({ particleCount: 90, spread: 55, origin: { y: 0.7 } });
  };

  // Confetti on view all
  const handleShowListModal = () => {
    setShowListModal(true);
    confetti({ particleCount: 120, angle: 120, spread: 75, origin: { y: 0.2 } });
  };

  const handleEntryDeleted = () => fetchEntries();

  // Auto-scroll new entry card into view
  useEffect(() => {
    if (entries.length && document.getElementById('diary-card-0')) {
      document.getElementById('diary-card-0').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [entries]);

  return (
    <div className="relative p-4 sm:p-8 min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-hidden">

      {/* Aurora Animated SVG Background */}
      <svg className="absolute -z-10 w-full h-full top-0 left-0 pointer-events-none" aria-hidden="true">
        <defs>
          <radialGradient id="aurora" cx="50%" cy="40%" r="80%" fx="60%" fy="60%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <ellipse
          cx="50%" cy="40%" rx="60%" ry="46%"
          fill="url(#aurora)"
          style={{ animation: 'morph 12s ease-in-out infinite alternate' }}
        />
        <style>{`
          @keyframes morph {
            0%   { rx: 60%; ry: 46%; }
            50%  { rx: 72%; ry: 54%; }
            100% { rx: 60%; ry: 48%; }
          }
        `}</style>
      </svg>

      {/* Floating Memo Stickers */}
      <div className="absolute z-0 top-10 left-16 w-20 h-20 pointer-events-none animate-bounce-slow">
        <img src="/stickynote-yellow.svg" alt="sticky note" className="opacity-90 rotate-6" />
      </div>
      <div className="absolute z-0 bottom-28 right-16 w-14 h-14 pointer-events-none animate-bounce-slower">
        <img src="/paperclip-pink.svg" alt="paperclip" className="opacity-80 -rotate-12" />
      </div>

      {/* Heading */}
      <h1 className="font-quicksand text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-6 relative z-10 drop-shadow">
        Your Recent Thoughts 💭
      </h1>

      {/* Daily Prompt */}
      <div className="my-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800 rounded-xl shadow font-medium w-full max-w-xl mx-auto">
        <span role="img" aria-label="prompt">📝</span>
        <span className="italic ml-2">{prompt}</span>
      </div>

      {/* No Entries Welcome */}
      {entries.length === 0 && (
        <div className="text-center max-w-2xl mx-auto z-10 relative mb-8">
          <p className="text-lg sm:text-xl text-gray-700 font-medium mb-3">
            Welcome! It looks like you haven’t added any thoughts yet.
          </p>
          <p className="text-md sm:text-lg text-gray-600 italic">
            Take a moment to reflect and pen down your first entry. 🌟
          </p>
        </div>
      )}

      {/* Typewriter Animated Quotes Section */}
      <div className="font-indieFlower text-center max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-4 px-6 rounded-xl shadow-md text-indigo-700 text-md sm:text-lg font-semibold italic z-10 relative mb-10 border border-white/30">
        <TypeWriterEffect
          multiText={fallbackQuotes}
          multiTextDelay={1500}
          typeSpeed={40}
          cursorColor="indigo"
          className=""
        />
      </div>

      {/* Diary Cards w/ Animation & Ripple */}
      <div className="flex flex-wrap justify-center gap-6 z-10 relative">
        <AnimatePresence>
          {entries.map((entry, index) => (
            <motion.div
              id={`diary-card-${index}`}
              key={`${entry._id || entry.id || 'entry'}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative w-full sm:w-[22rem] bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/30 overflow-hidden"
            >
              <span className="absolute inset-0 rounded-2xl pointer-events-none group-hover:animate-ripple" />
              <h2 className="text-xl font-semibold text-indigo-800 font-quicksand">{entry.title}</h2>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{entry.content}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  moodStyles[entry.mood] || "bg-gray-100 text-gray-600 border-gray-200"
                }`}>
                  <span className="mr-1">{moodEmoji[entry.mood] || "📝"}</span> {entry.mood}
                </span>
                <span className="text-sm text-indigo-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons (FAB) */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-20">
        <button
          onClick={() => setShowAddModal(true)}
          className="relative flex items-center justify-center shadow-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 hover:scale-110 transition-transform w-16 h-16 rounded-full text-white text-3xl drop-shadow-lg"
          aria-label="Add entry"
          title="Add Entry"
        >
          <span className="absolute -inset-3 rounded-full bg-indigo-400 opacity-20 blur-xl animate-fab"></span>
          +
        </button>
        <button
          onClick={handleShowListModal}
          className="bg-white/90 p-4 rounded-full shadow-lg border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-600 text-indigo-700 text-xl transition"
          aria-label="View all entries"
          title="View All Entries"
        >
          📖
        </button>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <AddDiaryEntry
          onEntryAdded={handleEntryAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Full Diary List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl animate-fadeIn scale-95">
            <button
              onClick={() => setShowListModal(false)}
              className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-500"
            >
              ❌
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center font-quicksand">All Diary Entries</h2>
            <DiaryList onEntryDeleted={handleEntryDeleted} />
          </div>
        </div>
      )}
    </div>
  );
}
