import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases, Query, ID } from '../appwrite';
import { useAuth } from '../App';

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const MATCHES_COLLECTION_ID = 'matches';
const WALLETS_COLLECTION_ID = 'wallets';
const JOINS_COLLECTION_ID = 'match_joins';

const MatchDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [match, setMatch] = useState<any>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  /* ================= LOAD MATCH ================= */
  useEffect(() => {
    const loadMatch = async () => {
      try {
        const res = await databases.getDocument(
          DATABASE_ID,
          MATCHES_COLLECTION_ID,
          id!
        );
        setMatch(res);

        if (user) {
          const joinedRes = await databases.listDocuments(
            DATABASE_ID,
            JOINS_COLLECTION_ID,
            [
              Query.equal('userId', user.$id),
              Query.equal('matchId', id!)
            ]
          );
          setJoined(joinedRes.total > 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [id, user]);

  /* ================= JOIN MATCH ================= */
  const handleJoin = async () => {
    if (!user || !match) return;

    setJoining(true);

    try {
      // 1️⃣ Already joined check
      const existing = await databases.listDocuments(
        DATABASE_ID,
        JOINS_COLLECTION_ID,
        [
          Query.equal('userId', user.$id),
          Query.equal('matchId', match.$id)
        ]
      );

      if (existing.total > 0) {
        alert('You already joined this match');
        return;
      }

      // 2️⃣ Wallet fetch
      const walletRes = await databases.listDocuments(
        DATABASE_ID,
        WALLETS_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      );

      if (walletRes.total === 0) {
        alert('Wallet not found');
        navigate('/wallet');
        return;
      }

      const wallet = walletRes.documents[0];

      // 3️⃣ Balance check
      if (wallet.balance < match.entryFee) {
        alert('Insufficient balance');
        navigate('/wallet');
        return;
      }

      // 4️⃣ Slot check
      if (match.joinedCount >= match.totalSlots) {
        alert('Match is full');
        return;
      }

      if (!confirm(`Confirm join fee ₹${match.entryFee}?`)) return;

      // 5️⃣ Deduct wallet
      await databases.updateDocument(
        DATABASE_ID,
        WALLETS_COLLECTION_ID,
        wallet.$id,
        { balance: wallet.balance - match.entryFee }
      );

      // 6️⃣ Create join record
      await databases.createDocument(
        DATABASE_ID,
        JOINS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          matchId: match.$id,
          joinedAt: new Date().toISOString()
        }
      );

      // 7️⃣ Increment joined count
      await databases.updateDocument(
        DATABASE_ID,
        MATCHES_COLLECTION_ID,
        match.$id,
        { joinedCount: match.joinedCount + 1 }
      );

      setJoined(true);
      setMatch({ ...match, joinedCount: match.joinedCount + 1 });

      alert('Successfully joined match!');
    } catch (err) {
      console.error(err);
      alert('Failed to join match');
    } finally {
      setJoining(false);
    }
  };

  if (loading || !match) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen pb-24">
      <div className="relative h-60 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${match.$id}/600/400`}
          className="w-full h-full object-cover brightness-[0.3]"
          alt="match"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-black/50 rounded-full w-10 h-10"
        >
          ←
        </button>
        <div className="absolute bottom-6 left-6">
          <span className="bg-purple-600 text-xs px-2 py-0.5 rounded uppercase">
            {match.type}
          </span>
          <h1 className="text-2xl font-bold uppercase">{match.title}</h1>
        </div>
      </div>

      <div className="p-6 grid gap-6">
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Entry Fee" value={`₹${match.entryFee}`} />
          <StatBox label="Prize Pool" value={`₹${match.prizePool}`} />
          <StatBox label="Slots" value={`${match.joinedCount}/${match.totalSlots}`} />
        </div>

        {joined && match.roomId && (
          <div className="bg-purple-900/20 p-4 rounded-xl">
            <p className="text-xs uppercase text-purple-400">Room ID</p>
            <p className="font-bold">{match.roomId}</p>
            <p className="text-xs uppercase text-purple-400 mt-2">Password</p>
            <p className="font-bold">{match.roomPass}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-6 right-6">
        {joined ? (
          <div className="bg-green-500/20 text-green-400 py-3 rounded-xl text-center">
            Joined Successfully
          </div>
        ) : (
          <button
            disabled={joining || match.status !== 'upcoming'}
            onClick={handleJoin}
            className="w-full bg-purple-600 py-4 rounded-xl font-bold uppercase disabled:opacity-50"
          >
            {joining ? 'Joining...' : `Join Match ₹${match.entryFee}`}
          </button>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#0d041a] p-3 rounded-xl text-center">
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="font-bold">{value}</p>
  </div>
);

export default MatchDetailsScreen;
