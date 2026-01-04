import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { account } from '../appwrite'; // Appwrite SDK instance

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ EMAIL + PASSWORD LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await account.createEmailSession(email, password);
      await refreshUser();
      navigate('/home');
    } catch (err) {
      alert('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = () => {
    account.createOAuth2Session(
      'google',
      `${window.location.origin}/home`,
      `${window.location.origin}/login`
    );
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center bg-gradient-to-b from-[#0a0414] to-[#05010a]">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-widest uppercase text-purple-500">
          Login
        </h1>
        <p className="text-gray-500 text-sm uppercase mt-2">
          Arena awaits your arrival
        </p>
      </div>

      {/* EMAIL LOGIN */}
      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl text-white"
          required
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 py-4 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Enter Arena'}
        </button>
      </form>

      {/* OR */}
      <div className="my-6 text-center text-gray-500 text-xs uppercase">
        OR
      </div>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-3"
      >
        <img src="/google.svg" alt="google" className="w-5 h-5" />
        Continue with Google
      </button>

      {/* REGISTER */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs uppercase">
          No account?
          <Link to="/register" className="text-purple-400 font-bold ml-2">
            Sign Up
          </Link>
        </p>
      </div>

      {/* FOOTER */}
      <div className="mt-10 p-4 border border-purple-900/30 rounded-xl text-center text-xs text-gray-500">
        Nova Arena is a skill-based platform. Read terms carefully.
      </div>
    </div>
  );
};

export default LoginScreen;
