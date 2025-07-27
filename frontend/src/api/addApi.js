import axios from 'axios';

export async function uploadAd(form) {
  const data = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (key === 'file' && val) data.append('file', val);
    else if (val !== undefined && val !== null) data.append(key, val);
  });

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/upload-ad`,
    data,
    { withCredentials: true }
  );

  return response.data;
}

export const fetchMyAds = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/my-ads`, {
      withCredentials: true,
    });

    return res.data.ads || [];
  } catch (err) {
    console.error('Failed to load your ads:', err);
    throw err;
  }
}
export const updateCredit = async (newCredit) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/advertiser/updateCredit`,
      { credit: newCredit },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error('Failed to update credit:', err);
  }
};

export const submitAdFeedback = async (adId, comment, sentiment) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/ads/feedback/${adId}`,
    { comment, sentiment: sentiment || 'not-reacted' },
    { withCredentials: true }
  );
  return response.data;
};

export const fetchAnalyticsData = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/ads/analytics`,
    { withCredentials: true }
  );
  return response.data;
};