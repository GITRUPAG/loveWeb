"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Heart, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

const QUESTIONS = [
  {
    id: 1,
    question: "What's our ideal 'doing nothing' afternoon?",
    options: ["Coffee & Reading", "Movie Marathon", "Long Drive", "Deep Conversations"],
    emoji: "☕"
  },
  {
    id: 2,
    question: "Which love language describes me best?",
    options: ["Physical Touch", "Words of Affirmation", "Quality Time", "Acts of Service"],
    emoji: "💬"
  },
  {
    id: 3,
    question: "Our dream travel destination would be...",
    options: ["Mountains & Snow", "Tropical Beach", "Historic City", "Countryside Villa"],
    emoji: "✈️"
  }
];

export default function Day1Quiz() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const saveResults = async (finalAnswers: string[]) => {
    if (!user) {
      // If guest, we just show the finish screen without saving
      setIsFinished(true);
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, `users/${user.uid}/responses`, "day1"), {
        answers: finalAnswers,
        completedAt: serverTimestamp(),
      });
      setIsFinished(true);
    } catch (error) {
      console.error("Error saving answers:", error);
      alert("Something went wrong saving your progress.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveResults(newAnswers);
    }
  };

  if (isSaving) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
        <p className="text-rose-400 font-medium animate-pulse">Sealing your answers with love...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* ... (Keep the Background Decor and Back Button from previous code) ... */}

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md text-center"
          >
            <span className="text-4xl mb-6 block">{QUESTIONS[currentStep].emoji}</span>
            <h2 className="text-2xl font-bold mb-8 tracking-tight text-black">
              {QUESTIONS[currentStep].question}
            </h2>

            <div className="grid gap-4">
              {QUESTIONS[currentStep].options.map((option) => (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-6 bg-white border border-rose-100 rounded-[2rem] text-left font-medium hover:border-rose-400 hover:bg-rose-50 transition-all shadow-sm flex justify-between items-center group text-slate-700"
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
            className="w-full max-w-md text-center bg-white p-10 rounded-[3.5rem] shadow-2xl border border-rose-50"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-rose-100 to-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Sparkles className="text-rose-500" size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-black">Answers Saved!</h2>
            <p className="text-slate-500 mb-10 leading-relaxed text-sm">
              Your "Vibe Check" is locked. Once your partner joins, we'll reveal if they actually know you as well as they think!
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-rose-500 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-rose-200 active:scale-95 transition-transform"
              >
                Back to Dashboard
              </button>
              {!user && (
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Note: Log in to save progress permanently
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}