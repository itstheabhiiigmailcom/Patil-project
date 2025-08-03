import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { register } from '../store/authSlice';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    companyName: '', // <-- Added
    mobileNumber: '', // <-- Added
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (form.role === 'user') {
        delete payload.companyName;
        delete payload.mobileNumber;
      }

      await dispatch(register(payload)).unwrap();
      // ✅ Save email for OTP verification
      localStorage.setItem('emailForOtp', form.email);
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Create account</h2>

        {/* ── SIGN‑UP FORM ─────────────────────────────── */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Additional Fields for Advertiser - Moved ABOVE Role Picker */}
          {form.role === 'advertiser' && (
            <>
              {/* Company Name */}
              <input
                name="companyName"
                placeholder="Company Name"
                required
                value={form.companyName}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
              />

              {/* Mobile Number */}
              <input
                name="mobileNumber"
                placeholder="Mobile Number"
                required
                value={form.mobileNumber}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </>
          )}

          {/* Role picker - Appears below Advertiser fields */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === 'user'}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <span>User</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="advertiser"
                checked={form.role === 'advertiser'}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              <span>Advertiser</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {status === 'loading' ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        {form.role === 'user' && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
        )}

        {/* Google Sign In Button - Only for users */}
        {form.role === 'user' && (
          <GoogleSignInButton text="Sign up with Google" />
        )}

        {/* Error message */}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {/* Switch to sign‑in */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="text-indigo-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
