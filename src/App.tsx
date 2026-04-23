/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  ShieldCheck, 
  GraduationCap,
  ChevronRight,
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { questions } from './data';
import { Question, UserStats, QuestionType } from './types';

// Components
import QuestionRenderer from './components/QuestionRenderer';
import ProgressBar from './components/ProgressBar';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'briefing' | 'playing' | 'level_complete' | 'game_over'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const levelQuestions = useMemo(() => 
    questions.filter(q => q.level === level), 
  [level]);

  const currentQuestion = levelQuestions[currentQuestionIndex];

  const handleStart = () => {
    setGameState('briefing');
  };

  const startMissions = () => {
    setGameState('playing');
  };

  const levelBriefings = {
    1: {
      title: "Сектор 1: Фундамент Росту",
      text: "В цьому секторі ми вивчаємо основи. Самореалізація — це не просто мрія, це план дій. Ви дізнаєтесь, чому диплом — це лише частина шляху, і як самоосвіта допомагає вам випереджати час.",
      tasks: "8 Місій / Базовий Рівень"
    },
    2: {
      title: "Сектор 2: Сфери Розвитку",
      text: "Тепер ми зануримось у деталі. Інклюзія робить нас сильнішими як громаду, а позашкільна освіта (гуртки, секції) формує ваші унікальні таланти, які не знайдеш у підручниках.",
      tasks: "8 Місій / Середній Рівень"
    },
    3: {
      title: "Сектор 3: Майстерність Адаптації",
      text: "Світ змінюється щохвилини. Вивчаючи дистанційну освіту та гнучкі навички (Soft Skills), ви готуєтесь до майбутнього, де навчання ніколи не закінчується.",
      tasks: "8 Місій / Високий Рівень"
    }
  };

  const handleAnswer = (answer: any) => {
    const isCorrect = validateAnswer(currentQuestion, answer);
    
    if (isCorrect) {
      setScore(prev => prev + (level * 10));
      setFeedback({ 
        isCorrect: true, 
        message: currentQuestion.info?.success || 'Правильно! Відмінна робота!' 
      });
    } else {
      setFeedback({ 
        isCorrect: false, 
        message: currentQuestion.info?.failure || 'Не зовсім так. Спробуй звернути увагу на деталі!' 
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < levelQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        if (level < 3) {
          setGameState('level_complete');
        } else {
          setGameState('game_over');
        }
      }
    }, 4000);
  };

  const validateAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case 'test_single':
      case 'case':
      case 'true_false':
      case 'odd_one_out':
      case 'logical_chain':
        return answer === question.correctAnswer;
      case 'test_multiple':
        if (!Array.isArray(answer) || !Array.isArray(question.correctAnswer)) return false;
        return answer.length === question.correctAnswer.length && 
               answer.every(item => (question.correctAnswer as string[]).includes(item));
      case 'matching':
        if (!answer || !question.pairs) return false;
        return question.pairs.every(p => answer[p.left] === p.right);
      case 'classification':
        if (!answer || !question.categories) return false;
        return question.categories.every(cat => 
          cat.items.every(item => answer[item] === cat.name)
        );
      default:
        return false;
    }
  };

  const nextLevel = () => {
    setLevel(prev => (prev + 1) as 1 | 2 | 3);
    setCurrentQuestionIndex(0);
    setGameState('briefing');
  };

  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentQuestionIndex(0);
    setGameState('start');
  };

  return (
    <div className="h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col selection:bg-cyan-500/30">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center max-w-4xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20">
              <GraduationCap size={48} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tighter mb-6 uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Квест <span className="text-white">зростання</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 font-medium max-w-2xl px-4">
              Відкрий свій шлях до самореалізації. Вивчи значення освіти в сучасному світі за допомогою інтерактивних місій та викликів.
            </p>
            <button 
              onClick={handleStart}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-xl text-xl font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/40 active:scale-95"
            >
              Розпочати місію
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-16 flex gap-12 text-cyan-400/60 text-[10px] uppercase font-mono tracking-[0.2em] font-bold">
              <div className="flex items-center gap-2">
                <Target size={14} /> 3 Сектори складності
              </div>
              <div className="flex items-center gap-2">
                <Star size={14} /> 24 Виклики
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'briefing' && (
          <motion.div 
            key="briefing"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-center h-full p-8 text-center max-w-3xl mx-auto"
          >
             <div className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4">Вхідний Бріфінг</div>
             <h2 className="text-5xl font-black mb-8 uppercase text-white">{levelBriefings[level].title}</h2>
             <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 italic text-[120px] font-black -rotate-12">INFO</div>
                <p className="text-xl text-slate-300 leading-relaxed relative z-10">
                  {levelBriefings[level].text}
                </p>
                <div className="mt-8 flex items-center gap-4 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  <ShieldCheck size={16} /> {levelBriefings[level].tasks}
                </div>
             </div>
             <button 
                onClick={startMissions}
                className="mt-12 group flex items-center gap-3 bg-white text-slate-900 px-12 py-5 rounded-xl text-xl font-bold transition-all hover:bg-cyan-400 hover:text-white shadow-xl active:scale-95"
             >
                Приступити до Виконання
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
          >
            <header className="h-16 bg-slate-800 border-b border-cyan-500/30 flex items-center justify-between px-8 shrink-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <span className="font-bold text-lg">🚀</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight uppercase">Quest: Шлях до Самореалізації</h1>
                  <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase opacity-70">Mission Control: Level {level} / Task {currentQuestionIndex + 1}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Спільний Прогрес</span>
                  <div className="mt-1">
                    <ProgressBar current={((level - 1) * 8 + currentQuestionIndex)} total={24} />
                  </div>
                </div>
                <div className="bg-slate-700/50 px-4 py-1.5 rounded-full border border-slate-600 flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">{score}</span>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">XP</span>
                </div>
              </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
              <aside className="hidden lg:flex w-72 bg-slate-800/40 border-r border-slate-700/50 p-6 flex-col gap-6 shrink-0">
                <div>
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Рівні секторів</h2>
                  <div className="space-y-3">
                    {[1, 2, 3].map((l) => {
                      const isActive = level === l;
                      const isCompleted = level > l;
                      const isLocked = level < l;
                      
                      let appearance = "bg-slate-700/30 border-slate-600 opacity-60";
                      let accentColor = "text-slate-400";
                      let indicator = "bg-slate-600";
                      
                      if (isActive) {
                        appearance = "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10";
                        accentColor = "text-cyan-400";
                        indicator = "bg-cyan-500";
                      } else if (isCompleted) {
                        appearance = "bg-emerald-500/10 border-emerald-500/40";
                        accentColor = "text-emerald-400";
                        indicator = "bg-emerald-500";
                      }

                      return (
                        <div key={l} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${appearance}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${indicator}`}>
                            0{l}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{l === 1 ? 'Базовий' : l === 2 ? 'Середній' : 'Високий'}</div>
                            <div className={`text-[9px] uppercase font-bold ${accentColor}`}>
                              {isCompleted ? 'Пройдено: 8/8' : isActive ? `Завдання: ${currentQuestionIndex}/8` : 'Заблоковано'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto p-4 bg-gradient-to-b from-slate-700/50 to-slate-800 rounded-2xl border border-slate-600">
                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                    "Освіта — це найпотужніша зброя, яку можна використати, щоб змінити світ."
                  </p>
                  <p className="text-[9px] text-cyan-400 mt-2 font-bold uppercase tracking-tighter">— Нельсон Мандела</p>
                </div>
              </aside>

              <section className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-20 flex flex-col relative custom-scrollbar">
                <div className="max-w-3xl w-full mx-auto">
                  <QuestionRenderer 
                    question={currentQuestion} 
                    onAnswer={handleAnswer} 
                    disabled={!!feedback}
                  />
                </div>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`fixed bottom-24 left-1/2 -translate-x-1/2 p-5 rounded-2xl flex items-center gap-4 shadow-2xl z-50 min-w-[320px] backdrop-blur-xl border-l-[6px] ${
                        feedback.isCorrect 
                          ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500' 
                          : 'bg-red-500/20 text-red-100 border-red-500'
                      }`}
                    >
                      {feedback.isCorrect ? (
                        <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle size={24} className="text-red-400 shrink-0" />
                      )}
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wider">{feedback.isCorrect ? 'Знання активовано!' : 'Варто запам’ятати!'}</p>
                        <p className="text-xs opacity-80 leading-relaxed">{feedback.message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </main>

            <footer className="h-20 md:h-16 bg-slate-800 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between px-8 shrink-0 gap-2 p-2">
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> Task {((level - 1) * 8 + currentQuestionIndex + 1)} / 24</span>
                <span className="text-slate-600">|</span>
                <span>Category: {currentQuestion.type.toUpperCase()}</span>
              </div>
              <div className="text-[10px] text-cyan-400/40 uppercase font-bold">
                Level {level} Active Security Protocols
              </div>
            </footer>
          </motion.div>
        )}

        {gameState === 'level_complete' && (
          <motion.div 
            key="level_complete"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center max-w-2xl mx-auto"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
            >
              <Trophy size={64} className="text-white" />
            </motion.div>
            <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Сектор {level} Очищено</h2>
            <p className="text-xl text-slate-400 mb-12">
              Ваші навички ростуть. Наступний сектор вимагає вищого рівня аналітичного мислення.
            </p>
            <button 
              onClick={nextLevel}
              className="flex items-center gap-3 bg-white text-slate-900 px-12 py-5 rounded-xl text-xl font-bold transition-all hover:bg-cyan-400 hover:text-white shadow-xl group active:scale-95"
            >
              Перейти до Бріфінгу Сектору {level + 1}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {gameState === 'game_over' && (
          <ResultScreen score={score} onRestart={restartGame} />
        )}
      </AnimatePresence>
    </div>
  );
}

