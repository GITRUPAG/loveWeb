"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const ROSES = [
  { 
    id: 1, 
    name: "Crimson Desire", 
    color: "#e63946", 
    shadow: "shadow-red-500/30",
    gradient: "from-red-500/20 to-rose-500/20",
    msg: "My love for you is deep, passionate, and grows stronger every day."
  },
  { 
    id: 2, 
    name: "Blush Grace", 
    color: "#ff85a1", 
    shadow: "shadow-pink-500/30",
    gradient: "from-pink-400/20 to-rose-400/20",
    msg: "You bring a gentleness and beauty to my life that I treasure above all."
  },
  { 
    id: 3, 
    name: "Pure Serenity", 
    color: "#f8f9fa", 
    shadow: "shadow-slate-400/30",
    gradient: "from-slate-200/20 to-zinc-200/20",
    msg: "In you, I have found a peace and purity that feels like home."
  },
  { 
    id: 4, 
    name: "Golden Joy", 
    color: "#ffb703", 
    shadow: "shadow-amber-500/30",
    gradient: "from-amber-400/20 to-yellow-400/20",
    msg: "You are the sunlight in my darkest days and my favorite reason to smile."
  },
  { 
    id: 5, 
    name: "Royal Mystery", 
    color: "#7209b7", 
    shadow: "shadow-purple-500/30",
    gradient: "from-purple-500/20 to-violet-500/20",
    msg: "Every day with you is a new chapter of enchantment I never want to end."
  },
];

export default function InvitePage() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ CRITICAL: Mount guard to prevent SSR issues
  const [mounted, setMounted] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // ✅ FIX: Client-side only animation state
  const [petals, setPetals] = useState<{x: number; y: number; d: number}[]>([]);

  // ✅ Mount guard effect - MUST BE FIRST
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Initialize floating petals on client only
  useEffect(() => {
    if (!mounted) return;
    
    const w = window.innerWidth;
    const h = window.innerHeight;

    setPetals(
      Array.from({ length: 6 }).map(() => ({
        x: Math.random() * w,
        y: h + 120,
        d: 15 + Math.random() * 10
      }))
    );
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const fetchSession = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-sessions/${id}`
      );

      const data = await res.json();

      if (data.roseFromB) {
        router.replace(`/games/day1/rose-picker/result/${id}`);
        return;
      }

      setSession(data);
      setLoading(false);
    };

    fetchSession();
  }, [id, router, mounted]);

  const submitResponse = async () => {
    if (!selectedId) return;

    setSubmitting(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-sessions/${id}?roseFromB=${selectedId}`,
      { method: "PUT" }
    );

    router.push(`/games/day1/rose-picker/result/${id}`);
  };

  // ✅ CRITICAL: Prevent SSR rendering
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-rose-500" />
        </motion.div>
        <p className="mt-4 text-slate-600 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Loading your invitation...
        </p>
      </div>
    );
  }

  const roseFromA = ROSES.find(r => r.id === session.roseFromA);
  const selectedRose = ROSES.find(r => r.id === selectedId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 text-slate-900 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-radial from-rose-200/30 via-transparent to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-radial from-pink-200/30 via-transparent to-transparent rounded-full blur-3xl"
        />
        
        {/* Floating petals - ✅ FIXED: Client-only rendering */}
        {petals.map((petal, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: petal.x, rotate: 0, opacity: 0 }}
            animate={{ 
              y: petal.y, 
              x: petal.x - 150,
              rotate: 360,
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: petal.d, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute text-4xl"
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border-2 border-rose-100 text-center relative overflow-hidden z-10"
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-rose-200/50 rounded-tl-[3rem]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-rose-200/50 rounded-br-[3rem]" />

        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <Heart size={56} className="text-rose-500 fill-rose-500 mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Someone Chose a Rose<br />Just for You 🌹
          </h1>
        </motion.div>

        {/* Rose from User A Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 flex items-center justify-center text-7xl md:text-8xl shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: `${roseFromA?.color}15` }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-br opacity-30"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${roseFromA?.color}40 0%, transparent 100%)`
              }}
            />
            <span className="relative z-10">🌹</span>
          </div>

          <h2 
            className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] mb-4"
            style={{ 
              fontFamily: "'Montserrat', sans-serif",
              color: roseFromA?.color
            }}
          >
            {roseFromA?.name}
          </h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-24 h-[2px] mx-auto mb-6"
            style={{ backgroundColor: roseFromA?.color }}
          />

          <p 
            className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-xl mx-auto px-4"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
          >
            "{roseFromA?.msg}"
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="text-amber-400" size={24} />
            </motion.div>
            <p className="text-lg md:text-xl font-semibold text-slate-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Now, choose a rose for them 💖
            </p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles className="text-rose-400" size={24} />
            </motion.div>
          </div>
        </motion.div>

        {/* Rose Selection Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
          {ROSES.map((rose, index) => (
            <motion.div
              key={rose.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
            >
              <motion.button
                whileHover={{ scale: 1.15, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredId(rose.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => setSelectedId(rose.id)}
                className={`relative group w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl ${rose.shadow} flex flex-col items-center justify-center transition-all duration-300 border-2`}
                style={{ 
                  borderColor: selectedId === rose.id ? rose.color : (hoveredId === rose.id ? rose.color : 'transparent'),
                  backgroundColor: selectedId === rose.id ? `${rose.color}20` : 'white'
                }}
              >
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${rose.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                
                <motion.span 
                  animate={hoveredId === rose.id || selectedId === rose.id ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl relative z-10 drop-shadow-lg"
                >
                  🌹
                </motion.span>

                {/* Selected indicator */}
                {selectedId === rose.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg"
                  >
                    <Heart size={14} className="text-white fill-white" />
                  </motion.div>
                )}

                {/* Color indicator */}
                <div 
                  className="absolute -bottom-1 w-2.5 h-2.5 rounded-full shadow-lg" 
                  style={{ backgroundColor: rose.color }} 
                />

                {/* Name tooltip */}
                <AnimatePresence>
                  {hoveredId === rose.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {rose.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Selected Rose Preview */}
        <AnimatePresence mode="wait">
          {selectedRose && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-200">
                <p className="text-sm font-bold text-slate-600 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Your Choice:
                </p>
                <p 
                  className="text-lg font-black uppercase tracking-wide mb-3"
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif",
                    color: selectedRose.color
                  }}
                >
                  {selectedRose.name}
                </p>
                <p className="text-sm text-slate-600 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "{selectedRose.msg}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: selectedId && !submitting ? 1.03 : 1 }}
          whileTap={{ scale: selectedId && !submitting ? 0.98 : 1 }}
          onClick={submitResponse}
          disabled={!selectedId || submitting}
          className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-rose-300"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {submitting ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span>Sending Your Rose...</span>
            </>
          ) : (
            <>
              <Heart size={22} fill="white" />
              <span>Send Rose Back</span>
              <ArrowRight size={22} />
            </>
          )}
        </motion.button>

        {/* Sparkle decorations */}
        <motion.div 
          animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-6 -right-6 text-amber-400"
        >
          <Sparkles size={48} strokeWidth={1.5} />
        </motion.div>
        
        <motion.div 
          animate={{ rotate: [0, -20, 0], scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          className="absolute -bottom-6 -left-6 text-rose-400"
        >
          <Sparkles size={40} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Custom Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}