"use client";
import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Heart, CheckCircle2, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ROSES = [
  { id: 1, name: "Crimson Desire", color: "#e63946", shadow: "shadow-red-500/30", msg: "My love for you is deep, passionate, and grows stronger every day.", gradient: "from-red-500/20 to-rose-500/20" },
  { id: 2, name: "Blush Grace", color: "#ff85a1", shadow: "shadow-pink-500/30", msg: "You bring a gentleness and beauty to my life that I treasure above all.", gradient: "from-pink-400/20 to-rose-400/20" },
  { id: 3, name: "Pure Serenity", color: "#f8f9fa", shadow: "shadow-slate-400/30", msg: "In you, I have found a peace and purity that feels like home.", gradient: "from-slate-200/20 to-zinc-200/20" },
  { id: 4, name: "Golden Joy", color: "#ffb703", shadow: "shadow-amber-500/30", msg: "You are the sunlight in my darkest days and my favorite reason to smile.", gradient: "from-amber-400/20 to-yellow-400/20" },
  { id: 5, name: "Royal Mystery", color: "#7209b7", shadow: "shadow-purple-500/30", msg: "Every day with you is a new chapter of enchantment I never want to end.", gradient: "from-purple-500/20 to-violet-500/20" },
];

export default function RosePickerPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRose = ROSES.find(r => r.id === selectedId);

  const createInviteLink = async () => {
    if (!selectedId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-sessions?roseFromA=${selectedId}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create invite");
      }

      const data = await res.json();

      const link = `${window.location.origin}/games/day1/rose-picker/invite/${data.id}`;

      setInviteLink(link);

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 text-slate-900 flex flex-col items-center p-4 md:p-6 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-radial from-rose-200/30 via-transparent to-transparent rounded-full blur-3xl"
        />
        <m.div 
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-radial from-pink-200/30 via-transparent to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating petals */}
        {[...Array(6)].map((_, i) => (
          <m.div
            key={i}
            initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0, opacity: 0 }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000, 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              rotate: 360,
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute text-4xl"
          >
            🌸
          </m.div>
        ))}
      </div>

      {/* HEADER */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 md:mb-16 z-10 relative">
        <m.button 
          onClick={() => router.back()}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 md:p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-rose-200/50 text-slate-600 hover:text-rose-600 transition-colors border border-white/50"
        >
          <ArrowLeft size={22} />
        </m.button>
        
        <m.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-red-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Secret Garden
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Of Eternal Devotion
          </p>
        </m.div>
        
        <div className="w-12 md:w-16" />
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center z-10 relative">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <m.div 
              key="picker"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="text-center w-full"
            >
              <m.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-12"
              >
                <m.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block"
                >
                  <Sparkles className="text-rose-400 mx-auto mb-6" size={40} strokeWidth={1.5} />
                </m.div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Choose Your Rose
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-md mx-auto leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Listen to your heart's whisper. <br className="hidden md:block" />
                  Which bloom speaks to your soul?
                </p>
              </m.div>

              <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 mt-12 md:mt-16 px-4">
                {ROSES.map((rose, index) => (
                  <m.div
                    key={rose.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
                    className="relative"
                  >
                    <m.button
                      whileHover={{ scale: 1.12, y: -12 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setHoveredId(rose.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      onClick={() => {
                        setSelectedId(rose.id);
                        setTimeout(() => setIsRevealed(true), 600);
                      }}
                      className={`relative group w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-[2rem] bg-white/90 backdrop-blur-sm shadow-2xl ${rose.shadow} flex flex-col items-center justify-center transition-all duration-300 border-2 hover:border-rose-300`}
                      style={{ borderColor: hoveredId === rose.id ? rose.color : 'transparent' }}
                    >
                      {/* Glow effect */}
                      <div 
                        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${rose.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                      
                      <m.span 
                        animate={hoveredId === rose.id ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-6xl lg:text-7xl relative z-10 drop-shadow-lg"
                      >
                        🌹
                      </m.span>
                      
                      {/* Color indicator */}
                      <m.div 
                        animate={hoveredId === rose.id ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.5, repeat: hoveredId === rose.id ? Infinity : 0 }}
                        className="absolute -bottom-2 w-3 h-3 rounded-full shadow-lg" 
                        style={{ backgroundColor: rose.color }} 
                      />
                      
                      {/* Name tag on hover */}
                      <AnimatePresence>
                        {hoveredId === rose.id && (
                          <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-medium"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {rose.name}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </m.button>
                  </m.div>
                ))}
              </div>
            </m.div>
          ) : (
            <m.div 
              key="reveal"
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 shadow-2xl border-2 border-rose-100 text-center relative overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-rose-200/50 rounded-tl-[3rem]" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-rose-200/50 rounded-br-[3rem]" />
              
              {/* Rose bloom animation */}
              <m.div 
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.5 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-8 flex items-center justify-center text-7xl md:text-8xl shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: `${selectedRose?.color}10` }}
              >
                <m.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br opacity-30"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${selectedRose?.color}40 0%, transparent 100%)`
                  }}
                />
                <span className="relative z-10">🌹</span>
              </m.div>

              <m.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm md:text-base font-black uppercase tracking-[0.4em] mb-3"
                style={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  color: selectedRose?.color
                }}
              >
                {selectedRose?.name}
              </m.h3>
              
              {/* Decorative line */}
              <m.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="w-24 h-[2px] mx-auto mb-8"
                style={{ backgroundColor: selectedRose?.color }}
              />
              
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <p 
                  className="text-xl md:text-2xl lg:text-3xl text-slate-800 leading-relaxed mb-12 px-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
                >
                  "{selectedRose?.msg}"
                </p>
              </m.div>

              <m.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col md:flex-row gap-4 mt-8"
              >
                <m.button 
                  whileHover={{ scale: 1.02, boxShadow: `0 20px 40px ${selectedRose?.id === 3 ? '#64748b' : selectedRose?.color}40` }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: selectedRose?.id === 3 ? '#64748b' : selectedRose?.color,
                    color: 'white',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                  onClick={createInviteLink}
                  disabled={loading}
                >
                  <CheckCircle2 size={20} strokeWidth={2.5} /> 
                  <span>{loading ? "Creating link..." : "Send This Rose"}</span>
                </m.button>
                
                <m.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  onClick={() => {
                    setIsRevealed(false);
                    setSelectedId(null);
                  }}
                >
                  <RotateCcw size={20} strokeWidth={2.5} /> 
                  <span>Choose Again</span>
                </m.button>
              </m.div>

              {/* Invite Link Display */}
              {inviteLink && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-left"
                >
                  <p className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <Heart size={16} fill="currentColor" />
                    💌 Send this link to your partner
                  </p>

                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={inviteLink}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-rose-200 text-sm bg-white focus:outline-none focus:border-rose-400 transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                    <m.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(inviteLink);
                        // Optional: Add a toast notification here
                      }}
                      className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Copy
                    </m.button>
                  </div>
                </m.div>
              )}

              {/* Error Display */}
              {error && (
                <m.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-red-600 font-medium text-center"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {error}
                </m.p>
              )}

              {/* Sparkle animations */}
              <m.div 
                animate={{ 
                  rotate: [0, 20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-6 -right-6 text-amber-400"
              >
                <Sparkles size={48} strokeWidth={1.5} />
              </m.div>
              
              <m.div 
                animate={{ 
                  rotate: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 text-rose-400"
              >
                <Sparkles size={40} strokeWidth={1.5} />
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* DECOR - Elegant heart backdrop */}
      <div className="absolute top-10 right-10 opacity-5 pointer-events-none hidden lg:block">
        <m.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Heart size={280} className="text-rose-500 fill-rose-500" strokeWidth={0.5} />
        </m.div>
      </div>
      
      <div className="absolute bottom-10 left-10 opacity-5 pointer-events-none hidden lg:block">
        <m.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Heart size={180} className="text-pink-500 fill-pink-500" strokeWidth={0.5} />
        </m.div>
      </div>

      {/* Add custom fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}