// src/api/getAllUsers.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/users`, {
    withCredentials: true,
  });
  return res.data.users;
};

export const updateUser = (id, updates) =>
  axios.put(`${API_URL}/admin/users/${id}`, updates, {
    withCredentials: true,
  });

export const deleteUser = (id) =>
  axios.delete(`${API_URL}/admin/users/${id}`, {
    withCredentials: true,
  });

/**
 * Ban user with given date-time range
 * @param {string} id - User ID
 * @param {Object} dates - { banFrom: ISOString, banTo: ISOString }
 */
export const banUser = (id, { banFrom, banTo }) =>
  axios.put(
    `${API_URL}/admin/users/${id}/ban`,
    { banFrom, banTo },
    { withCredentials: true }
  );

/**
 * Unban a user
 * @param {string} id - User ID
 */
export const unbanUser = (id) =>
  axios.put(`${API_URL}/admin/users/${id}/unban`, null, {
    withCredentials: true,
  });

export const searchUsers = async (email) => {
  const res = await axios.get(`${API_URL}/admin/users/search`, {
    params: { email },
    withCredentials: true,
  });
  return res.data;
};

export async function sendAdminMail(data) {
  return axios.post(`${API_URL}/admin/mail`, data, {
    withCredentials: true,
  });
}

export async function addCredit(userId, amount) {
  return axios.post(
    `${API_URL}/admin/credit`,
    { userId, amount: Number(amount) },
    { withCredentials: true }
  );
}

export const fetchAdminAnalytics = async () => {
  const response = await axios.get(`${API_URL}/admin/ads/analytics`, {
    withCredentials: true,
  });
  return response.data;
};
