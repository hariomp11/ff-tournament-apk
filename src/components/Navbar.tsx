import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-purple-400'
      : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d041a] border-t border-purple-900/40 h-16 flex justify-around items-center z-50">
      <Link to="/home" className={`text-xs font-bold ${isActive('/home')}`}>
        Home
      </Link>
      <Link to="/wallet" className={`text-xs font-bold ${isActive('/wallet')}`}>
        Wallet
      </Link>
      <Link to="/my-matches" className={`text-xs font-bold ${isActive('/my-matches')}`}>
        My Matches
      </Link>
      <Link to="/profile" className={`text-xs font-bold ${isActive('/profile')}`}>
        Profile
      </Link>
    </nav>
  );
};

export default Navbar;
