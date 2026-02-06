"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Gem, Sparkles, ChevronRight, ArrowLeft, Lock } from "lucide-react";

const DAY2_GAMES = [
  {
    id: "propose",
    title: "The Proposal",
    desc: "Ask the most important question",
    path: "/games/day2/propose/create",
    icon: Gem,
    color: "from-rose-400 to-pink-500",
    available: true,
    emoji: "💍"
  },
  
  {
    id: "memories",
    title: "Memory Promise",
    desc: "Create lasting memories",
    path: "/games/day2/memory/create",
    icon: Heart,
    color: "from-purple-400 to-rose-500",
    available: true,
    emoji: "💝"
  }
];

export default function Day2Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex overflow-hidden relative">
      
      {/* Premium gradient background with mesh effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(at 27% 37%, hsla(15, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 97% 21%, hsla(340, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 52% 99%, hsla(320, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 10% 29%, hsla(350, 100%, 92%, 1) 0px, transparent 50%),
              radial-gradient(at 97% 96%, hsla(0, 100%, 94%, 1) 0px, transparent 50%),
              radial-gradient(at 33% 50%, hsla(330, 100%, 93%, 1) 0px, transparent 50%),
              radial-gradient(at 79% 53%, hsla(355, 100%, 95%, 1) 0px, transparent 50%)
            `,
          }}
        />

        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Floating hearts - more subtle */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/20"
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
              delay: Math.random() * 4,
            }}
          >
            <Heart size={12 + Math.random() * 16} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Sidebar - Premium styling */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="w-96 bg-white/80 backdrop-blur-2xl border-r border-rose-100/50 p-8 hidden lg:flex flex-col relative z-10 shadow-[0_0_50px_rgba(251,113,133,0.08)]"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-[0_8px_30px_rgba(251,113,133,0.35)]">
              <Gem className="text-white" size={20} />
            </div>
            <span className="text-3xl">💍</span>
          </motion.div>
          <h2 className="text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 mb-2">
            Propose Day
          </h2>
          <p className="text-sm text-slate-600/70 font-light tracking-wide">
            The courage to begin forever
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {DAY2_GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={game.available ? { scale: 1.02, x: 6 } : {}}
              onClick={() => game.available && router.push(game.path)}
              className={`
                relative overflow-hidden rounded-2xl transition-all
                ${game.available 
                  ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(251,113,133,0.15)] bg-white border border-rose-100/60" 
                  : "cursor-not-allowed bg-slate-50/40 border border-slate-200/40"
                }
              `}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center relative
                  ${game.available 
                    ? `bg-gradient-to-br ${game.color} shadow-lg` 
                    : "bg-slate-200"
                  }
                `}>
                  {game.available ? (
                    <game.icon className="text-white" size={22} />
                  ) : (
                    <Lock className="text-slate-400" size={18} />
                  )}
                  
                  {/* Emoji badge */}
                  <motion.span
                    animate={game.available ? {
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="absolute -top-2 -right-2 text-xl drop-shadow"
                  >
                    {game.emoji}
                  </motion.span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`font-semibold text-base ${game.available ? "text-slate-800" : "text-slate-400"}`}>
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500/80 mt-0.5 font-light">
                    {game.desc}
                  </p>
                </div>

                {/* Arrow or lock */}
                {game.available ? (
                  <ChevronRight size={18} className="text-slate-400" />
                ) : (
                  <div className="text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-100/50 rounded-full">
                    Soon
                  </div>
                )}
              </div>

              {/* Hover gradient effect */}
              {game.available && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-0`}
                  whileHover={{ opacity: 0.04 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => router.push("/dashboard")}
          whileHover={{ x: -5 }}
          className="mt-8 flex items-center gap-2 text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-4xl w-full">
          
          {/* Hero Section - Premium redesign */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-20"
          >
            {/* Premium ring with enhanced glow */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 180 }}
              className="inline-block mb-12 relative"
            >
              {/* Multi-layer glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 blur-3xl bg-gradient-to-br from-amber-200 via-rose-200 to-pink-200 rounded-full"
              />
              
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute inset-0 blur-2xl bg-gradient-to-br from-yellow-300 to-rose-300 rounded-full"
              />
              
              {/* Enhanced ring SVG */}
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                className="relative drop-shadow-2xl"
              >
                {/* Ring band with metallic effect */}
                <defs>
                  <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="25%" stopColor="#FFF4D0" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="75%" stopColor="#FFC700" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                  
                  <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#E3F2FF" />
                    <stop offset="60%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#D4EBFF" />
                  </linearGradient>
                  
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Ring circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="28"
                  fill="none"
                  stroke="url(#ringGold)"
                  strokeWidth="7"
                  filter="url(#shadow)"
                />
                
                {/* Inner highlight */}
                <circle
                  cx="70"
                  cy="70"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                  transform="translate(0, -1)"
                />
                
                {/* Diamond with animation */}
                <motion.g
                  animate={{
                    scale: [1, 1.12, 1],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "70px 48px" }}
                >
                  {/* Diamond facets */}
                  <polygon
                    points="70,38 82,48 70,56 58,48"
                    fill="url(#diamondShine)"
                    stroke="#B8D4E8"
                    strokeWidth="1"
                    filter="url(#shadow)"
                  />
                  
                  {/* Top facet highlight */}
                  <polygon
                    points="70,38 76,43 70,46 64,43"
                    fill="white"
                    opacity="0.8"
                  />
                  
                  {/* Sparkle points */}
                  <circle cx="70" cy="38" r="1.5" fill="white" opacity="0.9" />
                  <circle cx="82" cy="48" r="1" fill="white" opacity="0.7" />
                  <circle cx="58" cy="48" r="1" fill="white" opacity="0.7" />
                </motion.g>
                
                {/* Rotating sparkles around the ring */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "70px 70px" }}
                >
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 70 + Math.cos(rad) * 40;
                    const y = 70 + Math.sin(rad) * 40;
                    return (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#FFD700"
                        animate={{
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    );
                  })}
                </motion.g>
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl md:text-7xl lg:text-8xl font-light text-slate-900 mb-6 tracking-tight"
            >
              Happy{" "}
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700">
                Propose Day
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-slate-600/80 mb-4 leading-relaxed max-w-2xl mx-auto font-light"
            >
              Today is about courage — the courage to ask, the courage to love,
              and the courage to begin forever.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-slate-400 italic font-light tracking-wide"
            >
              "Will you marry me?" — The most beautiful question ever asked 💕
            </motion.p>
          </motion.div>

          {/* CTA Button - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col items-center gap-6 mb-20"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/games/day2/propose/create")}
              className="group relative px-14 py-5 rounded-full font-semibold text-lg shadow-[0_20px_50px_rgba(251,113,133,0.35)] overflow-hidden"
            >
              {/* Animated gradient background */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-[length:200%_100%]"
              />
              
              {/* Top highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.25), transparent 70%)",
                }}
              />
              
              <span className="relative text-white flex items-center gap-3 tracking-wide">
                Start Your Proposal
                <motion.span
                  animate={{ rotate: [0, -12, 12, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  💍
                </motion.span>
              </span>
            </motion.button>

            {/* Secondary info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 text-sm text-slate-500/80 font-light"
            >
              <Sparkles size={14} className="text-rose-400" />
              <span>Create a magical proposal in under 2 minutes</span>
            </motion.div>
          </motion.div>

          {/* Premium Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                icon: "💌", 
                title: "Personalized", 
                desc: "Crafted uniquely for your love story",
                gradient: "from-rose-500/10 to-pink-500/10",
                border: "border-rose-200/40"
              },
              { 
                icon: "🎨", 
                title: "Beautiful", 
                desc: "Elegantly designed for the perfect moment",
                gradient: "from-pink-500/10 to-purple-500/10",
                border: "border-pink-200/40"
              },
              { 
                icon: "📱", 
                title: "Shareable", 
                desc: "Share your joy with everyone you love",
                gradient: "from-purple-500/10 to-rose-500/10",
                border: "border-purple-200/40"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`
                  relative group bg-white/60 backdrop-blur-xl rounded-3xl p-8 
                  border ${feature.border}
                  shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                  hover:shadow-[0_20px_50px_rgba(251,113,133,0.15)]
                  transition-all duration-500
                  overflow-hidden
                `}
              >
                {/* Background gradient on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="text-5xl mb-4 inline-block"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-lg tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600/80 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Mobile menu button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed bottom-8 left-8 z-20 w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-[0_20px_50px_rgba(251,113,133,0.4)] flex items-center justify-center text-white"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft size={22} />
      </motion.button>
    </div>
  );
}