import axios from 'axios';

export const fetchUserAdHistory = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/history/${userId}`, {
    withCredentials: true,
  });
  return res.data.ads || [];
};


export const fetchAdsForUser = async (userId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/ads/for-user/${userId}`,
    { withCredentials: true }
  );
  return res.data.ads || [];
};

export const updateUserAge = async (age) => {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/auth/set-age`,
    { age },
    { withCredentials: true }
  );
};


export const addDiaryEntry = async (data) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/diary`,
    data,
    { withCredentials: true }
  );
};
export const showDiaryEntry = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/diaryget`, {
    withCredentials: true,
  });
  return res.data;
};
export const deleteDiaryEntry = async (index) => {
  await axios.delete(
    `${import.meta.env.VITE_API_URL}/diary/${index}`,
    { withCredentials: true }
  );
};