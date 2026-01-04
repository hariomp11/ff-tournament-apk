
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../db';
import { Match, Transaction, TransactionStatus, TransactionType, User } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    activeMatches: 0,
    pendingPayments: 0,
    pendingWithdraws: 0
  });

  useEffect(() => {
    const users = db.getUsers();
    const matches = db.getMatches();
    const txs = db.getTransactions();

    setStats({
      users: users.length,
      activeMatches: matches.filter(m => m.status === 'upcoming' || m.status === 'live').length,
      pendingPayments: txs.filter(t => t.type === TransactionType.DEPOSIT && t.status === TransactionStatus.PENDING).length,
      pendingWithdraws: txs.filter(t => t.type === TransactionType.WITHDRAW && t.status === TransactionStatus.PENDING).length
    });
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold font-gaming mb-6 uppercase neon-text-purple">Admin Panel</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard title="Total Users" value={stats.users} icon="👥" link="/admin/users" />
        <StatCard title="Active Matches" value={stats.activeMatches} icon="🎮" />
        <StatCard title="Pending Deps" value={stats.pendingPayments} icon="💰" link="/admin/payments" color="text-yellow-500" />
        <StatCard title="Pending Wds" value={stats.pendingWithdraws} icon="🏦" link="/admin/withdraws" color="text-pink-500" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest">Quick Actions</h3>
        <Link to="/admin/create-match" className="block w-full bg-purple-600 p-4 rounded-2xl text-center font-bold uppercase tracking-widest neon-glow">
          Create New Match
        </Link>
        <Link to="/home" className="block w-full bg-[#0d041a] border border-purple-900/30 p-4 rounded-2xl text-center font-bold uppercase tracking-widest">
          Manage Existing Matches
        </Link>
      </div>

      <div className="mt-12 bg-red-900/10 border border-red-900/30 p-6 rounded-3xl">
         <h4 className="text-sm font-bold text-red-500 uppercase mb-2">Admin Notice</h4>
         <p className="text-xs text-gray-500">Manual verification is required for all payments. Check screenshots carefully before approving. Withdrawals should be paid via UPI manually and then marked as complete.</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: string; link?: string; color?: string }> = ({ title, value, icon, link, color = 'text-white' }) => {
  const CardContent = (
    <div className="bg-[#0d041a] border border-purple-900/30 p-5 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
      <span className="absolute top-2 right-2 text-2xl opacity-10 group-hover:scale-125 transition-transform">{icon}</span>
      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{title}</p>
      <h3 className={`text-3xl font-bold font-gaming ${color}`}>{value}</h3>
    </div>
  );

  return link ? <Link to={link}>{CardContent}</Link> : CardContent;
};

export default AdminDashboard;
