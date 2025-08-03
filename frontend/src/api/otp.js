// src/api/otp.api.js
import { apiRequest } from './apiClient';

export const verifyOtpAPI = async ({ email, otp }) => {
  try {
    const res = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: { email, otp },
    });
    return res; // { user, message }
  } catch (err) {
    throw new Error(err.message || 'Failed to verify OTP');
  }
};

export const resendOtpAPI = async (email) => {
  try {
    const res = await apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: { email },
    });
    return res; // { message }
  } catch (err) {
    throw new Error(err.message || 'Failed to resend OTP');
  }
};

export const getOtpExpiryAPI = async (email) => {
  const res = await apiRequest(
    `/auth/get-otp-expiry?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
    }
  );
  return res;
};
