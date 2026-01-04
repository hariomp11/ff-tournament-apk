
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { Match, TransactionType, TransactionStatus, MatchStatus } from '../types';

const MatchDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const found = db.getMatches().find(m => m.id === id);
    if (found) {
      setMatch(found);
      const joinedList = db.getJoinedMatches();
      setJoined(joinedList.some(j => j.matchId === id && j.userId === user?.id));
    }
  }, [id, user]);

  const handleJoin = () => {
    if (!user || !match) return;

    if (user.walletBalance < match.entryFee) {
      alert("Insufficient Balance! Please add money to your wallet.");
      navigate('/wallet');
      return;
    }

    if (match.joinedCount >= match.totalSlots) {
      alert("Match is Full!");
      return;
    }

    if (confirm(`Confirm Join Fee: ₹${match.entryFee}?`)) {
      // 1. Update user balance
      const allUsers = db.getUsers();
      const updatedUsers = allUsers.map(u => 
        u.id === user.id ? { ...u, walletBalance: u.walletBalance - match.entryFee } : u
      );
      db.setUsers(updatedUsers);

      // 2. Add transaction
      const txs = db.getTransactions();
      txs.push({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        amount: match.entryFee,
        type: TransactionType.JOIN_FEE,
        status: TransactionStatus.APPROVED,
        timestamp: Date.now(),
        note: `Joined Match: ${match.title}`
      });
      db.setTransactions(txs);

      // 3. Register join
      const joinedList = db.getJoinedMatches();
      joinedList.push({ matchId: match.id, userId: user.id, joinedAt: Date.now() });
      db.setJoinedMatches(joinedList);

      // 4. Update match count
      const matches = db.getMatches();
      const updatedMatches = matches.map(m => 
        m.id === match.id ? { ...m, joinedCount: m.joinedCount + 1 } : m
      );
      db.setMatches(updatedMatches);

      refreshUser();
      setJoined(true);
      alert("Successfully joined match!");
    }
  };

  if (!match) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${match.id}/600/400`} 
          className="w-full h-full object-cover brightness-[0.3]" 
          alt="match cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05010a] to-transparent"></div>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
        >
          ←
        </button>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="bg-purple-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest mb-2 inline-block">
            {match.type}
          </span>
          <h1 className="text-3xl font-bold font-gaming uppercase leading-tight">{match.title}</h1>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10 grid gap-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Entry Fee" value={`₹${match.entryFee}`} color="text-green-400" />
          <StatBox label="Prize Pool" value={`₹${match.prizePool}`} color="text-yellow-500" />
          <StatBox label="Slots" value={`${match.joinedCount}/${match.totalSlots}`} color="text-purple-400" />
        </div>

        {/* Room Details (Only if joined and match is starting soon) */}
        {joined && (
           <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 neon-glow">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 text-purple-400">Room Credentials</h3>
              {match.roomId ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Room ID</p>
                    <p className="text-lg font-bold font-gaming select-all">{match.roomId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Password</p>
                    <p className="text-lg font-bold font-gaming select-all">{match.roomPass}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">Room credentials will be revealed 15 minutes before start time.</p>
              )}
           </div>
        )}

        {/* Rules */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Match Rules</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-purple-500">●</span>
              Emulator players are strictly NOT allowed. Mobile only.
            </li>
            <li className="flex gap-3">
              <span className="text-purple-500">●</span>
              Teaming or hacking leads to immediate ban and prize forfeiture.
            </li>
            <li className="flex gap-3">
              <span className="text-purple-500">●</span>
              Share results screenshot within 15 minutes of match completion.
            </li>
            <li className="flex gap-3">
              <span className="text-purple-500">●</span>
              Join the room at least 5 minutes before scheduled start time.
            </li>
          </ul>
        </div>
      </div>

      {/* Persistent Footer CTA */}
      <div className="fixed bottom-24 left-6 right-6 z-50">
        {joined ? (
          <div className="bg-green-500/20 border border-green-500 text-green-400 font-bold py-3 rounded-xl text-center uppercase tracking-widest">
            Successfully Joined
          </div>
        ) : (
          <button 
            disabled={match.status !== MatchStatus.UPCOMING || match.joinedCount >= match.totalSlots}
            onClick={handleJoin}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl neon-glow transition-all uppercase tracking-[0.2em] shadow-lg shadow-purple-600/30"
          >
            {match.joinedCount >= match.totalSlots ? "Match Full" : `Join Match - ₹${match.entryFee}`}
          </button>
        )}
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-[#0d041a] border border-purple-900/30 rounded-xl p-3 text-center">
    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

export default MatchDetailsScreen;
