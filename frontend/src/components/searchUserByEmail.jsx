import React, { useState } from 'react';
import { searchUsers } from '../api/adminApi';
import { Mail, User, Calendar, Clock, ShieldCheck, Star, Info } from 'lucide-react';
import EditUserModal from './AdmineEdit';
import SendMailForm from './AdminMail';
import AddCreditForm from './AddCredit';
import { useNavigate } from 'react-router-dom';

export default function UserSearch() {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const users = await searchUsers(email);
      setResults(users);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowMailModal(false);
    setShowAddCreditModal(false);
  };

  const handleSendMail = (user) => {
    setSelectedUser(user);
    setShowMailModal(true);
    setShowEditModal(false);
    setShowAddCreditModal(false);
  };

  const handleAddCredit = (user) => {
    setSelectedUser(user);
    setShowAddCreditModal(true);
    setShowEditModal(false);
    setShowMailModal(false);
  };

  const handleCloseModals = () => {
    setSelectedUser(null);
    setShowEditModal(false);
    setShowMailModal(false);
    setShowAddCreditModal(false);
  };

  const handleRefresh = () => {
    handleSearch(); // refresh list
  };

  return (

    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/users')}
          className="px-6 py-3 text-xs uppercase tracking-widest font-medium text-black bg-white rounded-full shadow-[0px_8px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-[#23c483] hover:text-white hover:shadow-[0px_15px_20px_rgba(46,229,157,0.4)] transform hover:-translate-y-2 active:translate-y-0"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          className="flex-1 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
            <div className="flex items-center gap-2 mb-2">
              <User className="text-gray-600" />
              <span className="font-semibold text-lg">{user.name}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-gray-600" />
              <span>{user.email}</span>
            </div>

            {user.role === 'user' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-gray-600" />
                  <span>Age: {user.age}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-gray-600" />
                  <span>Interests: {user.interests?.join(', ') || 'None'}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-gray-600" />
                  <span>Time: {user.time?.join(', ') || 'None'}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-gray-600" />
                  <span>
                    Email Verified: {user.isEmailVerified ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-gray-600" />
                  <span>Created: {new Date(user.createdAt).toLocaleString()}</span>
                </div>
              </>
            )}

            <button
              onClick={() => handleManageUser(user)}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Manage User
            </button>
            <button
              onClick={() => handleSendMail(user)}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Send Mail
            </button>
            {user.role === 'advertiser' && (
              <button
                onClick={() => handleAddCredit(user)}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
              >
                Add Credit
              </button>
            )}
          </div>
        ))}
      </div>

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModals}
          onUpdated={handleRefresh}
        />
      )}

      {showMailModal && selectedUser && (
        <SendMailForm
          user={selectedUser}
          onClose={handleCloseModals}
        />
      )}

      {showAddCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add Credit to {selectedUser.name}
            </h2>
            <AddCreditForm
              userId={selectedUser._id}
              onSuccess={() => {
                handleCloseModals();
                handleRefresh();
              }}
            />
            <button
              onClick={handleCloseModals}
              className="mt-4 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
