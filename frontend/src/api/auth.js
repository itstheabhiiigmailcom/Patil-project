// src/api/auth.js
import { apiRequest } from './apiClient';

export const loginAPI = async (cred) => {
  const res = await apiRequest('/auth/login', { method: 'POST', body: cred });
  return res.user; // ✅ only return the user object
};

export const registerAPI = async (data) => {
  const res = await apiRequest('/auth/register', {
    method: 'POST',
    body: data,
  });
  return res.user; // ✅ only return the user object
};

export const logoutAPI = () => apiRequest('/auth/logout', { method: 'POST' });

export const currentUserAPI = async () => {
  const res = await apiRequest('/auth/me');
  return res.user; // ✅ return only the user object
};
