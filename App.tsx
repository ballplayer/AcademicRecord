
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PaperRecord, PaperStatus, ConferenceTier, PaperResult } from './types';
import { ICONS } from './constants';
import GraduationProgress from './components/GraduationProgress';
import PaperCard from './components/PaperCard';
import PaperModal from './components/PaperModal';

const App: React.FC = () => {
  const [papers, setPapers] = useState<PaperRecord[]>(() => {
    try {
      const saved = localStorage.getItem('scholar_quest_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load records", e);
      return [];
    }
  });
  
  const [activeTab, setActiveTab] = useState<PaperStatus>(PaperStatus.ACCEPTED);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PaperRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('scholar_quest_records', JSON.stringify(papers));
  }, [papers]);

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
    
    const isAccepted = paper.status === PaperStatus.ACCEPTED;
    const isRejected = paper.status === PaperStatus.REJECTED;
    
    let message = '确定要删除这段科研记忆吗？此操作不可逆。';
    if (isAccepted) message = '确定要删除这篇已录用的论文吗？相关的经验值和等级将会被同步扣除。此操作不可逆！';
    if (isRejected) message = '确定要彻底抹除这段令人心碎的拒稿记忆吗？';
    
    if (window.confirm(message)) {
      setPapers(prev => prev.filter(p => p.id !== id));
    }
  }, [papers]);

  const startEditing = useCallback((paper: PaperRecord) => {
    setEditingPaper(paper);
    setIsModalOpen(true);
  }, []);

  const updatePaperStatus = useCallback((id: string, newStatus: PaperStatus) => {
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
    
    // Auto-switch tab to the new status for better feedback
    setActiveTab(newStatus);
  }, []);

  const filteredPapers = useMemo(() => {
    return papers.filter(p => p.status === activeTab);
  }, [papers, activeTab]);

  const levelingData = useMemo(() => {
    const acceptedPapers = papers.filter(p => p.status === PaperStatus.ACCEPTED);
    
    const totalPoints = acceptedPapers.reduce((acc, p) => {
      let score = 0;
      if (p.tier === ConferenceTier.A) score = 50;
      else if (p.tier === ConferenceTier.B) score = 25;
      else if (p.tier === ConferenceTier.C) score = 10;
      else score = 5;
      return acc + score;
    }, 0);

    const calculatedLevel = Math.floor((-5 + Math.sqrt(25 + 20 * totalPoints)) / 10);
    const currentLevel = Math.max(0, calculatedLevel);
    
    const pointsAtStartOfLevel = 5 * currentLevel * (currentLevel + 1);
    const pointsRequiredForNextLevel = 10 * (currentLevel + 1);
    const pointsInCurrentLevel = totalPoints - pointsAtStartOfLevel;
    const progressInLevel = (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100;

    return {
      level: currentLevel,
      progress: isNaN(progressInLevel) ? 0 : progressInLevel,
      currentXp: pointsInCurrentLevel,
      requiredXp: pointsRequiredForNextLevel,
      totalPoints
    };
  }, [papers]);

  const stats = useMemo(() => {
    return {
      accepted: papers.filter(p => p.status === PaperStatus.ACCEPTED).length,
      submitted: papers.filter(p => p.status === PaperStatus.SUBMITTED).length,
      writing: papers.filter(p => p.status === PaperStatus.WRITING).length,
      target: papers.filter(p => p.status === PaperStatus.TARGET).length,
      rejected: papers.filter(p => p.status === PaperStatus.REJECTED).length
    };
  }, [papers]);

  const openNewModal = () => {
    setEditingPaper(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {ICONS.BRAIN}
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ScholarQuest <span className="text-blue-500 text-sm font-medium ml-1">科研录本</span>
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total XP:</span>
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-sm font-bold rounded border border-blue-500/20 transition-all duration-300">
                {levelingData.totalPoints}
              </span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest ml-4">Accepted:</span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-sm font-bold rounded border border-green-500/20">
                {stats.accepted}
              </span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest ml-4">Scars:</span>
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-sm font-bold rounded border border-red-500/20">
                {stats.rejected}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <GraduationProgress 
          level={levelingData.level} 
          progress={levelingData.progress}
          currentXp={levelingData.currentXp}
          requiredXp={levelingData.requiredXp}
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab(PaperStatus.ACCEPTED)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${activeTab === PaperStatus.ACCEPTED ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {ICONS.ACCEPTED}
              <span>中稿</span>
              <span className="ml-1 text-xs opacity-60">({stats.accepted})</span>
            </button>
            <button 
              onClick={() => setActiveTab(PaperStatus.SUBMITTED)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${activeTab === PaperStatus.SUBMITTED ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {ICONS.SUBMITTED}
              <span>在投</span>
              <span className="ml-1 text-xs opacity-60">({stats.submitted})</span>
            </button>
            <button 
              onClick={() => setActiveTab(PaperStatus.WRITING)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${activeTab === PaperStatus.WRITING ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {ICONS.WRITING}
              <span>在写</span>
              <span className="ml-1 text-xs opacity-60">({stats.writing})</span>
            </button>
            <button 
              onClick={() => setActiveTab(PaperStatus.TARGET)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${activeTab === PaperStatus.TARGET ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {ICONS.TARGET}
              <span>目标</span>
              <span className="ml-1 text-xs opacity-60">({stats.target})</span>
            </button>
            <button 
              onClick={() => setActiveTab(PaperStatus.REJECTED)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300 whitespace-nowrap ${activeTab === PaperStatus.REJECTED ? 'bg-red-800 text-white shadow-lg shadow-red-900/40' : 'text-red-900/60 hover:text-red-500 hover:bg-red-950/20'}`}
            >
              {ICONS.REJECTED}
              <span>拒稿</span>
              <span className="ml-1 text-xs opacity-60">({stats.rejected})</span>
            </button>
          </div>

          <button 
            onClick={openNewModal}
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95 group"
          >
            {ICONS.PLUS}
            <span>录入灵感</span>
          </button>
        </div>

        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredPapers.map(paper => (
              <div key={paper.id} className="h-full">
                <PaperCard 
                  paper={paper} 
                  onDelete={deletePaper} 
                  onEdit={startEditing}
                  onStatusChange={updatePaperStatus}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="p-6 bg-slate-900 rounded-full mb-4 opacity-50">
              {activeTab === PaperStatus.REJECTED ? ICONS.REJECTED : ICONS.BRAIN}
            </div>
            <p className="text-xl font-medium">
              {activeTab === PaperStatus.REJECTED ? "此地空无一物，祝愿深渊永远寂静" : "暂时没有记录，点击上方按钮开启您的研究篇章"}
            </p>
            <p className="text-sm mt-2 opacity-60 italic">每一个伟大的发现都始于一条微小的记录</p>
          </div>
        )}
      </main>

      <PaperModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPaper(null);
        }}
        status={activeTab}
        onSubmit={handleAddOrUpdatePaper}
        initialData={editingPaper}
      />

      <button 
        onClick={openNewModal}
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 z-50 animate-bounce-slow"
      >
        {ICONS.PLUS}
      </button>
      
      <div className="fixed top-0 left-0 w-full h-[500px] bg-blue-600/5 blur-[150px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-full h-[500px] bg-purple-600/5 blur-[150px] -z-10 pointer-events-none"></div>
    </div>
  );
};

export default App;
