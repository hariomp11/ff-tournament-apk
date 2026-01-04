import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../appwrite';
import { useAuth } from '../../App';

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const MATCHES_COLLECTION_ID = 'matches';

const ManageMatchScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [match, setMatch] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setRoomId(res.roomId || '');
        setRoomPass(res.roomPass || '');
      } catch (err) {
        console.error(err);
        alert('Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [id]);

  /* ================= UPDATE ROOM ================= */
  const handleUpdate = async () => {
    if (!match) return;

    if (!roomId || !roomPass) {
      alert('Room ID and Password are required');
      return;
    }

    setSaving(true);

    try {
      await databases.updateDocument(
        DATABASE_ID,
        MATCHES_COLLECTION_ID,
        match.$id,
        {
          roomId,
          roomPass,
          status: 'live' // auto move to LIVE
        }
      );

      alert('Room details updated successfully');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Failed to update room');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !match) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-6 uppercase text-purple-500">
        Manage Match Room
      </h2>

      {/* MATCH INFO */}
      <div className="bg-[#0d041a] border border-purple-900/30 p-5 rounded-2xl mb-8">
        <h3 className="text-lg font-bold uppercase">
          {match.title}
        </h3>
        <p className="text-xs text-gray-500">
          {new Date(match.startTime).toLocaleString()}
        </p>
      </div>

      {/* ROOM FORM */}
      <div className="space-y-6">
        <div>
          <label className="text-[10px] uppercase text-gray-500 block mb-1">
            Room ID
          </label>
          <input
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. 5623910"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase text-gray-500 block mb-1">
            Room Password
          </label>
          <input
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-4 text-white"
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
            placeholder="e.g. 1234"
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-purple-600 py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Room & Go Live'}
        </button>
      </div>
    </div>
  );
};

export default ManageMatchScreen;
