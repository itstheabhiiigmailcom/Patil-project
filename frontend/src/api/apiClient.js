// src/api/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const options = {
    method,
    credentials: 'include', // send cookies
    headers: {}, // start empty
  };

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || 'Request failed');
  }
  return res.json();
}
