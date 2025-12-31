
import React, { useEffect, useState } from 'react';
import { ICONS } from '../constants';

interface GraduationProgressProps {
  level: number;
  progress: number;
  currentXp: number;
  requiredXp: number;
}

const GraduationProgress: React.FC<GraduationProgressProps> = ({ level, progress, currentXp, requiredXp }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayProgress(progress);
    }, 200);
    return () => clearTimeout(timeout);
  }, [progress]);

  const getRankName = (lv: number) => {
    if (lv < 2) return "科研学徒 (Apprentice)";
    if (lv < 5) return "求索者 (Seeker)";
    if (lv < 10) return "学术苦行僧 (Ascetic)";
    if (lv < 20) return "顶会守门员 (Gatekeeper)";
    if (lv < 40) return "学术大牛 (Grandmaster)";
    return "登神长阶 (Divine)";
  };

  return (
    <div className="relative p-10 rounded-[3rem] bg-slate-900/60 backdrop-blur-xl border border-white/5 overflow-hidden mb-16 shadow-2xl group animate-in zoom-in-95 duration-700">
      {/* Mystical glow line at top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80 group-hover:via-indigo-400 transition-all duration-1000"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-[0_0_30px_rgba(37,99,235,0.3)] transform hover:rotate-3 transition-all duration-500">
            <span className="text-white scale-125 block">{ICONS.GRADUATION}</span>
          </div>
          <div>
            <h2 className="text-3xl font-black orbitron tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400 uppercase">
              Celestial Altar
            </h2>
            <p className="text-blue-400/80 font-black orbitron text-xs tracking-widest mt-1">Current Status: {getRankName(level)}</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-7xl font-black text-white orbitron italic leading-none flex items-baseline gap-2 group-hover:scale-110 transition-transform duration-500">
            <span className="text-2xl text-blue-500">LV.</span>{level}
          </div>
          <div className="text-[10px] uppercase tracking-[0.5em] text-slate-600 font-bold mt-2">Scholar Rank Level</div>
        </div>
      </div>

      <div className="relative">
        {/* The Bar */}
        <div className="relative h-12 bg-black/40 rounded-full overflow-hidden border border-white/5 p-1.5 shadow-inner">
          <div 
            className="h-full rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) relative overflow-hidden"
            style={{ 
              width: `${Math.min(displayProgress, 100)}%`,
              background: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            {/* Shimmer Effect */}
            <div className="absolute top-0 left-0 w-full h-full shimmer opacity-30"></div>
          </div>
        </div>
        
        {/* Floating XP Labels */}
        <div className="absolute -top-7 right-4 text-[10px] font-black orbitron text-blue-400 tracking-widest">
          XP: {currentXp} <span className="opacity-40 mx-1">/</span> {requiredXp}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-[10px] font-black orbitron text-slate-500 tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>Synching with Archive...</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-blue-400">{displayProgress.toFixed(1)}% Progress</span>
           <span className="opacity-20">|</span>
           <span>Next Tier: LV.{level + 1}</span>
        </div>
      </div>
      
      {/* Decorative Grid on progress bar component */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};

export default GraduationProgress;
