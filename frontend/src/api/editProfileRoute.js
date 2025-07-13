// src/routes/editProfileRoute.js
import axios from 'axios';

export async function updateUserProfile(data) {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/edit-profile`, data, {
      withCredentials: true,
    });

    return { success: true, msg: res.data.message };
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Something went wrong';
    return { error: true, msg: errorMsg };
  }
}
