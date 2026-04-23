import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-32 md:w-64 bg-slate-700/50 h-1.5 rounded-full overflow-hidden border border-slate-600/30">
      <motion.div 
        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "circOut" }}
      />
    </div>
  );
}
