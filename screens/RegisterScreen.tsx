
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const { signup } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData.name, formData.email, formData.phone, formData.password);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center bg-gradient-to-b from-[#0a0414] to-[#05010a]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-gaming neon-text-purple tracking-widest mb-2 uppercase">Sign Up</h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Start your esports journey</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          placeholder="FULL NAME"
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
        <input 
          type="email"
          placeholder="EMAIL ADDRESS"
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          placeholder="PHONE NUMBER"
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          required
        />
        <input 
          type="password"
          placeholder="PASSWORD"
          className="w-full bg-purple-900/10 border border-purple-900/30 px-6 py-4 rounded-xl outline-none focus:border-purple-500 text-sm uppercase font-bold"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          required
        />

        <div className="flex items-center gap-3 py-2">
          <input type="checkbox" id="age" required className="w-4 h-4 accent-purple-600" />
          <label htmlFor="age" className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            I confirm that I am 18+ years old
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl neon-glow uppercase tracking-[0.3em] mt-4"
        >
          CREATE ACCOUNT
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-purple-400 font-bold ml-2">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
