
import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Transaction, TransactionStatus, TransactionType } from '../../types';

const WithdrawApprovals: React.FC = () => {
  const [pending, setPending] = useState<Transaction[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = () => {
    const txs = db.getTransactions();
    setPending(txs.filter(t => t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.PENDING));
  };

  const handleAction = (txId: string, action: 'pay' | 'reject') => {
    const txs = db.getTransactions();
    const users = db.getUsers();
    
    const tx = txs.find(t => t.id === txId);
    if (!tx) return;

    if (action === 'pay') {
      tx.status = TransactionStatus.APPROVED;
      // Money already deducted at request time, just mark paid
    } else {
      tx.status = TransactionStatus.REJECTED;
      // Refund balance
      const userIndex = users.findIndex(u => u.id === tx.userId);
      if (userIndex !== -1) {
        users[userIndex].walletBalance += tx.amount;
      }
    }

    db.setTransactions(txs);
    db.setUsers(users);
    loadPending();
    alert(`Withdrawal marked as ${action === 'pay' ? 'Paid' : 'Rejected'}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-xl font-bold font-gaming mb-6 uppercase neon-text-pink">Withdraw Requests</h2>

      {pending.length === 0 ? (
        <div className="text-center py-20 bg-purple-900/10 rounded-3xl">
           <p className="text-gray-500 uppercase tracking-widest text-sm">No pending withdrawals</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map(tx => (
            <div key={tx.id} className="bg-[#0d041a] border border-pink-900/30 rounded-3xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-2xl font-bold text-white">₹{tx.amount}</p>
                   <p className="text-[10px] text-gray-500">Request: {new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-pink-500 font-bold uppercase">UPI ID</p>
                  <p className="text-xs font-gaming text-pink-400 select-all">{tx.upiId}</p>
                </div>
              </div>
              
              <div className="bg-pink-900/10 border border-pink-900/30 p-3 rounded-xl mb-4 text-xs text-gray-400">
                Instruction: Manually pay <b>₹{tx.amount}</b> to <b>{tx.upiId}</b> from your admin UPI app first.
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(tx.id, 'pay')}
                  className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-pink-600/20"
                >
                  Confirm Paid
                </button>
                <button 
                  onClick={() => handleAction(tx.id, 'reject')}
                  className="flex-1 bg-gray-800 text-gray-400 font-bold py-3 rounded-xl uppercase text-xs tracking-widest"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawApprovals;
