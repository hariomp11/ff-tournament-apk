import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../appwrite';

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const MATCHES_COLLECTION_ID = import.meta.env.VITE_MATCHES_COLLECTION_ID;

type MatchStatus = 'upcoming' | 'live' | 'completed';
type MatchType = 'solo' | 'duo' | 'squad';

interface Match {
  $id: string;
  title: string;
  type: MatchType;
  entryFee: number;
  prizePool: number;
  totalSlots: number;
  joinedCount: number;
  startTime: string;
  status: MatchStatus;
}

const HomeScreen: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeTab, setActiveTab] = useState<MatchStatus>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          MATCHES_COLLECTION_ID
        );
        setMatches(res.documents as Match[]);
      } catch (err) {
        console.error('Failed to load matches', err);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const filteredMatches = matches.filter(
    (m) => m.status === activeTab
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold neon-text-purple uppercase">
            Tournaments
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Join & Win Rewards
          </p>
        </div>
        <div className="bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">
          <span className="text-purple-400 font-bold">FF MOBILE</span>
        </div>
      </header>

      {/* STATUS TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['upcoming', 'live', 'completed'] as MatchStatus[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${
                activeTab === status
                  ? 'bg-purple-600 text-white neon-glow'
                  : 'bg-purple-900/20 text-gray-500 border border-purple-900/50'
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* MATCH LIST */}
      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-gray-400 py-20">
            Loading matches...
          </p>
        ) : filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <MatchCard key={match.$id} match={match} />
          ))
        ) : (
          <div className="text-center py-20 bg-purple-900/10 rounded-2xl border border-dashed border-purple-900/30">
            <p className="text-gray-500 uppercase tracking-widest text-sm">
              No matches found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= MATCH CARD ================= */

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const progress =
    (match.joinedCount / match.totalSlots) * 100;

  return (
    <Link
      to={`/match/${match.$id}`}
      className="block group bg-[#0d041a] border border-purple-900/30 rounded-2xl hover:border-purple-500/50 transition-all"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-pink-500 uppercase">
              {match.type}
            </span>
            <h3 className="font-bold text-lg uppercase truncate w-40">
              {match.title}
            </h3>
            <p className="text-[10px] text-gray-500 uppercase">
              {new Date(match.startTime).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase">
              Entry Fee
            </p>
            <p className="text-xl font-bold text-green-400">
              ₹{match.entryFee}
            </p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-purple-400">
                {match.joinedCount}/{match.totalSlots}
              </span>
              <span className="text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-purple-900/30 rounded-full">
              <div
                className="h-full bg-purple-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="w-16 h-16 bg-purple-900/20 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[8px] uppercase text-gray-400">
              Prize
            </span>
            <span className="text-sm font-bold text-yellow-500">
              ₹{match.prizePool}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-purple-900/30 pt-4">
          <span className="text-xs uppercase text-purple-400">
            {match.status}
          </span>
          <button className="bg-purple-600 text-white text-xs px-4 py-1.5 rounded-lg">
            Join Match
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HomeScreen;
