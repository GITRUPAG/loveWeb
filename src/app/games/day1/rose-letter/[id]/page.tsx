"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function RoseLetterClient() {
  const { id } = useParams<{ id: string }>();
  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  
  const [localRevealedSteps, setLocalRevealedSteps] = useState(0);
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);

  const totalSteps = 6;

  const PetalIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 0C50 0 100 20 100 60C100 85 80 100 50 100C20 100 0 85 0 60C0 20 50 0 50 0Z" />
    </svg>
  );

  const petalPositions = useMemo(() => {
    return [...Array(totalSteps)].map((_, i) => ({
      id: i,
      top: `${20 + Math.random() * 55}%`,
      left: `${15 + Math.random() * 70}%`,
      rotate: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4,
      duration: 3 + Math.random() * 3,
    }));
  }, []);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-letters/${id}`);
        const data = await res.json();
        setLetter(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchLetter();
  }, [id]);

  // Audio feedback for petal clicks
  const playPetalSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800 + Math.random() * 400; // Soft chime
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      // Silently fail if audio context not supported
      console.log("Audio not supported");
    }
  }, []);

  const handlePetalClick = useCallback((index: number, e: React.MouseEvent) => {
    if (clickedIndices.includes(index)) return;

    // Play sound
    playPetalSound();

    // 1. Individual Petal Burst (Sparkle Motion)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 15,
      startVelocity: 20,
      spread: 90,
      origin: { x, y },
      colors: ['#fb7185', '#fff', '#fda4af'],
      shapes: ['circle'],
      scalar: 0.7
    });

    const newSteps = localRevealedSteps + 1;
    setLocalRevealedSteps(newSteps);
    setClickedIndices((prev) => [...prev, index]);

    // 2. Final Celebration Burst
    if (newSteps === totalSteps) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        confetti({
          particleCount: 40,
          startVelocity: 30,
          spread: 360,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#fb7185', '#fda4af', '#ffffff', '#ffe4e6']
        });
      }, 250);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-letters/${id}/reveal`, { method: "POST" });
  }, [localRevealedSteps, clickedIndices, id, playPetalSound]);

  // Focus management after reveal
  useEffect(() => {
    if (localRevealedSteps >= totalSteps) {
      setTimeout(() => {
        const letterElement = document.querySelector('main');
        letterElement?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 600);
      
      // Delay share button for emotional peak
      setTimeout(() => setShowShare(true), 2000);
    }
  }, [localRevealedSteps]);

  // Reaction feedback animation
  useEffect(() => {
    if (reaction) {
      confetti({
        particleCount: 25,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#fb7185', '#fda4af', '#ffffff']
      });
    }
  }, [reaction]);

  const handleShare = async () => {
    const shareData = {
      title: "A Rose Letter for You 🌹",
      text: `I just opened a rose letter... and it made my day 🌹`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Optional: show "Link copied!" toast here
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  const handleReaction = async (emoji: string) => {
    setReaction(emoji);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-letters/${id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: emoji })
      });
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Loader2 className="animate-spin text-rose-200" size={40} strokeWidth={1} />
    </div>
  );

  const isComplete = localRevealedSteps >= totalSteps;
  const blurAmount = isComplete ? 0 : (1 - localRevealedSteps / totalSteps) * 16;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-rose-50/30 to-slate-100 flex items-center justify-center p-6 overflow-hidden">
      
      <div className="relative w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl border border-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

          {/* Bloom glow effect on reveal */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-96 h-96 bg-rose-300/40 rounded-full blur-3xl"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <header className="text-center mb-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="mx-auto mb-4 text-rose-300" size={20} />
              <h1 className="text-4xl md:text-5xl font-serif text-slate-800 italic">
                {letter.fromName}
              </h1>
              <p className="text-xs text-slate-400 mt-3 tracking-wider uppercase">
                Sent you a secret message
              </p>
            </motion.div>
          </header>

          <main className="relative z-10 min-h-[200px] flex items-center justify-center">
            <motion.div
              animate={{ filter: `blur(${blurAmount}px)`, opacity: isComplete ? 1 : 0.2 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-slate-700 font-serif italic">
                {letter.letterText}
              </p>
            </motion.div>
          </main>

          <footer className="mt-12 text-center relative z-10">
            <p className="text-rose-500 font-serif text-xl">{letter.fromName}</p>
          </footer>

          {/* Final reveal moment */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-12 text-center space-y-6 relative z-10"
              >
                <p className="text-rose-400/90 text-base font-serif italic">
                  A letter revealed with love 🌹
                </p>

                {/* Reaction system */}
                <div className="flex gap-3 justify-center">
                  {['❤️', '🥹', '😭', '🥰'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`text-2xl p-3 rounded-full transition-all ${
                        reaction === emoji 
                          ? 'bg-rose-100 scale-125' 
                          : 'hover:bg-rose-50 hover:scale-110'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Share button - delayed appearance */}
                {showShare && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={handleShare}
                      className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-rose-200/50"
                    >
                      Share this moment 💌
                    </button>
                    
                    <button
                      onClick={() => window.location.href = "/games/day1/rose-letter/create"}
                      className="w-full text-sm text-slate-500 hover:text-rose-500 transition-colors py-2"
                    >
                      Write a letter back ✍️
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Petals with Sparkle Exit Motion */}
          <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            <AnimatePresence>
              {!isComplete && petalPositions.map((p, i) => (
                !clickedIndices.includes(i) && (
                  <motion.button
                    key={p.id}
                    className="absolute cursor-pointer outline-none pointer-events-auto"
                    style={{ top: p.top, left: p.left }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: p.scale, 
                      opacity: 0.8, 
                      rotate: p.rotate,
                      y: [0, 15, 0]
                    }}
                    whileHover={{ scale: p.scale * 1.1 }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0,
                      filter: "brightness(2) blur(4px)",
                      transition: { duration: 0.3 }
                    }}
                    transition={{ y: { duration: p.duration, repeat: Infinity, ease: "easeInOut" } }}
                    onClick={(e) => handlePetalClick(i, e)}
                  >
                    <PetalIcon className="w-16 h-16 text-rose-200/90 drop-shadow-sm hover:text-rose-300 transition-colors" />
                  </motion.button>
                )
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Status Stepper */}
        {!isComplete && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-8 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-4 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/60 shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Clear the petals</span>
              <div className="flex gap-1.5">
                {[...Array(totalSteps)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < localRevealedSteps ? 'bg-rose-400' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            {/* Optional: Scarcity trigger */}
            {letter?.createdAt && (
              <motion.p 
                className="text-xs text-slate-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                This message will fade in {Math.max(0, Math.ceil(24 - (Date.now() - new Date(letter.createdAt).getTime()) / 3600000))} hours
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}