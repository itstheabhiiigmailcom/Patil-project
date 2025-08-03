import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { setUser } from '../store/authSlice';
import { verifyOtpAPI, resendOtpAPI, getOtpExpiryAPI } from '../api/otp';
import toast from 'react-hot-toast';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((s) => s.auth.user);
  const { status } = useSelector((s) => s.auth);

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const [expiresAt, setExpiresAt] = useState(null); // timestamp in ms
  const [timeLeft, setTimeLeft] = useState(0);

  // On mount or reload: fetch email & expiry
  useEffect(() => {
    const storedEmail = localStorage.getItem('emailForOtp');
    if (!storedEmail) {
      navigate('/signup');
    } else {
      setEmail(storedEmail);
      fetchExpiryTime(storedEmail);
    }
  }, [navigate]);

  // Timer logic - only watch expiresAt
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((expiresAt - now) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer(); // Set immediately
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Reset error on OTP input change
  useEffect(() => {
    if (otpError) setOtpError('');
  }, [otp]);

  // Fetch expiry from backend and sync timer
  const fetchExpiryTime = async (emailToCheck) => {
    try {
      const res = await getOtpExpiryAPI(emailToCheck);
      const backendExpiresAt = new Date(res.expiresAt).getTime();
      const now = Date.now();
      if (backendExpiresAt > now) {
        setExpiresAt(backendExpiresAt);
      } else {
        setExpiresAt(null);
        setTimeLeft(0);
      }
    } catch (err) {
      console.error('Failed to fetch OTP expiry:', err);
      toast.error('Unable to check OTP expiry');
      setExpiresAt(null);
      setTimeLeft(0);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      toast.error('OTP has expired. Please resend to get a new OTP.');
      return;
    }

    try {
      const res = await verifyOtpAPI({ email, otp });
      dispatch(setUser(res.user));
      localStorage.removeItem('emailForOtp');
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || 'Invalid or expired OTP';
      setOtpError(message);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await resendOtpAPI(email);
      toast.success('OTP resent successfully');
      setOtp('');
      setOtpError('');
      await fetchExpiryTime(email); // Re-fetch new expiry
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Verify Your Email
        </h2>
        <p className="mb-4 text-center text-gray-600">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className={`w-full rounded border px-3 py-2 outline-none focus:ring-2 ${
              otpError
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:ring-indigo-600'
            }`}
          />
          {otpError && <p className="text-sm text-red-600">{otpError}</p>}

          <button
            type="submit"
            disabled={status === 'loading' || timeLeft <= 0}
            className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {timeLeft <= 0
              ? 'OTP Expired'
              : status === 'loading'
              ? 'Verifying...'
              : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {timeLeft > 0 ? (
            <p className="mb-2 text-gray-600">
              OTP expires in: <strong>{formatTime(timeLeft)}</strong>
            </p>
          ) : (
            <p className="mb-2 text-red-600 font-medium">OTP has expired.</p>
          )}
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || timeLeft > 0}
            className="text-indigo-600 hover:underline disabled:opacity-50"
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </section>
  );
}
