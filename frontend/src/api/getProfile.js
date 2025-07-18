import axios from 'axios';

export async function fetchUserProfile() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
      withCredentials: true,
      
    });
    return res.data;
  } catch (err) {
    console.error('Profile fetch failed:', err);
    return null;
  }
}


