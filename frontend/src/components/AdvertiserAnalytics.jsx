// src/components/AdvertiserAnalytics.jsx
import { useEffect, useState } from 'react';
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
import { fetchAnalyticsData } from '../api/addApi';

export default function AdvertiserAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData()
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p className="text-center py-10">Loading analytics...</p>;

  const formatTitle = (title) => (title?.length > 20 ? title.slice(0, 20) + '...' : title);

  return (
    <div className="space-y-10">
      {/* Views Over Time */}
      <ChartSection title="Views Over Time">
        <LineChart data={data.viewsOverTime}>
          <XAxis dataKey="_id.date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#6366F1" />
        </LineChart>
      </ChartSection>

      {/* Most Viewed Ads */}
      <ChartSection title="Most Viewed Ads">
        <BarChart data={data.mostViewed}>
          <XAxis dataKey={(ad) => formatTitle(ad.title)} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#22C55E" />
        </BarChart>
      </ChartSection>

      {/* Most Liked Ads */}
      <ChartSection title="Most Liked Ads">
        <BarChart data={data.mostLiked}>
          <XAxis dataKey={(ad) => formatTitle(ad.title)} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ChartSection>

      {/* Most Disliked Ads */}
      <ChartSection title="Most Disliked Ads">
        <BarChart data={data.mostDisliked}>
          <XAxis dataKey={(ad) => formatTitle(ad.title)} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#EF4444" />
        </BarChart>
      </ChartSection>
    </div>
  );
}

function ChartSection({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
