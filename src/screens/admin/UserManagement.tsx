
import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const toggleBlock = (userId: string) => {
    const allUsers = db.getUsers();
    const updated = allUsers.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u);
    db.setUsers(updated);
    setUsers(updated);
  };

  const editBalance = (userId: string) => {
    const amount = prompt("Enter new balance amount:");
    if (amount !== null && !isNaN(Number(amount))) {
       const allUsers = db.getUsers();
       const updated = allUsers.map(u => u.id === userId ? { ...u, walletBalance: Number(amount) } : u);
       db.setUsers(updated);
       setUsers(updated);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-xl font-bold font-gaming mb-6 uppercase neon-text-purple">User Management</h2>

      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="bg-[#0d041a] border border-purple-900/30 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-white">{u.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase">{u.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">₹{u.walletBalance}</p>
                <span className={`text-[8px] font-bold uppercase ${u.isBlocked ? 'text-red-500' : 'text-blue-500'}`}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => editBalance(u.id)}
                className="flex-1 bg-purple-900/30 border border-purple-900/50 text-[10px] font-bold py-2 rounded-lg uppercase"
              >
                Edit Balance
              </button>
              <button 
                onClick={() => toggleBlock(u.id)}
                className={`flex-1 text-[10px] font-bold py-2 rounded-lg uppercase ${
                  u.isBlocked ? 'bg-blue-600/20 text-blue-500' : 'bg-red-600/20 text-red-500'
                }`}
              >
                {u.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
