import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';

export default function AdvertiserAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/ads/analytics`, { withCredentials: true })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-10">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Views Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.viewsOverTime}>
            <XAxis dataKey="_id.date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#6366F1" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Viewed Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostViewed}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Liked Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostLiked}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Disliked Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostDisliked}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
