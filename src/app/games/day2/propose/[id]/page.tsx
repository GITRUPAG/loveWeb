"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";

export default function ProposalViewPage() {
  const { id } = useParams<{ id: string }>();

  const [proposal, setProposal] = useState<any>(null);
  const [boxOpened, setBoxOpened] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showBlast, setShowBlast] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals/${id}`)
      .then((res) => res.json())
      .then(setProposal);
  }, [id]);

  const handleBoxClick = () => {
    setBoxOpened(true);
    
    // Celebration confetti when box opens
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ffed4e', '#fff'],
      });
    }, 600);
  };

  const sendAnswer = async (value: "YES" | "NO") => {
   await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals/share/${id}/answer?value=${value}`, {
  method: "POST"
});

    setAnswered(true);
    setResult(value);

    if (value === "YES") {
      // Trigger blast animation
      setShowBlast(true);
      
      // Epic celebration for YES
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          setShowBlast(false);
          return;
        }

        // Multiple confetti bursts from different positions
        confetti({
          particleCount: 50,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          colors: ['#ff0000', '#ff69b4', '#ffd700', '#ffffff'],
        });
        
        // Additional side bursts
        confetti({
          particleCount: 20,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#ff0000', '#ffd700'],
        });
        confetti({
          particleCount: 20,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#ff69b4', '#ffffff'],
        });
      }, 200);
      
      // Generate share link
      const link = `${window.location.origin}/games/day2/propose/result/${id}`;
      setShareLink(link);
    }
  };

  const copyShareLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-red-50" />
      
      {/* Floating hearts in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Heart size={15 + Math.random() * 25} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Blast Animation Overlay */}
        <AnimatePresence>
          {showBlast && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 pointer-events-none"
            >
              {/* Radial burst rings */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3 + i, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
              ))}
              
              {/* Sparkle particles */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * 360;
                const distance = 150 + Math.random() * 100;
                return (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      scale: 0,
                      opacity: 1 
                    }}
                    animate={{
                      x: Math.cos((angle * Math.PI) / 180) * distance,
                      y: Math.sin((angle * Math.PI) / 180) * distance,
                      scale: [0, 1.5, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: Math.random() * 0.3,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
              
              {/* Flash overlay */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Header Message */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 mb-4">
                  {proposal.fromName} has a question for you
                </h1>
                <p className="text-slate-500 text-sm">
                  Something magical awaits...
                </p>
              </motion.div>

              {!boxOpened ? (
                // Ring Box - Closed
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <motion.button
                    onClick={handleBoxClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="relative cursor-pointer group"
                  >
                    {/* Ring Box SVG */}
                    <svg
                      width="200"
                      height="200"
                      viewBox="0 0 200 200"
                      className="drop-shadow-2xl"
                    >
                      {/* Box shadow */}
                      <ellipse
                        cx="100"
                        cy="160"
                        rx="60"
                        ry="10"
                        fill="rgba(0,0,0,0.1)"
                      />
                      
                      {/* Box bottom */}
                      <rect
                        x="50"
                        y="100"
                        width="100"
                        height="60"
                        rx="5"
                        fill="url(#boxGradient)"
                        stroke="#8B0000"
                        strokeWidth="2"
                      />
                      
                      {/* Box lid */}
                      <rect
                        x="45"
                        y="85"
                        width="110"
                        height="20"
                        rx="3"
                        fill="url(#lidGradient)"
                        stroke="#8B0000"
                        strokeWidth="2"
                      />
                      
                      {/* Gold trim */}
                      <rect
                        x="45"
                        y="93"
                        width="110"
                        height="4"
                        fill="#FFD700"
                      />
                      
                      {/* Sparkles */}
                      <motion.g
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <circle cx="40" cy="70" r="2" fill="#FFD700" />
                        <circle cx="160" cy="75" r="2" fill="#FFD700" />
                        <circle cx="100" cy="65" r="3" fill="#FFD700" />
                      </motion.g>
                      
                      {/* Gradients */}
                      <defs>
                        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#DC143C" />
                          <stop offset="100%" stopColor="#8B0000" />
                        </linearGradient>
                        <linearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FF6B6B" />
                          <stop offset="100%" stopColor="#DC143C" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full blur-3xl opacity-30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{
                        background: "radial-gradient(circle, #FFD700, transparent)",
                      }}
                    />
                  </motion.button>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-rose-500 font-medium"
                  >
                    ✨ Click the box to open ✨
                  </motion.p>
                </motion.div>
              ) : (
                // Ring Box - Opened with Message
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Open Box with Ring */}
                  <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative flex justify-center"
                  >
                    <svg
                      width="300"
                      height="280"
                      viewBox="0 0 300 280"
                      className="drop-shadow-2xl"
                    >
                      {/* Box shadow */}
                      <ellipse
                        cx="150"
                        cy="240"
                        rx="80"
                        ry="15"
                        fill="rgba(0,0,0,0.15)"
                      />
                      
                      {/* Box bottom */}
                      <rect
                        x="70"
                        y="160"
                        width="160"
                        height="80"
                        rx="6"
                        fill="url(#boxGradient2)"
                        stroke="#8B0000"
                        strokeWidth="2"
                      />
                      
                      {/* Interior velvet */}
                      <rect
                        x="80"
                        y="170"
                        width="140"
                        height="60"
                        rx="4"
                        fill="#2D0A0A"
                      />
                      
                      {/* Open lid - tilted back */}
                      <motion.g
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -120 }}
                        style={{ transformOrigin: "150px 160px" }}
                      >
                        <rect
                          x="65"
                          y="135"
                          width="170"
                          height="30"
                          rx="4"
                          fill="url(#lidGradient2)"
                          stroke="#8B0000"
                          strokeWidth="2"
                        />
                        
                        {/* Inner lid velvet */}
                        <rect
                          x="75"
                          y="142"
                          width="150"
                          height="18"
                          rx="3"
                          fill="#2D0A0A"
                        />
                      </motion.g>
                      
                      {/* RING - properly sized and centered in box */}
                      <motion.g
                        initial={{ y: 30, opacity: 0, scale: 0 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        {/* Ring band base shadow */}
                        <ellipse
                          cx="150"
                          cy="205"
                          rx="18"
                          ry="3"
                          fill="rgba(0,0,0,0.2)"
                        />
                        
                        {/* Ring band */}
                        <ellipse
                          cx="150"
                          cy="200"
                          rx="22"
                          ry="28"
                          fill="none"
                          stroke="url(#goldGradient)"
                          strokeWidth="7"
                        />
                        
                        {/* Ring inner hole */}
                        <ellipse
                          cx="150"
                          cy="200"
                          rx="14"
                          ry="18"
                          fill="#2D0A0A"
                        />
                        
                        {/* Diamond setting (prong base) */}
                        <rect
                          x="145"
                          y="168"
                          width="10"
                          height="8"
                          fill="url(#goldGradient)"
                          rx="1"
                        />
                        
                        {/* Diamond */}
                        <motion.g
                          animate={{
                            scale: [1, 1.08, 1],
                            rotate: [0, 3, -3, 0],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                          }}
                        >
                          {/* Diamond main body */}
                          <polygon
                            points="150,155 162,170 150,178 138,170"
                            fill="url(#diamondGradient)"
                            stroke="#E0F4FF"
                            strokeWidth="1.5"
                          />
                          
                          {/* Diamond facets */}
                          <polygon
                            points="150,155 156,163 150,170"
                            fill="rgba(255,255,255,0.4)"
                          />
                          <polygon
                            points="150,155 144,163 150,170"
                            fill="rgba(255,255,255,0.2)"
                          />
                          
                          {/* Diamond sparkle */}
                          <circle cx="150" cy="160" r="2.5" fill="#FFFFFF" opacity="0.9" />
                          <circle cx="145" cy="166" r="1.5" fill="#FFFFFF" opacity="0.7" />
                          <circle cx="155" cy="166" r="1.5" fill="#FFFFFF" opacity="0.7" />
                        </motion.g>
                        
                        {/* Ring shine effects */}
                        <motion.circle
                          cx="135"
                          cy="195"
                          r="3"
                          fill="#FFF8DC"
                          opacity="0.7"
                          animate={{ opacity: [0.5, 0.9, 0.5] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                        <motion.circle
                          cx="165"
                          cy="200"
                          r="2.5"
                          fill="#FFF8DC"
                          opacity="0.6"
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                      </motion.g>
                      
                      {/* Radiating sparkles around diamond */}
                      <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: "150px 165px" }}
                      >
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                          <motion.circle
                            key={angle}
                            cx={150 + Math.cos((angle * Math.PI) / 180) * 50}
                            cy={165 + Math.sin((angle * Math.PI) / 180) * 50}
                            r="2.5"
                            fill="#FFD700"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: angle / 90,
                            }}
                          />
                        ))}
                      </motion.g>
                      
                      <defs>
                        <linearGradient id="boxGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#DC143C" />
                          <stop offset="100%" stopColor="#8B0000" />
                        </linearGradient>
                        <linearGradient id="lidGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#FF6B6B" />
                          <stop offset="100%" stopColor="#DC143C" />
                        </linearGradient>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFD700" />
                          <stop offset="30%" stopColor="#FFF4D0" />
                          <stop offset="60%" stopColor="#FFE66D" />
                          <stop offset="100%" stopColor="#FFD700" />
                        </linearGradient>
                        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#E3F2FF" />
                          <stop offset="30%" stopColor="#FFFFFF" />
                          <stop offset="70%" stopColor="#D4EBFF" />
                          <stop offset="100%" stopColor="#B8E6FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Proposal Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 mx-auto max-w-xl"
                  >
                    <p className="text-2xl md:text-3xl text-slate-700 font-serif italic leading-relaxed whitespace-pre-wrap mb-8">
                      {proposal.message}
                    </p>

                    {/* YES / NO Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-4 justify-center"
                    >
                      <motion.button
                        onClick={() => sendAnswer("YES")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold shadow-lg hover:shadow-2xl transition-all flex items-center gap-2"
                      >
                        <Heart fill="white" size={24} />
                        YES! 💍
                      </motion.button>

                      <motion.button
                        onClick={() => sendAnswer("NO")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-slate-400 to-slate-500 text-white text-xl font-bold shadow-lg hover:shadow-2xl transition-all"
                      >
                        Not Yet 💔
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Result Screen
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/60 text-center space-y-6"
            >
              {result === "YES" ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="inline-block"
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Heart size={50} fill="white" className="text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-5xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 mb-4">
                      She Said YES! 🎉
                    </h2>
                    <p className="text-slate-600 text-lg">
                      Congratulations! 💕 This magical moment is forever yours.
                    </p>
                    <p className="text-slate-400 text-sm mt-4">
                      The beginning of your forever starts now ✨
                    </p>
                  </motion.div>

                  {/* Share Link Section */}
                  {shareLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 space-y-4"
                    >
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                          Share this moment with {proposal.fromName}
                        </p>
                        <p className="text-green-700 text-sm break-all font-mono bg-white/60 px-4 py-3 rounded-lg mb-4">
                          {shareLink}
                        </p>
                        
                        <button
                          onClick={copyShareLink}
                          className={`
                            w-full py-3 rounded-xl font-semibold text-white text-sm
                            transition-all duration-300 flex items-center justify-center gap-2
                            ${
                              copied
                                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            }
                          `}
                        >
                          {copied ? (
                            <>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                ✓
                              </motion.div>
                              <span>Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              <span>Copy Share Link</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-xs text-center text-slate-400 italic">
                        💡 Share your response so {proposal.fromName} knows the good news!
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-block"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-xl">
                      <Heart size={50} className="text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-4xl font-serif italic text-slate-600 mb-4">
                        Different Pages, Same Book
                        </h2>
                        <p className="text-slate-500 text-lg">
                        Some hearts walk together,
                        some simply cross and leave a memory ✨
                        </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}