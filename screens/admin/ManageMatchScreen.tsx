
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { Match, MatchStatus } from '../../types';

const ManageMatchScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [roomId, setRoomId] = useState('');
  const [roomPass, setRoomPass] = useState('');

  useEffect(() => {
    const found = db.getMatches().find(m => m.id === id);
    if (found) {
      setMatch(found);
      setRoomId(found.roomId || '');
      setRoomPass(found.roomPass || '');
    }
  }, [id]);

  const handleUpdate = () => {
    if (!match) return;
    const matches = db.getMatches();
    const updated = matches.map(m => m.id === match.id ? { ...m, roomId, roomPass, status: roomId ? MatchStatus.LIVE : m.status } : m);
    db.setMatches(updated);
    alert("Match Updated!");
    navigate('/home');
  };

  if (!match) return null;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold font-gaming mb-6 uppercase neon-text-purple">Manage Match Room</h2>
      
      <div className="bg-[#0d041a] border border-purple-900/30 p-5 rounded-2xl mb-8">
        <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">{match.title}</h3>
        <p className="text-xs text-gray-500">{new Date(match.startTime).toLocaleString()}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Room ID</label>
          <input 
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white focus:border-purple-500 outline-none font-gaming"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            placeholder="e.g. 5623910"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Room Password</label>
          <input 
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white focus:border-purple-500 outline-none font-gaming"
            value={roomPass}
            onChange={e => setRoomPass(e.target.value)}
            placeholder="e.g. 1234"
          />
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-widest"
        >
          Update Room & Notify Players
        </button>
      </div>
    </div>
  );
};

export default ManageMatchScreen;
