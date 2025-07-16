import React, { useState } from 'react';
import { updateUser, deleteUser, banUser } from '../api/adminApi';

export default function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState(user);
  const [banDays, setBanDays] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUser(user._id, form);
    onUpdated();
    onClose();
  };

  const handleBan = async () => {
    await banUser(user._id, parseInt(banDays));
    onUpdated();
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(user._id);
      onUpdated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <input
          className="w-full mb-2 p-2 border rounded"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="age"
          type="number"
          value={form.age || ''}
          onChange={handleChange}
          placeholder="Age"
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          name="interests"
          value={form.interests?.join(', ') || ''}
          onChange={(e) =>
            setForm({ ...form, interests: e.target.value.split(',').map(i => i.trim()) })
          }
          placeholder="Interests (comma separated)"
        />

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>

        <div className="mt-4">
          <input
            type="number"
            className="w-full p-2 border rounded mb-2"
            placeholder="Ban for (days)"
            value={banDays}
            onChange={(e) => setBanDays(e.target.value)}
          />
          <button
            onClick={handleBan}
            className="w-full bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Ban User
          </button>
        </div>

        <button
          className="w-full mt-4 text-gray-600"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
