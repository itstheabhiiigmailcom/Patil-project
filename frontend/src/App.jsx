import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import NotFoundPage from './pages/NotFound';

/* empty stubs – replace later */
const Empty = () => <div />;

export default function App() {
  return (
    <Routes>
      {/* -------- PUBLIC -------- */}
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} /> {/* "/" */}
        <Route
          path="signin"
          element={
            <GuestRoute>
              <SignIn />
            </GuestRoute>
          }
        />
        <Route
          path="signup"
          element={
            <GuestRoute>
              <SignUp />
            </GuestRoute>
          }
        />
      </Route>

      {/* -------- DASHBOARD (auth‑only) -------- */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'advertiser', 'user']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Empty />} /> {/* /dashboard */}
        <Route path="upload" element={<Empty />} />
        <Route path="stats" element={<Empty />} />
        <Route path="my-ads" element={<Empty />} />
        <Route path="watch" element={<Empty />} />
        <Route path="account" element={<Empty />} />
      </Route>

      {/* -------- FALLBACKS -------- */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
