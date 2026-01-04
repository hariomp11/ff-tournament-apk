
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { Match, MatchStatus } from '../types';

const MyMatchesScreen: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const joinedIds = db.getJoinedMatches().filter(j => j.userId === user?.id).map(j => j.matchId);
    const allMatches = db.getMatches();
    setMatches(allMatches.filter(m => joinedIds.includes(m.id)));
  }, [user]);

  return (
    <div className="p-6 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold font-gaming mb-6 uppercase neon-text-purple tracking-widest">My Matches</h2>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-purple-900/10 rounded-3xl border border-dashed border-purple-900/30">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-4">No matches joined yet</p>
          <Link to="/home" className="text-purple-400 font-bold uppercase text-xs hover:underline tracking-widest">
            Find Matches →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map(match => (
            <Link 
              to={`/match/${match.id}`} 
              key={match.id}
              className="bg-[#0d041a] border border-purple-900/30 rounded-2xl p-5 flex justify-between items-center group hover:border-purple-500/50 transition-all"
            >
              <div>
                <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border mb-1 inline-block ${
                  match.status === MatchStatus.UPCOMING ? 'text-yellow-500 border-yellow-500/30' : 
                  match.status === MatchStatus.LIVE ? 'text-green-500 border-green-500/30 animate-pulse' : 'text-gray-500 border-gray-500/30'
                }`}>
                  {match.status}
                </span>
                <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors uppercase truncate w-32">{match.title}</h3>
                <p className="text-[10px] text-gray-500">{new Date(match.startTime).toLocaleString()}</p>
              </div>
              <div className="text-right">
                {match.roomId ? (
                  <div className="bg-purple-600 text-white text-[10px] font-bold py-1 px-3 rounded uppercase animate-bounce">
                    ID READY
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 uppercase italic">Wait for ID</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMatchesScreen;
