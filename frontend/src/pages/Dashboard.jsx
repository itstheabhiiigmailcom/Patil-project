import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <section className="flex min-h-screen pt-16">
      {' '}
      {/* pt-16 keeps space for navbar */}
      <Sidebar />
      {/* Main content area – empty for now */}
      <div className="flex-1 bg-gray-50 p-8">
        <Outlet /> {/* later render nested routes/components here */}
      </div>
    </section>
  );
}
