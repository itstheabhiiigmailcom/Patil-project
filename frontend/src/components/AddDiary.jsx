import React, { useState, useRef, useEffect } from 'react';
import { addDiaryEntry } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddDiaryEntry({ onEntryAdded, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: ''
  });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagList = form.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      await addDiaryEntry({ ...form, tags: tagList });

      toast.success('Diary entry added!');
      setForm({ title: '', content: '', mood: 'neutral', tags: '' });
      onEntryAdded?.();
      onClose?.();
      navigate('/dashboard');
    } catch (err) {
      console.error('Create failed', err);
      toast.error('Failed to add entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-10 overflow-hidden"
      >
        {/* Animated Background Bubbles */}
        <div className="absolute -top-32 -left-32 w-[300px] h-[300px] bg-pink-400/30 rounded-full blur-3xl animate-float1" />
        <div className="absolute top-10 right-10 w-[150px] h-[150px] bg-blue-400/30 rounded-full blur-2xl animate-float2" />
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-purple-400/30 rounded-full blur-2xl animate-float3" />

        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white text-red-500 hover:text-red-600 rounded-full p-2 shadow-lg transition z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Diary Form */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg rounded-2xl bg-white/60 backdrop-blur-lg border border-white/30 shadow-2xl p-6 sm:p-8 z-10 space-y-5 animate-fade-in"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-4">
            ✨ Add a New Thought
          </h2>

          <input
            name="title"
            ref={titleRef}
            value={form.title}
            onChange={handleChange}
            placeholder="Title (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/90 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            placeholder="Write your thoughts..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/90 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          >
            <option value="neutral">Neutral</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="excited">Excited</option>
            <option value="anxious">Anxious</option>
          </select>

          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/90 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Entry'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
