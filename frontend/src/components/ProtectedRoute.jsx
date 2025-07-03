// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from '../store/authSlice';

/**
 * Protect a route. Always re‑checks the session against the server.
 *
 * @param {React.ReactNode} children      Page/component to render on success.
 * @param {string|string[]} [allowedRoles] Optional: role(s) that may enter.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector((s) => s.auth);

  /* Kick /me exactly once */
  useEffect(() => {
    if (status === 'idle') dispatch(fetchCurrentUser());
  }, [dispatch, status]);

  /* 1️⃣  Waiting for the check */
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-600">Checking session…</span>
      </div>
    );
  }

  /* 2️⃣  Not authenticated */
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  /* 3️⃣  Role guard */
  if (
    allowedRoles &&
    (Array.isArray(allowedRoles)
      ? !allowedRoles.includes(user?.user.role)
      : user?.user.role !== allowedRoles)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* 4️⃣  All good */
  return children;
}
