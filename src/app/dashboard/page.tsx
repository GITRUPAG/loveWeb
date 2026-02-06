"use client";
import React from 'react';
import { 
  Lock, Heart, Sparkles, Star, Send, Crown, 
  ChevronRight, Flower2, LogIn, PlayCircle,
  Gift, Handshake, Moon, Music, Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// 📅 THE 8-DAY VALENTINE SCHEDULE
const VALENTINE_DAYS = [
  { id: 1, date: "Feb 07", title: "Rose Day", subtitle: "Where our story began to bloom", icon: <Flower2 size={22} />, color: "#e63946", premium: false },
  { id: 2, date: "Feb 08", title: "Propose Day", subtitle: "A digital promise of forever", icon: <Send size={22} />, color: "#ff4d6d", premium: false },
  { id: 3, date: "Feb 09", title: "Chocolate Day", subtitle: "Sweet moments we've shared", icon: <Gift size={22} />, color: "#7f4f24", premium: false},
  { id: 4, date: "Feb 10", title: "Teddy Day", subtitle: "Virtual hugs and soft words", icon: <Smile size={22} />, color: "#fb8500", premium: false },
  { id: 5, date: "Feb 11", title: "Promise Day", subtitle: "Oaths written in the stars", icon: <Handshake size={22} />, color: "#4361ee", premium: false },
  { id: 6, date: "Feb 12", title: "Hug Day", subtitle: "Wrapping you in digital warmth", icon: <Moon size={22} />, color: "#7209b7", premium: false },
  { id: 7, date: "Feb 13", title: "Kiss Day", subtitle: "The magic of a tender touch", icon: <Music size={22} />, color: "#f72585", premium: false },
  { id: 8, date: "Feb 14", title: "Valentine's Day", subtitle: "The ultimate cosmic celebration", icon: <Heart size={22} />, color: "#ff002b", premium: false },
];

export default function CouplePremiumUI() {
  const { role } = useAuth(); // Assuming roles: "GUEST", "SOLO_LOGGED_IN", "COUPLE_PREMIUM"
  const router = useRouter();

  // 🛠️ ACCESS LOGIC
  // A day is accessible if:
  // 1. User is PREMIUM (Unlock all)
  // 2. OR it's Rose Day (Day 1) and user is a Guest/Logged In
  const checkAccessibility = (day: typeof VALENTINE_DAYS[0]) => {
    if (role === "COUPLE_PREMIUM") return true;
    if (!day.premium) return true;
    return false;
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
        </motion.div>
      </header>

      {/* 🃏 VALENTINE WEEK FEED */}
      <div className="px-6 space-y-4 max-w-lg mx-auto">
        {VALENTINE_DAYS.map((day) => {
          const isAccessible = checkAccessibility(day);

          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => isAccessible && handleNavigation(day.id)}
              className={`group relative p-[1px] rounded-[2rem] transition-all duration-300 ${
                isAccessible 
                ? 'bg-white shadow-xl shadow-rose-200/20 cursor-pointer active:scale-95' 
                : 'bg-slate-200/50 grayscale opacity-70 pointer-events-none'
              }`}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-[1.9rem] p-5 flex items-center justify-between border border-white">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ 
                      backgroundColor: isAccessible ? `${day.color}15` : '#f1f5f9',
                      color: isAccessible ? day.color : '#94a3b8'
                    }}
                  >
                    {isAccessible ? day.icon : <Lock size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{day.date}</span>
                      {day.premium && role !== "COUPLE_PREMIUM" && (
                        <span className="text-[8px] bg-rose-100 text-rose-500 px-1.5 py-0.5 rounded font-black uppercase">Premium</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{day.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{day.subtitle}</p>
                  </div>
                </div>

                {isAccessible && (
                  <div className="w-9 h-9 rounded-full border border-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                )}
              </div>
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
              <div className="flex flex-col">
                <span className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Limited Access</span>
                <span className="text-white text-sm font-bold">Start Rose Day</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleNavigation(1)} className="bg-rose-500 text-white h-12 w-12 rounded-full font-bold flex items-center justify-center">
                  <PlayCircle size={20} />
                </button>
                <button onClick={() => router.push('/auth')} className="bg-white text-black h-12 px-5 rounded-full font-bold text-xs flex items-center gap-2">
                   <LogIn size={16} /> Login
                </button>
              </div>
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
    </div>
  );
}