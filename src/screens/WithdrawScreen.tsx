
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { TransactionType, TransactionStatus } from '../types';

const WithdrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (val < 50) {
      alert("Minimum withdrawal is ₹50");
      return;
    }
    if (val > (user?.walletBalance || 0)) {
      alert("Insufficient balance!");
      return;
    }
    if (!upiId) {
      alert("Please enter UPI ID");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      // 1. Deduct immediately (Lock funds)
      const allUsers = db.getUsers();
      const updatedUsers = allUsers.map(u => 
        u.id === user?.id ? { ...u, walletBalance: u.walletBalance - val } : u
      );
      db.setUsers(updatedUsers);

      // 2. Create Transaction
      const txs = db.getTransactions();
      txs.push({
        id: Math.random().toString(36).substr(2, 9),
        userId: user!.id,
        amount: val,
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.PENDING,
        timestamp: Date.now(),
        upiId: upiId
      });
      db.setTransactions(txs);

      refreshUser();
      setSubmitting(false);
      alert("Withdrawal request sent! Funds will arrive in your bank in 2-4 hours.");
      navigate('/wallet');
    }, 1500);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500">← Back</button>
      <h2 className="text-2xl font-bold font-gaming mb-2 uppercase">Withdraw Money</h2>
      <p className="text-gray-400 text-sm mb-8">Transfer winnings to your bank account via UPI.</p>

      <div className="bg-purple-900/20 rounded-2xl p-4 mb-8 border border-purple-500/20">
         <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Withdrawable Balance</p>
         <h2 className="text-2xl font-bold text-green-400">₹{user?.walletBalance}</h2>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-6">
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Amount to Withdraw (₹)</label>
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min ₹50"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-500 mb-2">Your UPI ID (e.g. name@paytm)</label>
          <input 
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="Enter your UPI handle"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 uppercase text-xs"
            required
          />
        </div>

        <div className="bg-[#0d041a] p-4 rounded-xl border border-yellow-500/30">
          <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Important</p>
          <p className="text-[10px] text-gray-400">Ensure UPI ID is correct. Admin is not responsible for transfers to wrong addresses.</p>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-widest disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Send Request"}
        </button>
      </form>
    </div>
  );
};

export default WithdrawScreen;
