
import React, { useState, useEffect } from 'react';
import { PaperRecord, ConferenceTier, PaperStatus, PaperResult } from '../types';
import { ICONS } from '../constants';

interface PaperModalProps {
  status: PaperStatus;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paper: Omit<PaperRecord, 'id' | 'createdAt'>) => void;
  initialData?: PaperRecord | null;
}

const PaperModal: React.FC<PaperModalProps> = ({ status, isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    conference: '',
    tier: ConferenceTier.OTHER,
    submissionDate: '',
    scoreReleaseDate: '',
    scores: '',
    rebuttalDate: '',
    finalScores: '',
    result: PaperResult.PENDING,
    content: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        conference: initialData.conference,
        tier: initialData.tier,
        submissionDate: initialData.submissionDate,
        scoreReleaseDate: initialData.scoreReleaseDate,
        scores: initialData.scores,
        rebuttalDate: initialData.rebuttalDate,
        finalScores: initialData.finalScores,
        result: initialData.result,
        content: initialData.content
      });
    } else {
      setFormData({
        title: '',
        conference: '',
        tier: ConferenceTier.OTHER,
        submissionDate: '',
        scoreReleaseDate: '',
        scores: '',
        rebuttalDate: '',
        finalScores: '',
        result: PaperResult.PENDING,
        content: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, status: initialData ? initialData.status : status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="p-2 bg-blue-500/20 text-blue-500 rounded-xl">
              {initialData ? ICONS.EDIT : (status === PaperStatus.SUBMITTED ? ICONS.SUBMITTED : status === PaperStatus.WRITING ? ICONS.WRITING : ICONS.TARGET)}
            </span>
            {initialData ? '修缮科研印记' : '开启新的科研征程'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400">论文题目 (Title)</label>
            <input 
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="请输入惊世骇俗的论文题目..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">会议/期刊 (Conference)</label>
              <input 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="例如: CVPR 2025"
                value={formData.conference}
                onChange={e => setFormData({...formData, conference: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">级别 (Tier)</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={formData.tier}
                onChange={e => setFormData({...formData, tier: e.target.value as ConferenceTier})}
              >
                <option value={ConferenceTier.A}>CCF A (金色传说)</option>
                <option value={ConferenceTier.B}>CCF B (碧绿翡翠)</option>
                <option value={ConferenceTier.C}>CCF C (碧蓝臻品)</option>
                <option value={ConferenceTier.OTHER}>其他 (普通品质)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">投稿时间</label>
              <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.submissionDate} onChange={e => setFormData({...formData, submissionDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">出分时间</label>
              <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.scoreReleaseDate} onChange={e => setFormData({...formData, scoreReleaseDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">反驳(Rebuttal)时间</label>
              <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.rebuttalDate} onChange={e => setFormData({...formData, rebuttalDate: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">初始分数</label>
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="如: 4, 3, 4" value={formData.scores} onChange={e => setFormData({...formData, scores: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">最终分数</label>
              <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="如: 5, 4, 5" value={formData.finalScores} onChange={e => setFormData({...formData, finalScores: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400">内容简介</label>
            <textarea 
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="简单记录一下这篇Paper的核心Idea吧..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="pt-4 sticky bottom-0 bg-slate-900 border-t border-slate-800">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              {initialData ? '保存修改' : '录入记录本'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaperModal;
