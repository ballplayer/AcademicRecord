
import React from 'react';
import { PaperRecord, ConferenceTier, PaperResult, PaperStatus } from '../types';
import { ICONS, TIER_STYLES, TIER_LABELS } from '../constants';

interface PaperCardProps {
  paper: PaperRecord;
  onDelete: (id: string) => void;
  onEdit: (paper: PaperRecord) => void;
  onStatusChange?: (id: string, newStatus: PaperStatus) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onDelete, onEdit, onStatusChange }) => {
  const isRejected = paper.status === PaperStatus.REJECTED;

  const getTierIcon = (tier: ConferenceTier) => {
    switch (tier) {
      case ConferenceTier.A: return ICONS.A;
      case ConferenceTier.B: return ICONS.B;
      case ConferenceTier.C: return ICONS.C;
      default: return ICONS.OTHER;
    }
  };

  const getResultColor = (result: PaperResult) => {
    if (isRejected) return "text-red-500";
    switch (result) {
      case PaperResult.ACCEPTED: return "text-emerald-400";
      case PaperResult.REJECTED: return "text-red-400";
      case PaperResult.REVISION: return "text-orange-400";
      default: return "text-slate-400";
    }
  };

  // Enhance styles
  const cardClass = isRejected 
    ? "abyss-card border-red-900/50 animate-pulse-slow"
    : paper.tier === ConferenceTier.A 
      ? "golden-legend border-yellow-500/30" 
      : TIER_STYLES[paper.tier];

  return (
    <div className={`mystic-card relative group p-8 rounded-[2rem] border flex flex-col h-full shadow-lg ${cardClass} overflow-hidden`}>
      {/* Background decoration for high tiers */}
      {paper.tier === ConferenceTier.A && !isRejected && (
        <div className="absolute top-0 right-0 p-4 opacity-10">
          {/* Fix: Specify any for ReactElement props to allow className */}
          {React.cloneElement(ICONS.A as React.ReactElement<any>, { className: "w-24 h-24 transform rotate-12" })}
        </div>
      )}

      {/* Abyss decoration */}
      {isRejected && (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>
           <div className="flex justify-around h-full pt-4">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="w-px h-full bg-gradient-to-b from-red-600 to-transparent opacity-50"></div>
             ))}
           </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6 relative z-20">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isRejected ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-white/5'}`}>
            {isRejected ? ICONS.REJECTED : getTierIcon(paper.tier)}
          </div>
          <span className={`text-[10px] font-black orbitron uppercase tracking-[0.2em] ${isRejected ? 'text-red-600' : (paper.tier === ConferenceTier.A ? 'text-yellow-400' : paper.tier === ConferenceTier.B ? 'text-emerald-400' : paper.tier === ConferenceTier.C ? 'text-sky-400' : 'text-slate-400')}`}>
            {isRejected ? 'Abyss Bound' : TIER_LABELS[paper.tier]}
          </span>
        </div>
        <div className="flex gap-2">
          {/* Write -> Submit Action */}
          {onStatusChange && paper.status === PaperStatus.WRITING && (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStatusChange(paper.id, PaperStatus.SUBMITTED); }}
              title="投向远征"
              className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-lg md:opacity-0 group-hover:opacity-100"
            >
              {/* Fix: Specify any for ReactElement props to allow className */}
              {React.cloneElement(ICONS.SUBMITTED as React.ReactElement<any>, { className: "w-4 h-4" })}
            </button>
          )}

          {/* Submit -> Reject Action */}
          {onStatusChange && paper.status === PaperStatus.SUBMITTED && (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStatusChange(paper.id, PaperStatus.REJECTED); }}
              title="面对深渊"
              className="p-2.5 rounded-xl bg-red-950/50 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all shadow-lg md:opacity-0 group-hover:opacity-100"
            >
              {/* Fix: Specify any for ReactElement props to allow className */}
              {React.cloneElement(ICONS.CLOSE as React.ReactElement<any>, { className: "w-4 h-4" })}
            </button>
          )}

          {/* Accept Action */}
          {onStatusChange && paper.status !== PaperStatus.ACCEPTED && paper.status !== PaperStatus.REJECTED && (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStatusChange(paper.id, PaperStatus.ACCEPTED); }}
              title="登神录用"
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all shadow-lg md:opacity-0 group-hover:opacity-100"
            >
              {/* Fix: Specify any for ReactElement props to allow className */}
              {React.cloneElement(ICONS.CHECK as React.ReactElement<any>, { className: "w-4 h-4" })}
            </button>
          )}

          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(paper); }}
            className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-lg md:opacity-0 group-hover:opacity-100"
          >
            {/* Fix: Specify any for ReactElement props to allow className */}
            {React.cloneElement(ICONS.EDIT as React.ReactElement<any>, { className: "w-4 h-4" })}
          </button>
          
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(paper.id); }}
            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg md:opacity-0 group-hover:opacity-100"
          >
            {/* Fix: Specify any for ReactElement props to allow className */}
            {React.cloneElement(ICONS.TRASH as React.ReactElement<any>, { className: "w-4 h-4" })}
          </button>
        </div>
      </div>

      <div className="flex-grow mb-6 relative z-10">
        <h3 className={`text-xl font-black leading-tight break-words transition-all duration-300 orbitron tracking-tight ${isRejected ? 'text-red-200 group-hover:text-red-50' : 'text-white group-hover:text-blue-50'}`}>
          {paper.title}
        </h3>
      </div>

      <div className="space-y-4 mb-6 relative z-10 mt-auto">
        <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isRejected ? 'bg-red-950/20 border-red-900/50 text-red-400' : 'bg-white/5 border-white/5 text-slate-300'}`}>
          <div className="p-1.5 rounded-lg bg-black/20">{ICONS.BRAIN}</div>
          <span className="text-xs font-bold truncate tracking-wider uppercase">{paper.conference}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-3 rounded-2xl border border-white/5">
            <span className="block text-[8px] uppercase text-slate-500 orbitron mb-1 font-bold">Submission</span>
            <span className={`text-[10px] font-bold ${isRejected ? 'text-red-500/80' : 'text-slate-200'}`}>{paper.submissionDate || '-- --'}</span>
          </div>
          <div className="glass-panel p-3 rounded-2xl border border-white/5">
            <span className="block text-[8px] uppercase text-slate-500 orbitron mb-1 font-bold">Base Score</span>
            <span className={`text-[10px] font-bold ${isRejected ? 'text-red-500/80' : 'text-slate-200'}`}>{paper.scores || '-- --'}</span>
          </div>
        </div>

        <div className={`pt-4 border-t flex justify-between items-center ${isRejected ? 'border-red-900/50' : 'border-white/5'}`}>
          <span className="text-[9px] font-black orbitron uppercase tracking-[0.1em] text-slate-500">Current Verdict</span>
          <span className={`text-xs font-black orbitron uppercase tracking-widest ${getResultColor(paper.result)}`}>
            {paper.status === PaperStatus.ACCEPTED ? 'Ascended' : (isRejected ? 'Banished' : paper.result)}
          </span>
        </div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer pointer-events-none opacity-20"></div>
    </div>
  );
};

export default PaperCard;
