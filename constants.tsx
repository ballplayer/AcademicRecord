
import React from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Dna, 
  Send, 
  Edit3, 
  Target, 
  Calendar, 
  Star, 
  Award,
  ChevronRight,
  Plus,
  Trash2,
  BrainCircuit,
  GraduationCap,
  CheckCircle2,
  Pencil,
  Skull,
  XCircle
} from 'lucide-react';

export const ICONS = {
  A: <Trophy className="text-yellow-400 w-5 h-5" />,
  B: <Flame className="text-emerald-400 w-5 h-5" />,
  C: <Zap className="text-sky-400 w-5 h-5" />,
  OTHER: <Star className="text-slate-400 w-5 h-5" />,
  ACCEPTED: <Award className="w-5 h-5" />,
  SUBMITTED: <Send className="w-5 h-5" />,
  WRITING: <Edit3 className="w-5 h-5" />,
  TARGET: <Target className="w-5 h-5" />,
  REJECTED: <Skull className="w-5 h-5" />,
  CALENDAR: <Calendar className="w-4 h-4" />,
  PLUS: <Plus className="w-5 h-5" />,
  TRASH: <Trash2 className="w-4 h-4" />,
  BRAIN: <BrainCircuit className="w-6 h-6" />,
  GRADUATION: <GraduationCap className="w-8 h-8" />,
  CHECK: <CheckCircle2 className="w-4 h-4" />,
  EDIT: <Pencil className="w-4 h-4" />,
  CLOSE: <XCircle className="w-4 h-4" />
};

export const TIER_STYLES = {
  A: "golden-glow border-yellow-400 bg-gradient-to-br from-slate-900 via-yellow-950 to-slate-900",
  B: "emerald-glow border-emerald-400 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900",
  C: "sapphire-glow border-sky-400 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900",
  Other: "border-slate-700 bg-slate-900/50 hover:border-slate-500 transition-colors"
};

export const TIER_LABELS = {
  A: "金色传说",
  B: "碧绿翡翠",
  C: "碧蓝臻品",
  Other: "普通品质"
};
