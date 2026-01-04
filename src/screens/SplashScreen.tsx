
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#05010a] flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-purple-600 rounded-full animate-ping opacity-20 absolute"></div>
        <div className="w-24 h-24 border-2 border-purple-500 rounded-2xl rotate-45 flex items-center justify-center bg-purple-600/10 neon-glow">
          <span className="text-4xl font-bold -rotate-45 font-gaming">NA</span>
        </div>
      </div>
      <h1 className="mt-12 text-3xl font-bold tracking-widest neon-text-purple uppercase animate-pulse">
        Nova Arena
      </h1>
      <p className="mt-2 text-gray-500 tracking-[0.3em] uppercase text-xs">
        Esports Excellence
      </p>
    </div>
  );
};

export default SplashScreen;
