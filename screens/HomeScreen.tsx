
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';
import { Match, MatchStatus, MatchType } from '../types';

const HomeScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<MatchStatus>(MatchStatus.UPCOMING);

  useEffect(() => {
    setMatches(db.getMatches());
  }, []);

  const filteredMatches = matches.filter(m => m.status === activeTab);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold font-gaming neon-text-purple">TOURNAMENTS</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Join & Win Rewards</p>
        </div>
        <div className="bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">
          <span className="text-purple-400 font-bold">FF MOBILE</span>
        </div>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[MatchStatus.UPCOMING, MatchStatus.LIVE, MatchStatus.COMPLETED].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === status 
                ? 'bg-purple-600 text-white neon-glow' 
                : 'bg-purple-900/20 text-gray-500 border border-purple-900/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="text-center py-20 bg-purple-900/10 rounded-2xl border border-dashed border-purple-900/30">
            <p className="text-gray-500 uppercase tracking-widest text-sm">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const progress = (match.joinedCount / match.totalSlots) * 100;
  
  return (
    <Link 
      to={`/match/${match.id}`}
      className="block group relative overflow-hidden bg-[#0d041a] border border-purple-900/30 rounded-2xl transition-all hover:border-purple-500/50 hover:scale-[1.02]"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 uppercase tracking-tighter mb-2 inline-block">
              {match.type}
            </span>
            <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors uppercase truncate w-40">
              {match.title}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase">
              {new Date(match.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Entry Fee</p>
            <p className="text-xl font-bold text-green-400">₹{match.entryFee}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
              <span className="text-purple-400">{match.joinedCount}/{match.totalSlots} Players</span>
              <span className="text-gray-500">{Math.round(progress)}% Full</span>
            </div>
            <div className="h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-16 h-16 bg-purple-900/20 rounded-xl flex flex-col items-center justify-center border border-purple-500/10">
            <span className="text-[8px] text-gray-400 uppercase">Prize</span>
            <span className="text-sm font-bold text-yellow-500">₹{match.prizePool}</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-purple-900/30 pt-4">
          <div className="flex gap-4">
             <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 uppercase">Map</span>
                <span className="text-[10px] font-bold">Bermuda</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 uppercase">Version</span>
                <span className="text-[10px] font-bold">Mobile</span>
             </div>
          </div>
          <button className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold uppercase py-1.5 px-4 rounded-lg neon-glow transition-all">
            Join Match
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HomeScreen;
