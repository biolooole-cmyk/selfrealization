import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { Check, Info, HelpCircle, Lightbulb } from 'lucide-react';

interface Props {
  question: Question;
  onAnswer: (answer: any) => void;
  disabled: boolean;
}

export default function QuestionRenderer({ question, onAnswer, disabled }: Props) {
  const [selected, setSelected] = useState<any>(null);
  const [multipleSelected, setMultipleSelected] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [classification, setClassification] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset state when question changes
    setSelected(null);
    setMultipleSelected([]);
    setMatches({});
    setClassification({});
  }, [question.id]);

  const handleSubmitMultiple = () => {
    if (multipleSelected.length > 0) {
      onAnswer(multipleSelected);
    }
  };

  const renderSingleChoice = () => (
    <div className="grid gap-4">
      {question.options?.map((option, idx) => (
        <button
          key={idx}
          disabled={disabled}
          onClick={() => onAnswer(option)}
          className={`p-5 text-left rounded-xl border-2 transition-all font-semibold text-base active:scale-[0.98] ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 hover:border-cyan-400 hover:bg-slate-700 group'
          }`}
        >
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-[10px] font-mono text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
               0{idx + 1}
             </div>
             {option}
          </div>
        </button>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['true', 'false'].map((val) => (
        <button
          key={val}
          disabled={disabled}
          onClick={() => onAnswer(val)}
          className={`p-10 rounded-2xl border-2 font-black uppercase tracking-[0.2em] text-lg transition-all active:scale-[0.98] ${
             disabled ? 'opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 hover:border-cyan-400 shadow-xl'
          }`}
        >
          {val === 'true' ? 'Підтверджую' : 'Заперечую'}
        </button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="grid gap-4">
      {question.options?.map((option, idx) => {
        const isSelected = multipleSelected.includes(option);
        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => {
              if (isSelected) {
                setMultipleSelected(multipleSelected.filter(i => i !== option));
              } else {
                setMultipleSelected([...multipleSelected, option]);
              }
            }}
            className={`p-5 text-left rounded-xl border-2 transition-all font-semibold flex justify-between items-center ${
              isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'bg-slate-800 border-slate-700'
            } ${disabled ? 'opacity-50' : 'hover:border-cyan-500/50'}`}
          >
            <div className="flex items-center gap-4">
               <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-900 border-slate-600'}`}>
                 {isSelected && <Check size={14} className="text-white" />}
               </div>
               {option}
            </div>
          </button>
        );
      })}
      <button 
        disabled={disabled || multipleSelected.length === 0}
        onClick={handleSubmitMultiple}
        className="mt-6 p-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg uppercase tracking-widest shadow-xl hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
      >
        Перевірити Вибір
      </button>
    </div>
  );

  const renderMatching = () => (
    <div className="grid gap-8">
      <div className="grid gap-4">
         {question.pairs?.map((pair, idx) => (
           <div key={idx} className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold flex items-center gap-3">
                <span className="text-cyan-400 font-mono text-[10px] opacity-60">0{idx+1}</span>
                {pair.left}
             </div>
             <div className="hidden md:block w-8 h-0.5 bg-slate-700 opacity-50"></div>
             <select
               disabled={disabled}
               className="flex-1 w-full p-4 rounded-xl border border-slate-700 bg-slate-900 text-sm font-medium focus:border-yellow-400 outline-none transition-colors appearance-none cursor-pointer"
               value={matches[pair.left] || ""}
               onChange={(e) => setMatches({...matches, [pair.left]: e.target.value})}
             >
               <option value="">Оберіть результат...</option>
               {question.pairs?.map((p, i) => (
                 <option key={i} value={p.right}>{p.right}</option>
               ))}
             </select>
           </div>
         ))}
      </div>
      <button 
        disabled={disabled || Object.keys(matches).length < (question.pairs?.length || 0)}
        onClick={() => onAnswer(matches)}
        className="p-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg uppercase tracking-widest shadow-xl disabled:opacity-50"
      >
        З'єднати Дані
      </button>
    </div>
  );

  const renderClassification = () => {
    const items = question.categories?.flatMap(c => c.items) || [];
    const categories = question.categories?.map(c => c.name) || [];

    return (
      <div className="grid gap-8">
        <div className="grid gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-4 bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
              <span className="font-semibold text-slate-200">{item}</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    disabled={disabled}
                    onClick={() => setClassification({...classification, [item]: cat})}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      classification[item] === cat 
                        ? 'bg-yellow-500 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                        : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-yellow-500/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button 
          disabled={disabled || Object.keys(classification).length < items.length}
          onClick={() => onAnswer(classification)}
          className="p-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg uppercase tracking-widest shadow-xl disabled:opacity-50"
        >
          Завершити Опрацювання
        </button>
      </div>
    );
  };

  const renderLogicalChain = () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-3 p-8 bg-slate-900 rounded-3xl border-2 border-dashed border-slate-700/50">
        {question.chain?.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className={`px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${idx === question.missingIndex ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' : 'bg-slate-800 text-white border border-slate-700'}`}>
              {idx === question.missingIndex ? '???' : item}
            </div>
            {idx < (question.chain?.length || 0) - 1 && <ArrowRight size={14} className="text-slate-600" />}
          </React.Fragment>
        ))}
      </div>
      <div className="grid gap-4">
        {question.options?.map((option, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onAnswer(option)}
            className="p-5 text-left rounded-xl border border-slate-700 bg-slate-800 font-semibold hover:border-cyan-500 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const getQuestionBody = () => {
    switch (question.type) {
      case 'test_single':
      case 'case':
      case 'odd_one_out':
        return renderSingleChoice();
      case 'true_false':
        return renderTrueFalse();
      case 'test_multiple':
        return renderMultipleChoice();
      case 'matching':
        return renderMatching();
      case 'classification':
        return renderClassification();
      case 'logical_chain':
        return renderLogicalChain();
      default:
        return <div>Тип питання не підтримується</div>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="flex flex-col gap-10"
    >
      <div className="text-center md:text-left">
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase rounded-full border border-cyan-500/30 mb-6 inline-flex items-center gap-2">
          <HelpCircle size={12} /> {question.type.split('_').join(' ')}
        </span>
        <h3 className="text-3xl font-light mb-4 leading-tight text-white">
          {question.question}
        </h3>
        <p className="text-slate-400 text-sm max-w-2xl">
          Кожна правильна відповідь наближає тебе до Самореалізації та відкриває нові сектори бази даних.
        </p>
      </div>

      <div className="mt-2">
        {getQuestionBody()}
      </div>
      
      <div className="flex items-start gap-4 p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
        <Lightbulb size={24} className="text-yellow-400 shrink-0 mt-1" />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.1em]">Intelligence Tip</span>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "Освіта — це процес, що триває крізь усе життя. Кожен крок тут — це інвестиція у твоє майбутнє."
          </p>
        </div>
      </div>
    </motion.div>
  );
}

const ArrowRight = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
