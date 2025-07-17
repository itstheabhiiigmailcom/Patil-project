// src/components/SendMailModal.jsx
import { useState } from 'react';
import { sendAdminMail } from '../api/adminApi';

export default function SendMailModal({ user, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) {
      alert('Subject and message are required');
      return;
    }

    setLoading(true);
    try {
      await sendAdminMail({
        to: user.email,
        subject,
        message,
      });
      alert('Email sent successfully');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-indigo-900/30 backdrop-blur-sm px-4">
  <div className="w-full max-w-lg rounded-xl bg-white/70 backdrop-blur-md shadow-xl border border-white/30 p-6 sm:p-8">
    <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
      📧 Send Mail to <span className="font-bold">{user.name}</span>
    </h2>

    {/* Subject Input */}
    <input
      type="text"
      placeholder="Subject"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all mb-4"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />

    {/* Message Textarea */}
    <textarea
      placeholder="Message"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 placeholder-gray-500 transition-all h-32 mb-6 resize-none"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      <button
        onClick={onClose}
        className="w-full sm:w-auto px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm"
      >
        ❌ Cancel
      </button>
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition"
      >
        {loading ? 'Sending...' : '📤 Send'}
      </button>
    </div>
  </div>
</div>

  );
}
