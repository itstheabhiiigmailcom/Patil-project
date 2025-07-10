// components/ContactForm.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendContactMessage } from '../api/contactApi';

export default function ContactForm() {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.name || !user?.email) {
      return setStatus('User information missing. Please login again.');
    }

    const payload = {
      name: user.name,
      email: user.email,
      message: form.message,
    };

    try {
      setLoading(true);
      await sendContactMessage(payload);
      setStatus('✅ Message sent successfully!');
      setForm({ message: '' });
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-sm text-gray-600">
          Sending as <span className="font-medium text-gray-900">{user?.name}</span> (<span className="text-blue-600">{user?.email}</span>)
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            placeholder="Write your message here..."
            value={form.message}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
        {status && (
          <div className={`text-sm font-medium ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
