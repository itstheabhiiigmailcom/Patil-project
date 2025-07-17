// src/api/contactApi.js
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const sendContactMessage = async (data) => {
  const res = await axios.post(`${BASE_URL}/contact`, data);
  return res.data;
};
