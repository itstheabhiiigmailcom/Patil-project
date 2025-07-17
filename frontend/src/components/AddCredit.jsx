// src/components/AddCreditForm.jsx
import { useState } from 'react';
import { addCredit } from '../api/adminApi';

export default function AddCreditForm({ userId, onSuccess }) {
  const [amount, setAmount] = useState('');

  const handleAddCredit = async () => {
    if (!amount) return alert('Enter amount');

    try {
      const res = await addCredit(userId, amount);
      alert('Credit added: ₹' + res.credit);
      onSuccess?.();
      setAmount('');
    } catch (err) {
      console.error(err);
      alert('Failed to add credit');
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="number"
        value={amount}
        placeholder="Credit amount"
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <button
        onClick={handleAddCredit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Credit
      </button>
    </div>
  );
}
