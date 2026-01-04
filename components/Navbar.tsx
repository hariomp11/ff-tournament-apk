
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0414] border-t border-purple-900/50 backdrop-blur-lg z-50 px-2 py-3">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <NavItem to="/home" icon="🏠" label="Home" />
        <NavItem to="/my-matches" icon="🎮" label="Matches" />
        <NavItem to="/wallet" icon="💰" label="Wallet" />
        {isAdmin ? (
          <NavItem to="/admin" icon="🛡️" label="Admin" />
        ) : (
          <NavItem to="/profile" icon="👤" label="Profile" />
        )}
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 transition-all duration-300 ${
        isActive ? 'text-purple-400 scale-110' : 'text-gray-500'
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
  </NavLink>
);

export default Navbar;
