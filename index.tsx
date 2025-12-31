
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { PaperRecord, PaperStatus, ConferenceTier, PaperResult } from './types';
import { ICONS } from './constants';
import GraduationProgress from './components/GraduationProgress';
import PaperCard from './components/PaperCard';
import PaperModal from './components/PaperModal';

// --- Mystical Confirm Modal ---
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, title, message, onConfirm, onCancel, 
  confirmText = "确认执行", cancelText = "暂缓", type = 'info' 
}) => {
  if (!isOpen) return null;
  
  const themes = {
    danger: {
      bg: "bg-red-950/90",
      border: "border-red-500/50",
      button: "bg-red-600 hover:bg-red-500 shadow-red-500/30",
      // Fix: Specify any for ReactElement props to allow className
      icon: React.cloneElement(ICONS.REJECTED as React.ReactElement<any>, { className: "w-12 h-12 text-red-500 mb-4 animate-pulse" })
    },
    warning: {
      bg: "bg-slate-900/95",
      border: "border-orange-500/50",
      button: "bg-orange-600 hover:bg-orange-500 shadow-orange-500/30",
      // Fix: Specify any for ReactElement props to allow className
      icon: React.cloneElement(ICONS.CLOSE as React.ReactElement<any>, { className: "w-12 h-12 text-orange-500 mb-4" })
    },
    info: {
      bg: "bg-slate-900/95",
      border: "border-blue-500/50",
      button: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/30",
      // Fix: Specify any for ReactElement props to allow className
      icon: React.cloneElement(ICONS.SUBMITTED as React.ReactElement<any>, { className: "w-12 h-12 text-blue-500 mb-4" })
    }
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all animate-in fade-in duration-300">
      <div className={`w-full max-md p-8 rounded-[2rem] border ${theme.border} ${theme.bg} shadow-2xl transform animate-in zoom-in-95 duration-300`}>
        <div className="flex flex-col items-center text-center">
          {theme.icon}
          <h3 className="text-2xl font-black mb-3 text-white tracking-tight orbitron">{title}</h3>
          <p className="text-slate-400 mb-8 leading-relaxed font-medium">{message}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 px-6 rounded-2xl text-white font-black transition-all active:scale-95 shadow-xl ${theme.button} orbitron text-sm uppercase tracking-wider`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [papers, setPapers] = useState<PaperRecord[]>(() => {
    try {
      const saved = localStorage.getItem('scholar_quest_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [activeTab, setActiveTab] = useState<PaperStatus>(PaperStatus.ACCEPTED);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PaperRecord | null>(null);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });

  useEffect(() => {
    localStorage.setItem('scholar_quest_records', JSON.stringify(papers));
  }, [papers]);

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const handleAddOrUpdatePaper = useCallback((data: Omit<PaperRecord, 'id' | 'createdAt'>) => {
    if (editingPaper) {
      setPapers(prev => prev.map(p => p.id === editingPaper.id ? { ...p, ...data } : p));
      setEditingPaper(null);
    } else {
      const newPaper: PaperRecord = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      setPapers(prev => [newPaper, ...prev]);
    }
  }, [editingPaper]);

  const deletePaper = useCallback((id: string) => {
    const paper = papers.find(p => p.id === id);
    if (!paper) return;

    let title = '湮灭记录';
    let message = '确定要从时空中抹除这段科研记忆吗？此操作无法通过任何奥术手段回溯。';
    let type: 'danger' | 'warning' | 'info' = 'warning';

    if (paper.status === PaperStatus.ACCEPTED) {
      title = '神格崩落警告';
      message = '这篇论文承载着你的学术神格，一旦销毁，经验值与等级将永久跌落！';
      type = 'danger';
    }

    setConfirmState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        setPapers(prev => prev.filter(p => p.id !== id));
        closeConfirm();
      }
    });
  }, [papers]);

  const updatePaperStatus = useCallback((id: string, newStatus: PaperStatus) => {
    const proceed = () => {
      setPapers(prev => prev.map(p => {
        if (p.id === id) {
          return { 
            ...p, 
            status: newStatus, 
            result: newStatus === PaperStatus.ACCEPTED ? PaperResult.ACCEPTED : (newStatus === PaperStatus.REJECTED ? PaperResult.REJECTED : p.result) 
          };
        }
        return p;
      }));
      setActiveTab(newStatus);
    };

    if (newStatus === PaperStatus.REJECTED) {
      setConfirmState({
        isOpen: true,
        title: '凝视深渊',
        message: '此论文即将坠入拒稿深渊。深渊会吞噬你的希望，但也会铸就你的意志。',
        type: 'danger',
        onConfirm: () => {
          proceed();
          closeConfirm();
        }
      });
    } else if (newStatus === PaperStatus.SUBMITTED) {
      setConfirmState({
        isOpen: true,
        title: '开启远征',
        message: '你正准备将成果投向未知的领域。前路漫漫，审稿人的审判即将降临。',
        type: 'info',
        onConfirm: () => {
          proceed();
          closeConfirm();
        }
      });
    } else {
      proceed();
    }
  }, [papers]);

  const levelingData = useMemo(() => {
    const acceptedPapers = papers.filter(p => p.status === PaperStatus.ACCEPTED);
    const totalPoints = acceptedPapers.reduce((acc, p) => {
      if (p.tier === ConferenceTier.A) return acc + 50;
      if (p.tier === ConferenceTier.B) return acc + 25;
      if (p.tier === ConferenceTier.C) return acc + 10;
      return acc + 5;
    }, 0);

    const level = Math.floor((-5 + Math.sqrt(25 + 20 * totalPoints)) / 10);
    const currentLevel = Math.max(0, level);
    const pointsAtStartOfLevel = 5 * currentLevel * (currentLevel + 1);
    const pointsRequiredForNextLevel = 10 * (currentLevel + 1);
    const currentXp = totalPoints - pointsAtStartOfLevel;
    const progress = (currentXp / pointsRequiredForNextLevel) * 100;

    return { 
      level: currentLevel, 
      progress: isNaN(progress) ? 0 : progress, 
      totalPoints, 
      currentXp, 
      requiredXp: pointsRequiredForNextLevel 
    };
  }, [papers]);

  const stats = useMemo(() => ({
    accepted: papers.filter(p => p.status === PaperStatus.ACCEPTED).length,
    submitted: papers.filter(p => p.status === PaperStatus.SUBMITTED).length,
    writing: papers.filter(p => p.status === PaperStatus.WRITING).length,
    target: papers.filter(p => p.status === PaperStatus.TARGET).length,
    rejected: papers.filter(p => p.status === PaperStatus.REJECTED).length
  }), [papers]);

  const displayedPapers = useMemo(() => {
    return papers.filter(p => p.status === activeTab);
  }, [papers, activeTab]);

  return (
    <div className="relative min-h-screen pb-32">
      {/* Mystical Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{animationDelay: '2s'}}></div>

      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <span className="text-white transform group-hover:rotate-12 transition-transform">{ICONS.BRAIN}</span>
            </div>
            <div>
              <h1 className="text-2xl font-black orbitron tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-500">
                SCHOLAR<span className="text-blue-500">QUEST</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 -mt-1">Celestial Research Archive</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-black orbitron text-xs">
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase text-[9px]">Celestial XP</span>
              <span className="text-blue-400 text-lg">{levelingData.totalPoints}</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase text-[9px]">Legendary</span>
              <span className="text-emerald-400 text-lg">{stats.accepted}</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 uppercase text-[9px]">Scars</span>
              <span className="text-red-500 text-lg">{stats.rejected}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <GraduationProgress {...levelingData} />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex p-1.5 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl overflow-x-auto no-scrollbar w-full lg:w-auto">
            {[
              { id: PaperStatus.ACCEPTED, label: '中稿', icon: ICONS.ACCEPTED, color: 'emerald', count: stats.accepted },
              { id: PaperStatus.SUBMITTED, label: '在投', icon: ICONS.SUBMITTED, color: 'blue', count: stats.submitted },
              { id: PaperStatus.WRITING, label: '在写', icon: ICONS.WRITING, color: 'indigo', count: stats.writing },
              { id: PaperStatus.TARGET, label: '目标', icon: ICONS.TARGET, color: 'violet', count: stats.target },
              { id: PaperStatus.REJECTED, label: '深渊', icon: ICONS.REJECTED, color: 'red', count: stats.rejected }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const activeClasses = {
                emerald: "bg-emerald-500 shadow-emerald-500/20",
                blue: "bg-blue-600 shadow-blue-500/20",
                indigo: "bg-indigo-600 shadow-indigo-500/20",
                violet: "bg-violet-600 shadow-violet-500/20",
                red: "bg-red-800 shadow-red-900/40"
              };
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as PaperStatus)}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all whitespace-nowrap group ${isActive ? `${activeClasses[tab.color]} text-white scale-105 z-10 shadow-xl` : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{tab.icon}</span>
                  <span className="orbitron text-xs tracking-wider uppercase">{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>{tab.count}</span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => { setEditingPaper(null); setIsModalOpen(true); }}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-10 py-5 rounded-[1.5rem] shadow-2xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 orbitron text-sm tracking-widest uppercase"
          >
            {ICONS.PLUS} 记录新灵感
          </button>
        </div>

        {displayedPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {displayedPapers.map(paper => (
              <div key={paper.id} className="h-full">
                <PaperCard 
                  paper={paper} 
                  onDelete={deletePaper} 
                  onEdit={(p) => { setEditingPaper(p); setIsModalOpen(true); }} 
                  onStatusChange={updatePaperStatus} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-slate-500 glass-panel border-dashed border-white/10 rounded-[3rem] animate-pulse">
            <div className="p-8 bg-slate-900/50 rounded-full mb-6 border border-white/5">
              {/* Fix: Specify any for ReactElement props to allow className */}
              {activeTab === PaperStatus.REJECTED ? React.cloneElement(ICONS.REJECTED as React.ReactElement<any>, { className: "w-12 h-12 opacity-30" }) : React.cloneElement(ICONS.BRAIN as React.ReactElement<any>, { className: "w-12 h-12 opacity-30" })}
            </div>
            <p className="text-2xl font-black orbitron tracking-tight mb-2 uppercase text-slate-400">
              {activeTab === PaperStatus.REJECTED ? "此地空无一物" : "虚位以待"}
            </p>
            <p className="text-sm font-medium italic opacity-40">"每一个伟大的征程都始于第一行代码..."</p>
          </div>
        )}
      </main>

      <PaperModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        status={activeTab} 
        onSubmit={handleAddOrUpdatePaper} 
        initialData={editingPaper} 
      />
      
      <ConfirmModal {...confirmState} onCancel={closeConfirm} />

      {/* Noise Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none -z-20"></div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
