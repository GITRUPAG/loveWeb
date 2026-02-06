"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Candy, Sparkles, ChevronRight, ArrowLeft, Lock } from "lucide-react";

const DAY3_GAMES = [
  {
    id: "chocolate-sync",
    title: "Synchronized Snap",
    desc: "Break the chocolate at the exact same moment",
    path: "/games/day3/chocolate-sync/create",
    icon: Candy,
    color: "from-amber-600 to-yellow-500",
    available: true,
    emoji: "🍫"
  },
  {
    id: "melt-heart",
    title: "Melt My Heart",
    desc: "Hold to melt the frozen chocolate heart",
    path: "/games/day3/melt-heart",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    available: true,
    emoji: "❤️‍🔥"
  },
  {
    id: "steal-chocolate",
    title: "Steal My Chocolate",
    desc: "Tap fast… but some pieces go to them",
    path: "/games/day3/steal-chocolate",
    icon: Sparkles,
    color: "from-purple-500 to-fuchsia-500",
    available: true,
    emoji: "😏"
  }
];

export default function ChocolateDayDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex overflow-hidden relative">
      
      {/* Premium gradient background with mesh effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft mesh gradient - chocolate themed */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(at 27% 37%, hsla(30, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 97% 21%, hsla(25, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 52% 99%, hsla(20, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 10% 29%, hsla(35, 100%, 92%, 1) 0px, transparent 50%),
              radial-gradient(at 97% 96%, hsla(15, 100%, 94%, 1) 0px, transparent 50%),
              radial-gradient(at 33% 50%, hsla(28, 100%, 93%, 1) 0px, transparent 50%),
              radial-gradient(at 79% 53%, hsla(22, 100%, 95%, 1) 0px, transparent 50%)
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

        {/* Floating chocolate pieces - subtle */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-300/20"
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
            <Candy size={12 + Math.random() * 16} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Sidebar - Premium styling */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="w-96 bg-white/80 backdrop-blur-2xl border-r border-amber-100/50 p-8 hidden lg:flex flex-col relative z-10 shadow-[0_0_50px_rgba(217,119,6,0.08)]"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-[0_8px_30px_rgba(217,119,6,0.35)]">
              <Candy className="text-white" size={20} />
            </div>
            <span className="text-3xl">🍫</span>
          </motion.div>
          <h2 className="text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-amber-700 via-orange-600 to-amber-800 mb-2">
            Chocolate Day
          </h2>
          <p className="text-sm text-slate-600/70 font-light tracking-wide">
            Sweetness is meant to be shared
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {DAY3_GAMES.map((game, index) => (
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
                  ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(217,119,6,0.15)] bg-white border border-amber-100/60" 
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
          className="mt-8 flex items-center gap-2 text-slate-500 hover:text-amber-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-4xl w-full">
          
          {/* Hero Section - Premium chocolate design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-20"
          >
            {/* Premium chocolate bar with enhanced glow */}
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
                className="absolute inset-0 blur-3xl bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 rounded-full"
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
                className="absolute inset-0 blur-2xl bg-gradient-to-br from-amber-300 to-orange-300 rounded-full"
              />
              
              {/* Enhanced chocolate bar SVG */}
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                className="relative drop-shadow-2xl"
              >
                <defs>
                  <linearGradient id="chocolateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B4513" />
                    <stop offset="25%" stopColor="#A0522D" />
                    <stop offset="50%" stopColor="#8B4513" />
                    <stop offset="75%" stopColor="#6F3411" />
                    <stop offset="100%" stopColor="#8B4513" />
                  </linearGradient>
                  
                  <linearGradient id="chocolateShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D2691E" />
                    <stop offset="50%" stopColor="#CD853F" />
                    <stop offset="100%" stopColor="#D2691E" />
                  </linearGradient>
                  
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Chocolate bar base */}
                <rect
                  x="35"
                  y="45"
                  width="70"
                  height="50"
                  rx="4"
                  fill="url(#chocolateGradient)"
                  filter="url(#shadow)"
                />
                
                {/* Chocolate squares grid */}
                {[0, 1, 2].map((row) => (
                  <g key={row}>
                    {[0, 1, 2].map((col) => (
                      <motion.rect
                        key={`${row}-${col}`}
                        x={38 + col * 21.3}
                        y={48 + row * 14.7}
                        width="20"
                        height="13"
                        rx="1"
                        fill="url(#chocolateShine)"
                        opacity="0.4"
                        animate={{
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: (row + col) * 0.2,
                        }}
                      />
                    ))}
                  </g>
                ))}
                
                {/* Top highlight */}
                <rect
                  x="35"
                  y="45"
                  width="70"
                  height="8"
                  rx="4"
                  fill="white"
                  opacity="0.2"
                />
                
                {/* Wrapper corner - gold foil */}
                <motion.path
                  d="M 35 45 L 50 35 L 65 45 Z"
                  fill="#FFD700"
                  opacity="0.7"
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                {/* Rotating sparkles around chocolate */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "70px 70px" }}
                >
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 70 + Math.cos(rad) * 45;
                    const y = 70 + Math.sin(rad) * 45;
                    return (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="2"
                        fill="#D4A574"
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
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-amber-700 via-orange-600 to-amber-800">
                Chocolate Day
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl md:text-2xl text-slate-600/80 mb-4 leading-relaxed max-w-2xl mx-auto font-light"
            >
              Sweetness is meant to be shared. Pick a game and make them smile today.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-sm text-slate-400 italic font-light tracking-wide"
            >
              "Love is like chocolate — best when shared." 🍫
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
              onClick={() => router.push("/games/day3/chocolate-sync/create")}
              className="group relative px-14 py-5 rounded-full font-semibold text-lg shadow-[0_20px_50px_rgba(217,119,6,0.35)] overflow-hidden"
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
                className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-[length:200%_100%]"
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
                Start Playing
                <motion.span
                  animate={{ rotate: [0, -12, 12, -12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🍫
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
              <Sparkles size={14} className="text-amber-600" />
              <span>Sweet games designed for two hearts</span>
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
                icon: "🍫", 
                title: "Interactive", 
                desc: "Playful games that bring you closer together",
                gradient: "from-amber-600/10 to-yellow-500/10",
                border: "border-amber-200/40"
              },
              { 
                icon: "💕", 
                title: "Sweet Moments", 
                desc: "Create memories sweeter than chocolate",
                gradient: "from-orange-500/10 to-rose-500/10",
                border: "border-orange-200/40"
              },
              { 
                icon: "✨", 
                title: "Delightful", 
                desc: "Beautifully crafted experiences to share",
                gradient: "from-yellow-500/10 to-amber-500/10",
                border: "border-yellow-200/40"
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
                  hover:shadow-[0_20px_50px_rgba(217,119,6,0.15)]
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
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
        className="lg:hidden fixed bottom-8 left-8 z-20 w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full shadow-[0_20px_50px_rgba(217,119,6,0.4)] flex items-center justify-center text-white"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft size={22} />
      </motion.button>
    </div>
  );
}