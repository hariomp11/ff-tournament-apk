
import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Transaction, TransactionStatus, TransactionType } from '../../types';

const PaymentApprovals: React.FC = () => {
  const [pending, setPending] = useState<Transaction[]>([]);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = () => {
    const txs = db.getTransactions();
    setPending(txs.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.PENDING));
  };

  const handleAction = (txId: string, action: 'approve' | 'reject') => {
    const txs = db.getTransactions();
    const users = db.getUsers();
    
    const tx = txs.find(t => t.id === txId);
    if (!tx) return;

    if (action === 'approve') {
      tx.status = TransactionStatus.APPROVED;
      // Add balance to user
      const userIndex = users.findIndex(u => u.id === tx.userId);
      if (userIndex !== -1) {
        users[userIndex].walletBalance += tx.amount;
      }
    } else {
      tx.status = TransactionStatus.REJECTED;
    }

    db.setTransactions(txs);
    db.setUsers(users);
    loadPending();
    alert(`Payment ${action}d successfully!`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-xl font-bold font-gaming mb-6 uppercase neon-text-purple">Deposit Requests</h2>

      {pending.length === 0 ? (
        <div className="text-center py-20 bg-purple-900/10 rounded-3xl">
           <p className="text-gray-500 uppercase tracking-widest text-sm">No pending payments</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map(tx => (
            <div key={tx.id} className="bg-[#0d041a] border border-purple-900/30 rounded-3xl overflow-hidden">
              <div className="p-5 flex justify-between items-start">
                <div>
                   <p className="text-xs font-bold text-gray-400">User ID: {tx.userId}</p>
                   <p className="text-2xl font-bold text-green-400">₹{tx.amount}</p>
                   <p className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] uppercase font-bold border border-yellow-500/20">
                  Pending
                </div>
              </div>
              
              <div className="px-5 pb-5">
                <p className="text-[10px] text-gray-500 uppercase mb-2">Screenshot Proof</p>
                <div className="rounded-xl overflow-hidden mb-4 border border-purple-900/30">
                  <img src={tx.screenshotUrl} alt="receipt" className="w-full h-40 object-cover" />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAction(tx.id, 'approve')}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-green-600/20"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleAction(tx.id, 'reject')}
                    className="flex-1 bg-red-600/20 border border-red-600/50 text-red-500 font-bold py-3 rounded-xl uppercase text-xs tracking-widest"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;
