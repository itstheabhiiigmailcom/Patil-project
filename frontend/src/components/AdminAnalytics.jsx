import React, { useEffect, useState } from 'react';
import { fetchAdminAnalytics } from '../api/adminApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const result = await fetchAdminAnalytics();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    getAnalytics();
  }, []);

  if (loading) return <div className="text-center py-10">Loading analytics...</div>;
  if (!data) return <div className="text-center text-red-500">No analytics data available.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Platform-wide Ad Analytics</h1>

      {/* Views Over Time */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Views Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.viewsOverTime}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="_id.date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Most Viewed Ads */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Most Viewed Ads</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.mostViewed}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Most Liked Ads */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Most Liked Ads</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.mostLiked}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Most Disliked Ads */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Most Disliked Ads</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.mostDisliked}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
