import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account } from '../appwrite';
import { useAuth } from '../App';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= EMAIL / PASSWORD LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email and password required');
      return;
    }

    try {
      setLoading(true);

      // 🔐 Appwrite email login (REAL AUTH)
      await account.createEmailPasswordSession(email, password);

      // refresh user context
      await refreshUser();

      navigate('/home');
    } catch (err: any) {
      console.error(err);
      alert('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const loginWithGoogle = () => {
    account.createOAuth2Session(
      'google',
      window.location.origin + '/#/home',
      window.location.origin + '/#/login'
    );
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center bg-gradient-to-b from-[#0a0414] to-[#05010a]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-gaming neon-text-purple tracking-widest mb-2 uppercase">
          Login
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Arena awaits your arrival
        </p>
      </div>

      {/* ================= LOGIN FORM ================= */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="age"
            required
            className="w-4 h-4 accent-purple-600"
          />
          <label
            htmlFor="age"
            className="text-[10px] text-gray-500 uppercase tracking-widest font-bold"
          >
            I confirm that I am 18+ years old
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-[0.3em] shadow-lg shadow-purple-600/20 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'ENTER ARENA'}
        </button>
      </form>

      {/* ================= GOOGLE LOGIN ================= */}
      <button
        onClick={loginWithGoogle}
        className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl uppercase tracking-widest"
      >
        Continue with Google
      </button>

      {/* ================= LINKS ================= */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest">
          No account?
          <Link
            to="/register"
            className="text-purple-400 font-bold ml-2"
          >
            Sign Up Now
          </Link>
        </p>
      </div>

      <div className="mt-12 p-4 bg-purple-900/10 rounded-xl border border-purple-900/30">
        <p className="text-[10px] text-gray-500 uppercase leading-relaxed text-center">
          Nova Arena is a skill-based platform. Please read our{' '}
          <span className="text-purple-400">terms and conditions</span>{' '}
          carefully.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
