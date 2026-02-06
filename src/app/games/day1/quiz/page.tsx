"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ Corrected Import
import { ArrowLeft, ChevronRight, Sparkles, Heart, RotateCcw, Home, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "If we were flowers in a garden, where would I be?",
    options: ["Right in the center", "Hiding in the shade", "Climbing the fence", "In a beautiful vase"],
    emoji: "🌹"
  },
  {
    id: 2,
    question: "What's my favorite way to receive a rose?",
    options: ["A surprise delivery", "Hand-picked by you", "A single perfect stem", "A huge bouquet"],
    emoji: "💝"
  },
  {
    id: 3,
    question: "Which vibe best describes our love story?",
    options: ["Slow Burn", "Instant Spark", "Best Friends First", "Written in Stars"],
    emoji: "✨"
  }
];

export default function Day1Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = () => {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Logic: Generate a high score for Day 1 to boost the mood!
      const finalScore = Math.floor(Math.random() * 15) + 85; 
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const getVerdict = (s: number) => {
    if (s > 95) return "Absolute Soulmates!";
    if (s > 90) return "Perfectly Synced!";
    return "Meant to Be!";
  };

  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-800 flex flex-col items-center p-6 relative">
      
      {/* HEADER & PROGRESS */}
      <div className="w-full max-w-md mt-4">
        <div className="flex items-center justify-between mb-6">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()} 
            className="p-3 bg-white rounded-full shadow-sm text-slate-500"
          >
            <ArrowLeft size={20}/>
          </motion.button>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Step {step + 1} of 3</span>
          <div className="w-10" />
        </div>
        
        {!showResult && (
          <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-rose-500"
            />
          </div>
        )}
      </div>

      <main className="flex-1 w-full max-w-md flex flex-col justify-center py-10">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="text-6xl mb-6 block"
                >
                  {QUIZ_QUESTIONS[step].emoji}
                </motion.span>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                  {QUIZ_QUESTIONS[step].question}
                </h2>
              </div>

              <div className="grid gap-4">
                {QUIZ_QUESTIONS[step].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnswer}
                    className="w-full p-6 bg-white border border-rose-100 rounded-[1.8rem] text-left font-bold hover:border-rose-400 hover:bg-rose-50 transition-all flex justify-between items-center group shadow-sm shadow-rose-200/10 text-slate-700"
                  >
                    {option}
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <ChevronRight size={16} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-rose-50 text-center relative overflow-hidden"
            >
              {/* Confetti-like Sparkles */}
              <Sparkles className="absolute top-6 left-6 text-amber-300 animate-pulse" size={24} />
              <Sparkles className="absolute bottom-6 right-6 text-rose-300 animate-pulse" size={20} />

              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
                  <Trophy className="text-rose-500" size={44} />
                </div>
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-full border-4 border-white"
                >
                  <Heart size={16} fill="currentColor" />
                </motion.div>
              </div>

              <h2 className="text-3xl font-black mb-1">{score}% Match</h2>
              <p className="text-rose-500 font-bold uppercase tracking-widest text-[10px] mb-4">
                {getVerdict(score)}
              </p>
              
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                Your heart is in the right place! We've saved your "Rose Vibe" for the final Valentine reveal.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/games/day1')}
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
                >
                  <Home size={18} /> Back to Day 1
                </button>
                <button 
                  onClick={() => { setShowResult(false); setStep(0); }}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:text-rose-500 transition-colors"
                >
                  <RotateCcw size={14} /> Reset Vibe Check
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-rose-200/20 blur-[120px] -z-10 rounded-full" />
    </div>
  );
}