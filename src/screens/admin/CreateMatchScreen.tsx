import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, ID } from '../../appwrite';
import { useAuth } from '../../App';

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const MATCHES_COLLECTION_ID = import.meta.env.VITE_MATCHES_COLLECTION_ID;

const CreateMatchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'solo',
    entryFee: 10,
    prizePool: 500,
    startTime: '',
    totalSlots: 48
  });

  if (!user) {
    return <p className="text-red-500 text-center">Unauthorized</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await databases.createDocument(
        DATABASE_ID,
        MATCHES_COLLECTION_ID,
        ID.unique(),
        {
          title: formData.title,
          type: formData.type,
          entryFee: Number(formData.entryFee),
          prizePool: Number(formData.prizePool),
          totalSlots: Number(formData.totalSlots),
          startTime: new Date(formData.startTime).toISOString(),
          status: 'upcoming',          // ✅ ENUM (lowercase)
          createdBy: user.$id
        }
      );

      alert('Match created successfully');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto h-full">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-400">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 uppercase text-purple-500">
        Create Match
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* TITLE */}
        <div>
          <label className="text-xs uppercase text-gray-500 mb-1 block">
            Match Title
          </label>
          <input
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
            placeholder="Bermuda Friday Solo"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        {/* TYPE & SLOTS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">
              Match Type
            </label>
            <select
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="squad">Squad</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">
              Total Slots
            </label>
            <input
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
              value={formData.totalSlots}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalSlots: Number(e.target.value)
                })
              }
              required
            />
          </div>
        </div>

        {/* ENTRY & PRIZE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">
              Entry Fee (₹)
            </label>
            <input
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
              value={formData.entryFee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  entryFee: Number(e.target.value)
                })
              }
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">
              Prize Pool (₹)
            </label>
            <input
              type="number"
              className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
              value={formData.prizePool}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prizePool: Number(e.target.value)
                })
              }
              required
            />
          </div>
        </div>

        {/* START TIME */}
        <div>
          <label className="text-xs uppercase text-gray-500 mb-1 block">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            className="w-full bg-purple-900/10 border border-purple-900/50 rounded-xl px-4 py-3 text-white"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-purple-600 py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Match'}
        </button>
      </form>
    </div>
  );
};

export default CreateMatchScreen;
