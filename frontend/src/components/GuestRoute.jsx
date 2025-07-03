import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Only render `children` when NOT authenticated.
 * Otherwise redirect to `to`.
 */
export default function GuestRoute({ children, to = '/dashboard' }) {
  const user = useSelector((s) => s.auth.user);

  if (user) {
    return <Navigate to={to} replace />;
  }

  return children;
}
