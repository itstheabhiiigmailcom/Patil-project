// src/api/getAllUsers.js
import axios from 'axios';

export const getAllUsers = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
    withCredentials: true,
  });
  return res.data.users;
};

export const updateUser = (id, updates) =>
  axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, updates, { withCredentials: true });

export const deleteUser = (id) =>
  axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, { withCredentials: true });

export const banUser = (id, days) =>
  axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${id}/ban`, { days }, { withCredentials: true });
export const searchUsers = async (email) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users/search`, {
    params: { email },
    withCredentials: true, // include cookies if auth is used
  });
  return res.data;
};


export async function sendAdminMail(data) {
  return axios.post(`${import.meta.env.VITE_API_URL}/admin/mail`, data, {
    withCredentials: true,
  });
}
export async function addCredit(userId,amount) {
  return axios.post(`${import.meta.env.VITE_API_URL}/admin/credit`, {userId,amount:Number(amount)}, {
    withCredentials: true,
  });
}

export const fetchAdminAnalytics = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/ads/analytics`, {
    withCredentials: true, // if using cookies for auth
  });
  return response.data;
};
