"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, ArrowRight, CheckCircle2, XCircle, Camera, Star } from "lucide-react";

export default function MemoryPlayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [game, setGame] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [revealData, setRevealData] = useState<any>(null);
  const [loadingGuess, setLoadingGuess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const steps = [
    { key: "place", label: "Where was this photo taken?", emoji: "📍", hint: "Think about our special places..." },
    { key: "movie", label: "What movie is this from?", emoji: "🎬", hint: "Remember that cozy evening..." },
    { key: "gift", label: "What gift is this?", emoji: "🎁", hint: "A token of love..." }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/memory-games/${id}`)
      .then(res => res.json())
      .then(setGame);
  }, [id]);

  if (!game) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="text-purple-500" size={40} />
        </motion.div>
      </div>
    );
  }

  const currentStep = steps[current];
  const image = game[`${currentStep.key}ImageUrl`];

  const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#a855f7", "#ec4899", "#f43f5e"],
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#a855f7", "#ec4899", "#f43f5e"],
      });
    }, 100);
  };

  const submitGuess = async () => {
    setLoadingGuess(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/memory-games/${id}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: currentStep.key.toUpperCase(),
        guess
      })
    });

    const data = await res.json();

    setRevealData(data);
    setIsCorrect(data.correct);

    if (data.correct) {
      setScore(s => s + 1);
      fireConfetti();
    }

    setRevealed(true);
    setLoadingGuess(false);
  };

  const next = () => {
    // Calculate final score properly to avoid async state issues
    const finalScore = isCorrect ? score : score;

    if (current === 2) {
      router.push(`/games/day2/memory/result/${id}?score=${finalScore}`);
      return;
    }

    setCurrent(current + 1);
    setGuess("");
    setRevealed(false);
    setRevealData(null);
    setIsCorrect(null);
  };

  const progress = ((current + (revealed ? 1 : 0)) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#FFF9F5] relative overflow-hidden">
      
      {/* Premium background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft mesh gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, hsla(280, 100%, 96%, 1) 0px, transparent 50%),
              radial-gradient(at 80% 70%, hsla(340, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 40% 80%, hsla(320, 100%, 96%, 1) 0px, transparent 50%)
            `,
          }}
        />

        {/* Floating elements - fixed hydration */}
        {mounted && [...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {i % 3 === 0 ? (
              <Heart size={14 + Math.random() * 12} className="text-rose-200/20" fill="currentColor" />
            ) : i % 3 === 1 ? (
              <Star size={14 + Math.random() * 12} className="text-purple-200/20" fill="currentColor" />
            ) : (
              <Sparkles size={14 + Math.random() * 12} className="text-pink-200/20" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header with progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8"
        >
          {/* Progress bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">
                Memory {current + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-purple-600">
                Score: {score}/{steps.length}
              </span>
            </div>
            <div className="h-2 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden border border-purple-200/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
              />
            </div>
          </div>

          {/* Game info - using custom question from creator */}
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block text-5xl mb-4"
            >
              {currentStep.emoji}
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-light text-slate-900 mb-2">
              {game[`${currentStep.key}Question`] || currentStep.label}
            </h1>
            <p className="text-sm text-slate-500 italic font-light">
              {currentStep.hint}
            </p>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-2xl">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                
                {/* Photo card with scrapbook styling */}
                <div className="relative">
                  {/* Decorative tape strips */}
                  <div className="absolute -top-4 left-1/4 w-24 h-8 bg-gradient-to-b from-amber-100/60 to-amber-200/60 backdrop-blur-sm rotate-[-5deg] rounded-sm shadow-sm z-10 border border-amber-300/30" />
                  <div className="absolute -top-4 right-1/4 w-24 h-8 bg-gradient-to-b from-amber-100/60 to-amber-200/60 backdrop-blur-sm rotate-[5deg] rounded-sm shadow-sm z-10 border border-amber-300/30" />
                  
                  {/* Main photo container */}
                  <motion.div
                    className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-4 border-white"
                    style={{
                      transform: `rotate(${Math.random() * 2 - 1}deg)`,
                    }}
                  >
                    {/* Photo */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                      <motion.img
                        src={image}
                        alt="Memory"
                        className="w-full h-full object-cover"
                        initial={{ filter: "blur(30px)" }}
                        animate={{ 
                          filter: revealData ? "blur(0px)" : "blur(30px)",
                          scale: revealData ? 1 : 1.1,
                        }}
                        transition={{ duration: 0.7 }}
                      />
                      
                      {/* Blur overlay when not revealed */}
                      {!revealData && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-rose-500/20 backdrop-blur-sm"
                        >
                          <div className="text-center">
                            <Camera className="mx-auto mb-3 text-white drop-shadow-lg" size={48} />
                            <p className="text-white font-semibold text-lg drop-shadow-lg">
                              Make your guess to reveal!
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Polaroid-style caption area - ROMANTIC REVEAL */}
                    <div className="mt-4 text-center min-h-[100px] flex items-center justify-center px-4">
                      <AnimatePresence mode="wait">
                        {revealed && revealData ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3 max-w-md w-full"
                          >
                            {/* Correct/Incorrect indicator */}
                            <div className="flex items-center justify-center gap-2">
                              {isCorrect ? (
                                <>
                                  <CheckCircle2 className="text-green-500" size={24} />
                                  <p className="text-lg font-semibold text-green-700">
                                    Correct! 🎉
                                  </p>
                                </>
                              ) : (
                                <>
                                  <XCircle className="text-rose-500" size={24} />
                                  <p className="text-lg font-semibold text-rose-700">
                                    Not quite!
                                  </p>
                                </>
                              )}
                            </div>

                            {/* The actual answer */}
                            <p className="text-slate-700 font-medium">
                              It was:{" "}
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-600 font-bold">
                                {revealData.actualAnswer}
                              </span>
                            </p>

                            {/* THE STORY - Main emotional moment ❤️ */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-gradient-to-br from-purple-50/80 to-rose-50/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/30"
                            >
                              <p className="text-slate-600 italic leading-relaxed text-sm">
                                "{revealData.story}"
                              </p>
                            </motion.div>

                            {/* Reaction message */}
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600"
                            >
                              {revealData.reactionMessage}
                            </motion.p>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-400 italic text-sm"
                          >
                            A special memory waiting to be remembered...
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Decorative corner stickers */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br from-purple-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <span className="text-2xl">{currentStep.emoji}</span>
                  </motion.div>
                </div>

                {/* Input section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12"
                >
                  {!revealed ? (
                    <div className="bg-white/100 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-100/50 shadow-[0_20px_50px_rgba(168,85,247,0.1)]">
                      <label className="block mb-4">
                        <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <Sparkles size={16} className="text-purple-500" />
                          Your Guess
                        </span>
                        <input
                          type="text"
                          value={guess}
                          onChange={(e) => setGuess(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && guess && !loadingGuess && submitGuess()}
                          placeholder="Type your answer here..."
                          className="w-full px-6 py-4 rounded-2xl border-2 border-purple-200/50 bg-white/60 backdrop-blur-sm
                                     focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                                     transition-all outline-none text-slate-800 placeholder:text-slate-400 text-lg"
                          autoFocus
                          disabled={loadingGuess}
                        />
                      </label>

                      <motion.button
                        onClick={submitGuess}
                        disabled={!guess || loadingGuess}
                        whileHover={guess && !loadingGuess ? { scale: 1.02, y: -2 } : {}}
                        whileTap={guess && !loadingGuess ? { scale: 0.98 } : {}}
                        className={`
                          w-full relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden
                          transition-all duration-300
                          ${guess && !loadingGuess
                            ? 'shadow-[0_20px_50px_rgba(168,85,247,0.3)] cursor-pointer'
                            : 'opacity-50 cursor-not-allowed shadow-lg'
                          }
                        `}
                      >
                        {/* Animated gradient background */}
                        <motion.div
                          animate={guess && !loadingGuess ? {
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          } : {}}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-[length:200%_100%]"
                        />
                        
                        {/* Top highlight */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        
                        <span className="relative text-white flex items-center justify-center gap-2">
                          {loadingGuess ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles size={20} />
                              </motion.div>
                              Revealing...
                            </>
                          ) : (
                            <>
                              Submit Answer
                              <ArrowRight size={20} />
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center"
                    >
                      <motion.button
                        onClick={next}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-10 py-4 rounded-2xl font-semibold text-lg overflow-hidden shadow-[0_20px_50px_rgba(168,85,247,0.3)]"
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-[length:200%_100%]"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "radial-gradient(circle at center, rgba(255,255,255,0.25), transparent 70%)",
                          }}
                        />
                        
                        <span className="relative text-white flex items-center gap-2">
                          {current === 2 ? "See Results" : "Next Memory"}
                          <ArrowRight size={20} />
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}