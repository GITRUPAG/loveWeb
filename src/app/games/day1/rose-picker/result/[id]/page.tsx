"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RotateCcw, Share2, Copy, Send, Loader2 } from "lucide-react";

const ROSES = [
  { 
    id: 1, 
    name: "Crimson Desire", 
    color: "#e63946", 
    gradient: "from-red-500 to-rose-600",
    msg: "My love for you is deep, passionate, and grows stronger every day."
  },
  { 
    id: 2, 
    name: "Blush Grace", 
    color: "#ff85a1", 
    gradient: "from-pink-400 to-rose-400",
    msg: "You bring a gentleness and beauty to my life that I treasure above all."
  },
  { 
    id: 3, 
    name: "Pure Serenity", 
    color: "#94a3b8", 
    gradient: "from-slate-300 to-zinc-400",
    msg: "In you, I have found a peace and purity that feels like home."
  },
  { 
    id: 4, 
    name: "Golden Joy", 
    color: "#ffb703", 
    gradient: "from-amber-400 to-yellow-500",
    msg: "You are the sunlight in my darkest days and my favorite reason to smile."
  },
  { 
    id: 5, 
    name: "Royal Mystery", 
    color: "#7209b7", 
    gradient: "from-purple-500 to-violet-600",
    msg: "Every day with you is a new chapter of enchantment I never want to end."
  },
];

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-sessions/${id}`
        );
        const data = await res.json();

        if (!data.roseFromB) {
          router.replace(`/games/day1/rose-picker/invite/${id}`);
          return;
        }

        setSession(data);
        setShareLink(`${window.location.origin}/games/day1/rose-picker/result/${id}`);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();
  }, [id, router]);

  const roseA = ROSES.find((r) => r.id === session?.roseFromA);
  const roseB = ROSES.find((r) => r.id === session?.roseFromB);

  const shareText = `💖 Two Roses, One Story 🌹\n\nI chose "${roseA?.name}"\nThey chose "${roseB?.name}"\n\nSee our love moment here 👇`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Two Roses, One Story 🌹",
          text: shareText,
          url: shareLink,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleWhatsAppShare = () => {
    // Fixed: Combine text and link, then encode properly
    const message = `${shareText}\n\n${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = () => {
    // Fixed: Copy the full message with emojis and link
    const fullMessage = `${shareText}\n\n${shareLink}`;
    navigator.clipboard.writeText(fullMessage);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={48} className="text-rose-500" />
        </motion.div>
        <p className="mt-4 text-slate-500 font-medium">Revealing your story...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 text-slate-900 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Floating Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 1000, opacity: 0 }}
            animate={{ 
              y: 1200, 
              x: (Math.random() * 1000) - 200, 
              opacity: [0, 0.4, 0],
              rotate: 360 
            }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-3xl"
          >
            🌸
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/50 text-center z-10 relative"
      >
        <header className="mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mb-4 inline-block"
          >
            <Sparkles className="text-amber-400" size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Two Roses, One Story
          </h1>
          <p className="text-rose-500 font-bold tracking-widest uppercase text-xs md:text-sm">A Perfect Match Captured</p>
        </header>

        {/* Roses Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-16 relative">
          <RoseResultCard rose={roseA} label="Their Gift" delay={0.3} />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="flex flex-col items-center justify-center py-4"
          >
            <div className="relative">
               <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-rose-400 blur-3xl rounded-full"
              />
              <Heart size={64} className="text-rose-500 fill-rose-500 relative z-10 drop-shadow-2xl" />
            </div>
          </motion.div>

          <RoseResultCard rose={roseB} label="Your Return" delay={0.5} />
        </div>

        {/* Share Section */}
        <div className="max-w-md mx-auto space-y-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNativeShare}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-rose-200 flex items-center justify-center gap-3"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Share2 size={20} />
            Share Our Moment
          </motion.button>

          <div className="flex gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:brightness-105 transition-all"
            >
              <Send size={18} fill="currentColor" />
              WhatsApp
            </button>

            <button
              onClick={handleCopyLink}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 relative overflow-hidden transition-all hover:bg-slate-50"
            >
              <AnimatePresence mode="wait">
                {copySuccess ? (
                  <motion.span key="success" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="text-rose-500 flex items-center gap-2">
                    Copied! 💖
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                    <Copy size={18} />
                    Copy Link
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => router.push("/games/day1/rose-picker")}
          className="text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-2 mx-auto transition-colors group"
        >
          <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Start a new journey
        </button>
      </motion.div>

      {/* Global Style for Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@400;600;700;800&display=swap');
      `}</style>
    </div>
  );
}

function RoseResultCard({ rose, label, delay }: { rose: any; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className="bg-white/40 p-6 md:p-8 rounded-[2rem] border border-white/60 shadow-inner flex flex-col items-center"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-6">{label}</span>
      
      <motion.div 
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-7xl md:text-8xl mb-6 drop-shadow-2xl"
      >
        🌹
      </motion.div>

      <h3 
        className="text-xl font-extrabold mb-3" 
        style={{ color: rose?.color, fontFamily: "'Montserrat', sans-serif" }}
      >
        {rose?.name}
      </h3>
      
      <p 
        className="text-slate-600 italic text-sm md:text-base leading-relaxed max-w-[200px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        "{rose?.msg}"
      </p>
    </motion.div>
  );
}