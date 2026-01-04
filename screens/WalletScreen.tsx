
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { Transaction, TransactionType, TransactionStatus } from '../types';

const WalletScreen: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    refreshUser();
    const allTxs = db.getTransactions();
    setTransactions(allTxs.filter(t => t.userId === user?.id).sort((a,b) => b.timestamp - a.timestamp));
  }, [user?.id]);

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold font-gaming mb-6 uppercase tracking-widest">My Wallet</h2>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl shadow-purple-900/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-purple-200 uppercase tracking-[0.3em] text-[10px] font-bold mb-1">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-purple-200">₹</span>
            <h1 className="text-5xl font-black font-gaming tracking-tighter">
              {user?.walletBalance.toLocaleString()}
            </h1>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => navigate('/deposit')}
              className="flex-1 bg-white text-purple-900 font-bold py-3 rounded-xl hover:bg-purple-50 transition-all text-sm uppercase tracking-widest"
            >
              Add Cash
            </button>
            <button 
              onClick={() => navigate('/withdraw')}
              className="flex-1 bg-purple-900/30 backdrop-blur-md border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Transactions</h3>
        {transactions.length > 0 ? (
          transactions.map(tx => (
            <div key={tx.id} className="bg-[#0d041a] border border-purple-900/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WINNING ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WINNING ? '↓' : '↑'}
                </div>
                <div>
                  <p className="text-sm font-bold uppercase truncate w-32">{tx.type.replace('_', ' ')}</p>
                  <p className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WINNING ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WINNING ? '+' : '-'} ₹{tx.amount}
                </p>
                <p className={`text-[8px] uppercase font-bold ${
                  tx.status === TransactionStatus.APPROVED ? 'text-blue-400' : 
                  tx.status === TransactionStatus.PENDING ? 'text-yellow-500' : 'text-red-600'
                }`}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-10 text-xs uppercase italic">No transaction history</p>
        )}
      </div>
    </div>
  );
};

export default WalletScreen;
