import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Share2, Award, Zap } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  onRestart: () => void;
}

export default function ResultScreen({ score, onRestart }: ResultScreenProps) {
  const getRank = () => {
    if (score >= 400) return 'Магістр саморозвитку';
    if (score >= 250) return 'Дослідник можливостей';
    return 'Початківець у світі знань';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-4xl mx-auto"
    >
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border-2 border-dashed border-cyan-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-slate-700 rounded-full"
        />
        <div className="w-48 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10 border border-slate-700">
          <Trophy size={96} className="text-cyan-400" />
        </div>
      </div>
      
      <h2 className="text-5xl font-black uppercase mb-2 tracking-tighter">Місія Виконана</h2>
      <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs mb-10">{getRank()}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[100px] font-black -rotate-12 group-hover:opacity-10 transition-opacity">XP</div>
          <Zap size={24} className="text-yellow-400 mb-2 mx-auto" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Набрано Енергії</p>
          <p className="text-5xl font-black text-white ">{score}</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[100px] font-black -rotate-12 group-hover:opacity-10 transition-opacity">OK</div>
          <Award size={24} className="text-cyan-400 mb-2 mx-auto" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Викликів Подолано</p>
          <p className="text-5xl font-black text-white">24</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-xl text-xl font-bold transition-all hover:bg-cyan-400 hover:text-white shadow-xl active:scale-95"
        >
          <RotateCcw size={20} />
          Перезавантажити
        </button>
      </div>
      
      <div className="mt-16 flex items-center gap-4 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
         <span>Transmission End</span>
         <span className="w-12 h-px bg-slate-800"></span>
         <span>Sector Clear</span>
      </div>
    </motion.div>
  );
}
