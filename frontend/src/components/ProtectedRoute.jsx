// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from '../store/authSlice';

export default function ProtectedRoute({ children, allowedRoles }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector((s) => s.auth);

  // On mount or idle, fetch user
  useEffect(() => {
    if (status === 'idle') dispatch(fetchCurrentUser());
  }, [dispatch, status]);

  // 1️⃣ Loading state
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-600">Checking session…</span>
      </div>
    );
  }

  // 2️⃣ Not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 4️⃣ Role guard
  if (
    allowedRoles &&
    (Array.isArray(allowedRoles)
      ? !allowedRoles.includes(user.role)
      : user.role !== allowedRoles)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5️⃣ All good
  return children;
}
