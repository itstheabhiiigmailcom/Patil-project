import { apiRequest } from './apiClient';

export const loginAPI = (cred) =>
  apiRequest('/auth/login', { method: 'POST', body: cred });
export const registerAPI = (data) =>
  apiRequest('/auth/register', { method: 'POST', body: data });
export const logoutAPI = () => apiRequest('/auth/logout', { method: 'POST' });
export const currentUserAPI = () => apiRequest('/auth/me'); // GET
