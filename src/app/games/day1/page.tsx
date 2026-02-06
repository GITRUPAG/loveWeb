"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flower2, MessageCircleHeart, Gamepad2, 
  ChevronRight, ArrowLeft, Sparkles, 
  LayoutDashboard, Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ROSE_GAMES = [
  { 
    id: 'rose-letter', 
    title: "Rose Letter", 
    desc: "Write a letter from your heart.",
    icon: <MessageCircleHeart className="text-red-500" />,
    path: "/games/day1/rose-letter/create",
    color: "bg-red-50"
  },
  { 
    id: 'rose-picker', 
    title: "Choose a Rose", 
    desc: "Pick a color, reveal a secret.",
    icon: <Flower2 className="text-rose-500" />,
    path: "/games/day1/rose-picker",
    color: "bg-rose-50"
  },
  
  
];

export default function Day1Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex overflow-hidden">
      
      {/* 🟢 LEFT SIDEBAR: THE GAMES */}
      <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-rose-100 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-rose-500 p-2 rounded-xl text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl">Rose Portal</span>
        </div>

        <nav className="space-y-4 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">
            Available Activities
          </p>

          {ROSE_GAMES.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ x: 5 }}
              onClick={() => router.push(game.path)}
              className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-white hover:shadow-md cursor-pointer transition-all border border-transparent hover:border-rose-100 group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${game.color} group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {game.title}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {game.desc}
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-400" />
            </motion.div>
          ))}
        </nav>

        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-auto flex items-center gap-2 text-slate-400 hover:text-rose-500 font-bold text-xs transition-colors p-2"
        >
          <ArrowLeft size={16} /> Exit to Main Menu
        </button>
      </aside>

      {/* 🔴 MIDDLE: WELCOME CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-20 right-20 animate-bounce delay-75">
          <Heart size={40} className="text-rose-100 fill-rose-100" />
        </div>
        <div className="absolute bottom-40 left-20 animate-pulse">
          <Sparkles size={30} className="text-rose-200" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-rose-50 mb-6">
            <Flower2 size={16} className="text-rose-500" />
            <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
              February 7th
            </span>
          </div>

          <h1 className="text-6xl font-light text-slate-900 mb-6">
            Happy <span className="font-serif italic text-rose-500">Rose Day</span>
          </h1>
          
          <p className="text-lg text-slate-500 leading-relaxed mb-10">
            Welcome to the first day of your journey. Roses are nature's way of speaking the language of love. 
            Start with a <span className="text-rose-500 font-bold">Secret Rose Picker</span> or write a 
            <span className="text-rose-500 font-bold"> Rose Letter</span>.
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/day1/rose-letter/create')}
              className="bg-rose-500 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors"
            >
              Start with Rose Letter
            </motion.button>
          </div>
        </motion.div>

        {/* MOBILE NAVIGATION */}
        <div className="md:hidden fixed bottom-6 left-6 right-6 flex justify-around bg-white p-4 rounded-[2rem] shadow-2xl border border-rose-50">
          {ROSE_GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => router.push(game.path)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`p-3 rounded-xl ${game.color}`}>
                {game.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {game.id.split('-')[0]}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
