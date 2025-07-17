import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/adminApi';
import EditUserModal from './AdmineEdit';
import { useNavigate } from 'react-router-dom';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleManageUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleRefresh = () => {
    fetchUsers(); // refresh user list after update/delete
  };

  if (loading) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Back Button at Top Left */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/users')}
          className="px-6 py-3 text-xs uppercase tracking-widest font-medium text-black bg-white rounded-full shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#23c483] hover:text-white hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] transform hover:-translate-y-2 active:translate-y-0"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
            <button
              onClick={() => handleManageUser(user)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Manage User
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdated={handleRefresh}
        />
      )}
    </div>
  );
}
