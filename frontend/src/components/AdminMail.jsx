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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Send Mail to {user.name}
        </h2>

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-2 border rounded mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Message"
          className="w-full p-2 border rounded mb-3 h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
