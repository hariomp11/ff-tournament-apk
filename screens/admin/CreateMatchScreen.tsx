
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { Match, MatchStatus, MatchType } from '../../types';

const CreateMatchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: MatchType.SOLO,
    entryFee: 10,
    prizePool: 500,
    startTime: '',
    totalSlots: 48
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMatch: Match = {
      id: 'm' + Date.now(),
      title: formData.title,
      type: formData.type,
      entryFee: Number(formData.entryFee),
      prizePool: Number(formData.prizePool),
      startTime: new Date(formData.startTime).getTime(),
      status: MatchStatus.UPCOMING,
      joinedCount: 0,
      totalSlots: Number(formData.totalSlots)
    };

    const matches = db.getMatches();
    db.setMatches([...matches, newMatch]);
    alert("Match Created!");
    navigate('/home');
  };

  return (
    <div className="p-6 max-w-lg mx-auto h-full">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500">← Back</button>
      <h2 className="text-2xl font-bold font-gaming mb-6 uppercase neon-text-purple">Create Match</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Match Title</label>
          <input 
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
            placeholder="e.g. Bermuda Friday Solo"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Match Type</label>
            <select 
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white outline-none"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as MatchType})}
            >
              <option value={MatchType.SOLO}>Solo</option>
              <option value={MatchType.DUO}>Duo</option>
              <option value={MatchType.SQUAD}>Squad</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Total Slots</label>
            <input 
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white outline-none"
              value={formData.totalSlots}
              onChange={e => setFormData({...formData, totalSlots: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Entry Fee (₹)</label>
            <input 
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white outline-none"
              value={formData.entryFee}
              onChange={e => setFormData({...formData, entryFee: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Prize Pool (₹)</label>
            <input 
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white outline-none"
              value={formData.prizePool}
              onChange={e => setFormData({...formData, prizePool: Number(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Start Date & Time</label>
          <input 
            type="datetime-local"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white outline-none"
            value={formData.startTime}
            onChange={e => setFormData({...formData, startTime: e.target.value})}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 bg-purple-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-widest"
        >
          Publish Match
        </button>
      </form>
    </div>
  );
};

export default CreateMatchScreen;
