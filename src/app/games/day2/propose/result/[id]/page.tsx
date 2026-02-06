"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Share2, Send } from "lucide-react";

export default function ProposalResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [proposal, setProposal] = useState<any>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals/${id}`
      );
      const data = await res.json();
      setProposal(data);

      // Staggered content reveal
      setTimeout(() => setShowContent(true), 800);

      // Epic celebration 🎉
      setTimeout(() => fireConfetti(), 1000);
    };

    fetchProposal();
  }, [id]);

  const fireConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      // Multiple confetti bursts from different angles
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#ff0000", "#ffd700", "#ffffff"],
      });
      
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#ff69b4", "#ffd700", "#ffffff"],
      });

      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#fda4af", "#ffd700", "#ffffff"],
      });
    }, 250);
  };

  const handleShare = async () => {
    const shareData = {
      title: "She said YES 💍",
      text: `${proposal.fromName} & ${proposal.toName} are now official ❤️`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied! 💕");
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-red-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="text-rose-400" size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(251, 113, 133, 0.3), transparent 50%), radial-gradient(circle at 80% 50%, rgba(253, 164, 175, 0.3), transparent 50%), linear-gradient(135deg, #fff5f7 0%, #ffe4e6 50%, #fecdd3 100%)",
            "radial-gradient(circle at 80% 50%, rgba(251, 113, 133, 0.3), transparent 50%), radial-gradient(circle at 20% 50%, rgba(253, 164, 175, 0.3), transparent 50%), linear-gradient(135deg, #ffe4e6 0%, #fff5f7 50%, #fecdd3 100%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 20, -20, 0],
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            <Heart size={12 + Math.random() * 30} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Main content card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl sm:rounded-[3rem] shadow-[0_20px_60px_rgba(251,113,133,0.3)] border border-white/60 overflow-hidden">
          
          {/* Decorative top pattern */}
          <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-red-400" />
          
          <div className="p-6 sm:p-10 md:p-16 text-center space-y-6 sm:space-y-8">
            
            {/* Animated rings icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative inline-block"
            >
              {/* Glow effect behind rings */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 blur-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-rose-300 rounded-full"
              />
              
              {/* Two interlocking rings SVG - Responsive size */}
              <svg
                width="100"
                height="100"
                viewBox="0 0 120 120"
                className="relative drop-shadow-xl sm:w-[120px] sm:h-[120px]"
              >
                {/* Left ring */}
                <motion.circle
                  cx="45"
                  cy="60"
                  r="25"
                  fill="none"
                  stroke="url(#goldGradient)"
                  strokeWidth="8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                
                {/* Right ring */}
                <motion.circle
                  cx="75"
                  cy="60"
                  r="25"
                  fill="none"
                  stroke="url(#goldGradient)"
                  strokeWidth="8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
                
                {/* Sparkles */}
                <motion.g
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <circle cx="35" cy="45" r="2" fill="#FFD700" />
                  <circle cx="85" cy="45" r="2" fill="#FFD700" />
                  <circle cx="60" cy="35" r="3" fill="#FFD700" />
                  <circle cx="60" cy="85" r="2" fill="#FFD700" />
                </motion.g>
                
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFF4D0" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Rotating sparkle ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-50px) scale(0.8)`,
                    }}
                    
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Main headline */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif italic">
                    <span className="text-slate-800">She Said </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-500"
                    >
                      YES!
                    </motion.span>
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="inline-block ml-1 sm:ml-2"
                    >
                      💍
                    </motion.span>
                  </h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-slate-500 text-base sm:text-lg"
                  >
                    A new chapter begins...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Names with heart - MOBILE OPTIMIZED */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative px-2"
                >
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 px-4 sm:px-8 md:px-10 py-4 sm:py-6 rounded-2xl sm:rounded-3xl border-2 border-rose-200/50 shadow-lg max-w-full">
                    <span className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-700 break-words text-center">
                      {proposal.fromName}
                    </span>
                    
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="flex-shrink-0"
                    >
                      <Heart size={24} className="text-rose-500 sm:w-7 sm:h-7" fill="#fb7185" />
                    </motion.div>
                    
                    <span className="text-xl sm:text-2xl md:text-3xl font-serif text-slate-700 break-words text-center">
                      {proposal.toName}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quote */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="max-w-md mx-auto px-2"
                >
                  <div className="relative">
                    <div className="absolute -top-4 sm:-top-6 -left-2 sm:-left-4 text-4xl sm:text-6xl text-rose-200 font-serif">"</div>
                    <p className="text-lg sm:text-xl font-serif italic text-slate-600 leading-relaxed px-6 sm:px-8">
                      Two souls, one promise, forever begins today.
                    </p>
                    <div className="absolute -bottom-4 sm:-bottom-6 -right-2 sm:-right-4 text-4xl sm:text-6xl text-rose-200 font-serif">"</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col gap-3 sm:gap-4 pt-4"
                >
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                    <span>Share this moment 💌</span>
                  </motion.button>

                  <button
                    onClick={() => router.push("/proposal/create")} 
                    className="text-slate-500 hover:text-rose-500 transition-colors text-sm py-2 flex items-center justify-center gap-2"
                  >
                    <Send size={14} className="sm:w-4 sm:h-4" />
                    <span>Send your own proposal</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex justify-center gap-1.5 sm:gap-2 pt-4"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                >
                  <Sparkles size={14} className="text-rose-300 sm:w-4 sm:h-4" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Decorative bottom pattern */}
          <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-red-400" />
        </div>

        {/* Floating glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute inset-0 -z-10 blur-3xl bg-gradient-to-br from-rose-300 via-pink-300 to-red-300 rounded-3xl sm:rounded-[3rem]"
        />
      </motion.div>
    </div>
  );
}