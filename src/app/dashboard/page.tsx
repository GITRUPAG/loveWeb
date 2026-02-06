"use client";
import React, { useState, useEffect } from 'react';
import { 
  Lock, Heart, Sparkles, Star, Send, Crown, 
  ChevronRight, Flower2, PlayCircle,
  Gift, Handshake, Moon, Music, Smile, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// 📅 THE 8-DAY VALENTINE SCHEDULE WITH ACTUAL DATES
const VALENTINE_DAYS = [
  { id: 1, date: "Feb 07", actualDate: new Date(2026, 1, 7, 0, 0, 0), title: "Rose Day", subtitle: "Where our story began to bloom", icon: <Flower2 size={22} />, color: "#e63946", premium: false },
  { id: 2, date: "Feb 08", actualDate: new Date(2026, 1, 8, 0, 0, 0), title: "Propose Day", subtitle: "A digital promise of forever", icon: <Send size={22} />, color: "#ff4d6d", premium: false },
  { id: 3, date: "Feb 09", actualDate: new Date(2026, 1, 9, 0, 0, 0), title: "Chocolate Day", subtitle: "Sweet moments we've shared", icon: <Gift size={22} />, color: "#7f4f24", premium: false},
  { id: 4, date: "Feb 10", actualDate: new Date(2026, 1, 10, 0, 0, 0), title: "Teddy Day", subtitle: "Virtual hugs and soft words", icon: <Smile size={22} />, color: "#fb8500", premium: false },
  { id: 5, date: "Feb 11", actualDate: new Date(2026, 1, 11, 0, 0, 0), title: "Promise Day", subtitle: "Oaths written in the stars", icon: <Handshake size={22} />, color: "#4361ee", premium: false },
  { id: 6, date: "Feb 12", actualDate: new Date(2026, 1, 12, 0, 0, 0), title: "Hug Day", subtitle: "Wrapping you in digital warmth", icon: <Moon size={22} />, color: "#7209b7", premium: false },
  { id: 7, date: "Feb 13", actualDate: new Date(2026, 1, 13, 0, 0, 0), title: "Kiss Day", subtitle: "The magic of a tender touch", icon: <Music size={22} />, color: "#f72585", premium: false },
  { id: 8, date: "Feb 14", actualDate: new Date(2026, 1, 14, 0, 0, 0), title: "Valentine's Day", subtitle: "The ultimate cosmic celebration", icon: <Heart size={22} />, color: "#ff002b", premium: false },
];

export default function CouplePremiumUI() {
  const { role } = useAuth(); // Assuming roles: "GUEST", "SOLO_LOGGED_IN", "COUPLE_PREMIUM"
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute to check for unlocks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // 🛠️ TIME-BASED ACCESS LOGIC
  const checkAccessibility = (day: typeof VALENTINE_DAYS[0]) => {
    // Premium users get all days unlocked
    if (role === "COUPLE_PREMIUM") return { accessible: true, reason: "premium" };
    
    // Check if the day's unlock time (12 AM) has passed
    const dayUnlockTime = day.actualDate;
    const isUnlocked = currentTime >= dayUnlockTime;
    
    if (isUnlocked) {
      return { accessible: true, reason: "unlocked" };
    }
    
    return { accessible: false, reason: "locked", unlockTime: dayUnlockTime };
  };

  // Calculate time remaining until unlock
  const getTimeUntilUnlock = (unlockTime: Date) => {
    const diff = unlockTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleNavigation = (id: number) => {
    router.push(`/games/day${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-800 pb-44 overflow-x-hidden relative">
      
      {/* 🌌 DYNAMIC BACKGROUND GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/40 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-200/30 blur-[100px] rounded-full" 
        />
      </div>

      {/* 🎈 FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ y: "110vh", x: Math.random() * 300, opacity: 0 }} 
            animate={{ y: "-10vh", opacity: [0, 0.4, 0] }} 
            transition={{ duration: 12 + i, repeat: Infinity, delay: i * 2 }} 
            className="absolute text-rose-300/40"
          >
            <Heart fill="currentColor" size={15 + i * 5} />
          </motion.div>
        ))}
      </div>

      {/* 🏷️ HEADER SECTION */}
      <header className="pt-16 px-8 mb-10 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
          <div className="bg-white/60 backdrop-blur-md border border-rose-100 px-4 py-1 rounded-full flex items-center gap-2 mb-4 shadow-sm">
            <Crown size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black tracking-[0.2em] text-rose-400 uppercase">
               {role === "COUPLE_PREMIUM" ? "Premium Access Active" : "8 Days of Devotion"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
            Forever <span className="font-serif italic text-rose-500 underline decoration-rose-200 underline-offset-8">Together</span>
          </h1>
          
          {/* Current Date Display */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-rose-100 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-600">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </motion.div>
        </motion.div>
      </header>

      {/* 🃏 VALENTINE WEEK FEED */}
      <div className="px-6 space-y-4 max-w-lg mx-auto">
        {VALENTINE_DAYS.map((day) => {
          const accessInfo = checkAccessibility(day);
          const timeUntilUnlock = !accessInfo.accessible && accessInfo.unlockTime 
            ? getTimeUntilUnlock(accessInfo.unlockTime) 
            : null;

          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => accessInfo.accessible && handleNavigation(day.id)}
              className={`group relative p-[1px] rounded-[2rem] transition-all duration-300 ${
                accessInfo.accessible 
                ? 'bg-white shadow-xl shadow-rose-200/20 cursor-pointer active:scale-95' 
                : 'bg-slate-200/50 grayscale opacity-70'
              }`}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-[1.9rem] p-5 flex items-center justify-between border border-white">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative"
                    style={{ 
                      backgroundColor: accessInfo.accessible ? `${day.color}15` : '#f1f5f9',
                      color: accessInfo.accessible ? day.color : '#94a3b8'
                    }}
                  >
                    {accessInfo.accessible ? (
                      day.icon
                    ) : (
                      <div className="relative">
                        <Lock size={20} />
                        {timeUntilUnlock && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full border-2 border-white"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{day.date}</span>
                      {!accessInfo.accessible && (
                        <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1">
                          <Clock size={10} />
                          {timeUntilUnlock || 'Locked'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{day.title}</h3>
                    
                    {accessInfo.accessible ? (
                      <p className="text-xs text-slate-400 font-medium">{day.subtitle}</p>
                    ) : (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-slate-400 font-medium italic flex items-center gap-1.5"
                      >
                        <Sparkles size={12} className="text-rose-400" />
                        Stay tuned! Exciting surprises on the way
                      </motion.p>
                    )}
                    
                    {/* Countdown for locked days */}
                    {!accessInfo.accessible && timeUntilUnlock && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 px-3 py-1 bg-gradient-to-r from-rose-50 to-purple-50 rounded-full inline-block"
                      >
                        <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1.5">
                          <Clock size={10} />
                          Unlocks in {timeUntilUnlock}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {accessInfo.accessible && (
                  <div className="w-9 h-9 rounded-full border border-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>

              {/* Shimmer effect for locked but soon-to-unlock days */}
              {!accessInfo.accessible && timeUntilUnlock && (
                <motion.div
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${day.color}15, transparent)`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${day.color}30, transparent)`,
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 🚀 SMART FLOATING ACTION FOOTER */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl p-2 pl-6 rounded-[3rem] shadow-2xl border border-white/10 flex items-center justify-between"
        >
          {role === "GUEST" ? (
            <>
              <div className="flex flex-col flex-1">
                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Limited Access</span>
                <span className="text-white text-sm font-bold">Start Rose Day</span>
              </div>
              <button 
                onClick={() => {
                  const roseDay = VALENTINE_DAYS[0];
                  const access = checkAccessibility(roseDay);
                  if (access.accessible) {
                    handleNavigation(1);
                  }
                }} 
                className="bg-rose-500 text-white h-12 w-12 rounded-full font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-transform"
                disabled={!checkAccessibility(VALENTINE_DAYS[0]).accessible}
              >
                <PlayCircle size={20} />
              </button>
            </>
          ) : role === "SOLO_LOGGED_IN" ? (
            <>
              <div className="flex flex-col">
                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Ready to Connect?</span>
                <span className="text-white text-sm font-bold">Upgrade for Partner</span>
              </div>
              <button className="bg-rose-500 text-white h-12 px-8 rounded-full font-bold shadow-xl flex items-center gap-2 active:scale-95 transition-transform text-sm">
                Unlock All <Send size={16} />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center py-3 text-white gap-3">
              <Sparkles className="text-amber-400" size={18} />
              <span className="font-bold tracking-widest text-[10px] uppercase">All Days Unlocked — Happy Valentine's!</span>
              <Sparkles className="text-amber-400" size={18} />
            </div>
          )}
        </motion.div>
      </div>

      {/* 🎊 UNLOCK NOTIFICATION TOAST (Optional - shows when a new day unlocks) */}
      <AnimatePresence>
        {(() => {
          const justUnlocked = VALENTINE_DAYS.find(day => {
            const timeSinceUnlock = currentTime.getTime() - day.actualDate.getTime();
            return timeSinceUnlock > 0 && timeSinceUnlock < 300000; // Within 5 minutes of unlock
          });

          if (justUnlocked && role !== "COUPLE_PREMIUM") {
            return (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-8 left-0 right-0 px-6 z-50 pointer-events-none"
              >
                <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border-2 border-rose-200">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${justUnlocked.color}15`, color: justUnlocked.color }}
                    >
                      {justUnlocked.icon}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{justUnlocked.title} Unlocked! 🎉</p>
                      <p className="text-xs text-slate-500">{justUnlocked.subtitle}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }
          return null;
        })()}
      </AnimatePresence>
    </div>
  );
}