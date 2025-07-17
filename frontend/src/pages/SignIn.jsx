// pages/SignIn.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { useSelector } from 'react-redux';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function SignIn() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '',
    role: 'user' // default role
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      navigate('/dashboard'); // go home on success
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Welcome back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Role picker */}
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

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider - Only show for users, not advertisers */}
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

        {/* Google Sign In Button - Only show for users, not advertisers */}
        {form.role === 'user' && (
          <GoogleSignInButton text="Sign in with Google" />
        )}

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}