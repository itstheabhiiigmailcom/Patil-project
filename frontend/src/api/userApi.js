import axios from 'axios';

export const fetchUserAdHistory = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/history/${userId}`, {
    withCredentials: true,
  });
  return res.data.ads || [];
};
