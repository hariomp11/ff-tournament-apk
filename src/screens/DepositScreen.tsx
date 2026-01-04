import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { db } from '../db';
import { TransactionType, TransactionStatus } from '../types';

const DepositScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return <p className="text-center text-red-500">User not logged in</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) < 10) {
      alert('Minimum deposit amount is ₹10');
      return;
    }

    if (!screenshot) {
      alert('Please upload payment screenshot');
      return;
    }

    setSubmitting(true);

    try {
      const transactions = db.getTransactions();

      transactions.push({
        id: crypto.randomUUID(),
        userId: user.id,
        amount: Number(amount),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING, // ✅ ENUM: pending
        screenshotName: screenshot.name,
        createdAt: Date.now()
      });

      db.setTransactions(transactions);

      alert(
        'Deposit request submitted!\n\nStatus: PENDING\nAdmin will approve shortly.'
      );

      navigate('/wallet');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto h-full">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold uppercase mb-2">
        Add Money
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Pay via UPI & upload screenshot
      </p>

      {/* UPI QR */}
      <div className="bg-[#0d041a] border border-purple-900/40 rounded-3xl p-6 text-center mb-8">
        <p className="text-[10px] text-gray-500 uppercase mb-4">
          Scan to Pay
        </p>

        <div className="w-48 h-48 bg-white p-4 mx-auto rounded-xl mb-4">
          <img
            src="/payments/upi-qr.png"
            alt="UPI QR"
            className="w-full h-full object-contain"
          />
        </div>

        <p className="text-sm font-bold text-purple-400">
          UPI ID: hariompatidar33@ibl
        </p>
      </div>

      {/* Deposit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-xs uppercase mb-2 text-gray-500">
            Amount (₹)
          </label>
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum ₹10"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white"
            required
          />
        </div>

        {/* Screenshot */}
        <div className="border-2 border-dashed border-purple-900/50 rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 mb-2 uppercase">
            Upload Payment Screenshot
          </p>

          <input
            type="file"
            accept="image/*"
            id="screenshot"
            className="hidden"
            onChange={(e) =>
              setScreenshot(e.target.files?.[0] || null)
            }
            required
          />

          <label
            htmlFor="screenshot"
            className="inline-block bg-purple-900/30 px-6 py-2 rounded-lg text-sm font-bold cursor-pointer"
          >
            Browse File
          </label>

          {screenshot && (
            <p className="text-xs mt-2 text-green-400">
              {screenshot.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 py-4 rounded-xl font-bold uppercase disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  );
};

export default DepositScreen;
