import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { TransactionType, TransactionStatus } from '../types';

const DepositScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) < 10) {
      alert('Please enter a valid amount (minimum ₹10)');
      return;
    }

    // Validate screenshot
    if (!screenshot) {
      alert('Please upload payment screenshot');
      return;
    }

    if (!user) {
      alert('User not logged in');
      return;
    }

    setSubmitting(true);

    // Simulate upload + DB save
    setTimeout(() => {
      const txs = db.getTransactions();

      txs.push({
        id: Math.random().toString(36).substring(2, 11),
        userId: user.id,
        amount: Number(amount),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
        screenshotUrl: URL.createObjectURL(screenshot), // TEMP (frontend only)
      });

      db.setTransactions(txs);

      setSubmitting(false);
      alert('Payment submitted! Please wait for admin approval.');
      navigate('/wallet');
    }, 1200);
  };

  return (
    <div className="p-6 max-w-lg mx-auto h-full">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-500"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold font-gaming mb-2 uppercase">
        Add Cash
      </h2>
      <p className="text-gray-400 text-sm mb-8">
        Pay using any UPI app and upload screenshot.
      </p>

      {/* QR BOX */}
      <div className="bg-[#0d041a] border border-purple-900/30 rounded-3xl p-6 text-center mb-8">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
          Scan to Pay
        </p>

        <div className="w-48 h-48 bg-white p-4 mx-auto rounded-2xl mb-4">
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

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">
            Amount to Add (₹)
          </label>
          <input
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min ₹10"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        {/* Screenshot Upload */}
        <div className="border-2 border-dashed border-purple-900/50 rounded-2xl p-8 text-center bg-purple-900/5">
          <p className="text-xs text-gray-500 mb-3 uppercase">
            Upload Payment Screenshot
          </p>

          <input
            type="file"
            id="screenshot"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setScreenshot(e.target.files ? e.target.files[0] : null)
            }
            required
          />

          <label
            htmlFor="screenshot"
            className="bg-purple-900/30 px-6 py-2 rounded-lg text-sm font-bold border border-purple-900 cursor-pointer inline-block"
          >
            {screenshot ? 'Image Selected ✓' : 'Browse Files'}
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-widest disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Submit Payment'}
        </button>
      </form>
    </div>
  );
};

export default DepositScreen;
