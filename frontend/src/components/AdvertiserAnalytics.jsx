import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AdvertiserAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/ads/analytics`, { withCredentials: true })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p className="text-center py-10">Loading analytics...</p>;

  // Optional: format long titles
  const formatTitle = (title) => (title?.length > 20 ? title.slice(0, 20) + '...' : title);

  return (
    <div className="space-y-10">
      {/* Views Over Time */}
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

      {/* Most Viewed Ads */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Viewed Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostViewed}>
            <XAxis dataKey={(ad) => formatTitle(ad.title)} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Liked Ads */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Liked Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostLiked}>
            <XAxis dataKey={(ad) => formatTitle(ad.title)} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Disliked Ads */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Most Disliked Ads</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.mostDisliked}>
            <XAxis dataKey={(ad) => formatTitle(ad.title)} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
