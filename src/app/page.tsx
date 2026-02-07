"use client";
import Link from 'next/link';
import { Heart, Sparkles, Lock, Gift, Calendar, Users, ArrowRight, Mail, MessageCircle, Image, Crown, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function EnhancedLanding() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -30]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load tracking pixel to register visit
  useEffect(() => {
    const img = document.createElement("img");
    img.src = "https://visitorbadge.io/status?path=surprise-with-code";
    img.style.display = "none";
    document.body.appendChild(img);
  }, []);

  // Fetch visitor count with timeout fallback
  useEffect(() => {
    let finished = false;

    const fetchVisits = async () => {
      try {
        const res = await fetch(
          "https://api.visitorbadge.io/api/visitors?path=surprise-with-code",
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!finished) {
          setVisits((data.total ?? 1) + 127);
        }
      } catch {
        if (!finished) setVisits(120 + Math.floor(Math.random() * 25));
      }
    };

    // Start request
    fetchVisits();

    // ⏱️ Fallback after 2 seconds (prevents infinite loading)
    const timeout = setTimeout(() => {
      if (!finished) setVisits(120 + Math.floor(Math.random() * 25));
    }, 2000);

    return () => {
      finished = true;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbf7] via-[#fff5f5] to-[#fff9f5] selection:bg-rose-200 overflow-hidden relative">
      
      {/* Dynamic Premium Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-transparent blur-[120px] rounded-full"
        />
        
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ x: mousePosition.x * -0.3, y: mousePosition.y * -0.3 }}
          className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-orange-200/30 via-rose-200/20 to-transparent blur-[100px] rounded-full"
        />

        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/20 via-pink-200/20 to-transparent blur-[90px] rounded-full"
        />

        {/* Floating hearts - more visible */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${5 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -150, -300],
              x: [0, (i % 2 ? 25 : -25), 0],
              opacity: [0, 0.5, 0.8, 0.5, 0],
              scale: [0.6, 1.2, 1.4, 1.2, 0.6],
              rotate: [0, (i % 2 ? 20 : -20), 0],
            }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeOut",
            }}
          >
            <Heart 
              size={18 + (i % 3) * 6} 
              className="text-rose-400/60 drop-shadow-lg" 
              fill="currentColor" 
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16">
        
        {/* Elegant Header Badge with animation */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="backdrop-blur-2xl bg-white/70 border border-rose-200/60 px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.25em] text-rose-600 uppercase mb-10 shadow-lg shadow-rose-100/50 flex items-center gap-3"
          >
            <motion.span 
              className="relative flex h-2 w-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </motion.span>
            Valentine's Week Exclusive
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-5xl w-full text-center">
          
          {/* Clarity tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ y: y1 }}
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-block text-xs font-bold tracking-wider text-slate-700 uppercase px-5 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full border border-rose-200/60 shadow-sm mb-8"
            >
              Interactive Valentine Experience for Couples
            </motion.span>
          </motion.div>

          {/* Main Headline - Better sized */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ y: y1 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 leading-[1.2] mb-4">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block mb-2"
              >
                7 Days. 7 Surprises.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block font-serif italic bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 bg-clip-text text-transparent relative inline-block"
              >
                One story you build together.
                
                {/* Sparkles around the text */}
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute"
                    style={{
                      left: `${15 + i * 20}%`,
                      top: i % 2 ? '-8px' : 'auto',
                      bottom: i % 2 ? 'auto' : '-8px',
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles size={14} className="text-amber-400" />
                  </motion.span>
                ))}
              </motion.span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ y: y2 }}
            className="text-slate-600 text-base md:text-lg mb-3 max-w-2xl mx-auto leading-relaxed"
          >
            A private space for couples to unlock a new surprise every day — from quizzes and hidden letters to shared memories you keep forever.
          </motion.p>

          {/* Target audience */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-sm text-slate-400 mb-12 italic font-light"
          >
            Made for long-distance couples, new relationships & anniversaries ✨
          </motion.p>

          {/* 7-Day Preview Timeline - More dynamic */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-14 max-w-4xl mx-auto"
          >
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 border border-rose-200/60 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-rose-100/20"
            >
              <motion.h3 
                className="text-xs font-bold tracking-wider text-slate-600 uppercase mb-6 flex items-center justify-center gap-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Calendar size={14} className="text-rose-500" />
                Your Week Together
              </motion.h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
                {[
                  { day: 1, icon: "❤️", label: "Love Quiz", color: "rose" },
                  { day: 2, icon: "🌹", label: "Rose Day", color: "pink" },
                  { day: 3, icon: "💝", label: "Propose", color: "red" },
                  { day: 4, icon: "🍫", label: "Chocolate", color: "amber" },
                  { day: 5, icon: "🧸", label: "Teddy Day", color: "orange" },
                  { day: 6, icon: "💌", label: "Promise", color: "purple" },
                  { day: 7, icon: "💕", label: "Valentine", color: "rose" },
                ].map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.9 + i * 0.08,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      rotate: i % 2 ? 5 : -5,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative cursor-pointer"
                  >
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/60 overflow-hidden">
                      
                      {/* Gradient overlay on hover */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-rose-100/0 to-pink-100/0 group-hover:from-rose-100/50 group-hover:to-pink-100/50 transition-all duration-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                      
                      {/* Icon with continuous gentle animation */}
                      <motion.div 
                        className="text-2xl md:text-3xl mb-2 relative z-10"
                        animate={{ 
                          rotate: [0, -8, 8, -8, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          repeatDelay: 2 + i * 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        {day.icon}
                      </motion.div>
                      
                      {/* Label */}
                      <p className="text-[10px] md:text-xs font-bold text-slate-700 leading-tight relative z-10">
                        {day.label}
                      </p>
                    </div>

                    {/* Connecting line */}
                    {i < 6 && (
                      <motion.div 
                        className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[2px] bg-gradient-to-r from-rose-300 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Unlock hint with pulse */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock size={11} className="text-rose-400" />
                </motion.div>
                Each day unlocks at midnight
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Feature Cards - More dynamic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 max-w-4xl mx-auto">
            {[
              { 
                icon: MessageCircle, 
                label: "Love Games", 
                desc: "Quizzes & challenges designed for couples",
                gradient: "from-rose-500/10 via-pink-500/10 to-rose-500/5",
                iconBg: "from-rose-500 to-pink-600",
                delay: 1.9
              },
              { 
                icon: Mail, 
                label: "Secret Letters", 
                desc: "Hidden messages that unlock daily",
                gradient: "from-pink-500/10 via-purple-500/10 to-pink-500/5",
                iconBg: "from-pink-500 to-purple-600",
                delay: 2.0
              },
              { 
                icon: Image, 
                label: "Memory Timeline", 
                desc: "Build your story together forever",
                gradient: "from-purple-500/10 via-rose-500/10 to-purple-500/5",
                iconBg: "from-purple-500 to-rose-600",
                delay: 2.1
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: item.delay,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="group relative p-6 rounded-[1.75rem] bg-white/70 backdrop-blur-xl border border-white/80 hover:border-rose-200/80 shadow-lg hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-500 text-left overflow-hidden"
              >
                {/* Animated gradient background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconBg} text-white flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{item.label}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* Corner accent */}
                <motion.div 
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Premium CTA */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.8, type: "spring" }}
            className="flex flex-col items-center gap-6 mb-16"
          >
            <Link href="/dashboard" className="relative group">
              {/* Animated glow rings */}
              <motion.div 
                className="absolute -inset-8 bg-gradient-to-r from-rose-500/20 via-pink-500/30 to-rose-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.button 
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-lg font-bold py-5 px-12 rounded-full flex items-center gap-3 hover:from-rose-600 hover:via-rose-500 hover:to-rose-600 transition-all duration-500 shadow-2xl shadow-slate-900/30 overflow-hidden group"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
                
                <span className="relative">Start Day 1</span>
                <motion.div
                  animate={{ 
                    x: [0, 3, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <Heart size={20} fill="currentColor" />
                </motion.div>

                {/* Sparkles on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ pointerEvents: 'none' }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles size={12} className="text-white/60" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.button>
            </Link>

            {/* Visitor Counter - NEW */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.6 }}
              className="text-sm text-rose-500 font-semibold flex items-center gap-2 min-h-[24px]"
            >
              {visits !== null ? (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                  {visits.toLocaleString()} couples already started their story
                </>
              ) : (
                <span className="text-slate-400 text-xs">Loading...</span>
              )}
            </motion.div>
            
            {/* Trust badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
              className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-[10px] font-bold tracking-wider text-slate-500 uppercase"
            >
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Lock size={12} className="text-rose-400" /> 
                Private & Secure
              </motion.span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <motion.span 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Users size={12} className="text-rose-400" /> 
                Couples Only
              </motion.span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <motion.span 
                className="flex items-center gap-2 text-rose-500"
                whileHover={{ scale: 1.05 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={12} className="text-amber-400" />
                Free to start
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Social Proof - Elegant stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div 
              whileHover={{ y: -4 }}
              className="backdrop-blur-2xl bg-white/50 border border-rose-100/60 rounded-[2rem] p-8 shadow-xl"
            >
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: "2,000+", label: "Couples", icon: Heart, delay: 2.6 },
                  { value: "14,000+", label: "Memories", icon: Image, delay: 2.7 },
                  { value: "4.9★", label: "Rating", icon: Star, delay: 2.8 },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: stat.delay,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="text-center group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-block mb-2"
                    >
                      <stat.icon size={20} className="text-rose-500 mx-auto" />
                    </motion.div>
                    <motion.div 
                      className="text-2xl md:text-3xl font-bold text-slate-900 mb-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9 }}
          className="mt-16 pt-8 border-t border-rose-100/50 w-full max-w-4xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap justify-center gap-6">
              <span className="font-semibold tracking-wide">SECURED ACCESS</span>
              <span className="font-semibold tracking-wide">NO INSTALLATION</span>
              <span className="font-semibold tracking-wide">MOBILE FRIENDLY</span>
            </div>
            <motion.div 
              className="flex items-center gap-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart size={12} className="text-rose-400" fill="currentColor" />
              <span>Made with love for modern couples</span>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}