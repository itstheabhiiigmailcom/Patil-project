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

<div className="max-w-6xl mx-auto p-4">
  {/* Back Button */}
  <div className="mb-6">
    <button
      onClick={() => navigate('/dashboard')}
      className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md transition-all duration-300 hover:from-green-400 hover:to-emerald-500 hover:shadow-xl transform hover:-translate-y-1"
    >
      ← Back to Dashboard
    </button>
  </div>

  {/* Search Input */}
  <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
    <input
      type="text"
      placeholder="Search by email..."
      className="flex-1 w-full sm:w-auto p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <button
      onClick={handleSearch}
      disabled={loading}
      className={`w-full sm:w-auto px-5 py-3 rounded-md font-semibold transition ${
        loading
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {loading ? 'Searching...' : 'Search'}
    </button>
  </div>

  {/* User Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {results.map((user) => (
      <div
        key={user._id}
        className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 transition hover:shadow-md"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-800">
            <User className="text-indigo-500" />
            <span className="font-semibold text-lg">{user.name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="text-blue-500" />
            <span>{user.email}</span>
          </div>

          {user.role === 'user' && (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <Info className="text-gray-500" />
                <span>Age: {user.age}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Star className="text-yellow-500" />
                <span>
                  Interests: {user.interests?.join(', ') || 'None'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="text-purple-500" />
                <span>Time: {user.time?.join(', ') || 'None'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="text-green-500" />
                <span>
                  Email Verified: {user.isEmailVerified ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="text-gray-500" />
                <span>
                  Created: {new Date(user.createdAt).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleManageUser(user)}
            className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Manage User
          </button>
          <button
            onClick={() => handleSendMail(user)}
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Send Mail
          </button>
          {user.role === 'advertiser' && (
            <button
              onClick={() => handleAddCredit(user)}
              className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Add Credit
            </button>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* Edit Modal */}
  {showEditModal && selectedUser && (
    <EditUserModal
      user={selectedUser}
      onClose={handleCloseModals}
      onUpdated={handleRefresh}
    />
  )}

  {/* Mail Modal */}
  {showMailModal && selectedUser && (
    <SendMailForm user={selectedUser} onClose={handleCloseModals} />
  )}

  {/* Add Credit Modal */}
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
