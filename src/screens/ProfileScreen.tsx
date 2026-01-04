
import React from 'react';
import { useAuth } from '../App';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl rotate-12 flex items-center justify-center neon-glow mb-4">
          <span className="text-4xl font-bold -rotate-12 font-gaming">{user?.name[0].toUpperCase()}</span>
        </div>
        <h2 className="text-2xl font-bold font-gaming uppercase tracking-widest">{user?.name}</h2>
        <p className="text-sm text-gray-500 tracking-widest uppercase">{user?.email}</p>
      </div>

      <div className="bg-[#0d041a] border border-purple-900/30 rounded-3xl overflow-hidden mb-8">
        <ProfileLink icon="📱" label="Phone" value={user?.phone || 'Not set'} />
        <ProfileLink icon="🎮" label="IGN" value="ProPlayer_Nova" />
        <ProfileLink icon="🗓️" label="Joined" value={new Date(user?.createdAt || 0).toLocaleDateString()} />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Help & Support</h3>
        <button className="w-full flex justify-between items-center bg-[#0d041a] border border-purple-900/30 p-4 rounded-xl text-sm uppercase font-bold tracking-widest">
           <span>Terms of Service</span>
           <span className="text-purple-500">→</span>
        </button>
        <button className="w-full flex justify-between items-center bg-[#0d041a] border border-purple-900/30 p-4 rounded-xl text-sm uppercase font-bold tracking-widest">
           <span>Contact Support</span>
           <span className="text-purple-500">→</span>
        </button>
      </div>

      <button 
        onClick={logout}
        className="w-full mt-12 bg-red-600/10 border border-red-600/50 text-red-500 font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
      >
        Logout
      </button>
    </div>
  );
};

const ProfileLink: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex justify-between items-center p-4 border-b border-purple-900/20 last:border-0">
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

export default ProfileScreen;
