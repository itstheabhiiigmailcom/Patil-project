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
import UploadAd from './pages/upload';
import WatchAd from './pages/WatchAdd';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import History from './pages/Histry';
import ContactForm from './components/Contact';
import EditProfile from './components/EditProfile';
import UserProfile from './components/UserProfile';

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
        <Route path="upload" element={<ProtectedRoute>
          <UploadAd />
        </ProtectedRoute>} />
        <Route path="my-ads" element={<ProtectedRoute>
          <AdvertiserDashboard />
        </ProtectedRoute>} />
        <Route path="watch" element={
          <ProtectedRoute>
            <WatchAd  />
          </ProtectedRoute>
        } />
        <Route path="history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        {/* Add more dashboard routes as needed */}
        <Route path="account" element={<Empty />} />
        <Route path="contact" element={<ProtectedRoute>
          <ContactForm />
        </ProtectedRoute>} />
      </Route>
      <Route path='/edit-profile' element={<ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>} />

      {/* -------- FALLBACKS -------- */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
