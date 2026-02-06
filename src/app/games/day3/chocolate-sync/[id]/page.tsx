"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Users, Zap, Sparkles } from "lucide-react";

export default function ChocolateSyncGame() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false); // ✨ NEW: Track if this user is playerA
  const [countdown, setCountdown] = useState<number | null>(null);
  const [phase, setPhase] = useState<"join" | "waiting" | "countdown" | "snap">("join");
  const [snapped, setSnapped] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const swipeStart = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---------------- JOIN SESSION ----------------
  const joinSession = async () => {
    if (!name.trim()) return alert("Enter your name");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/${id}/join?playerB=${encodeURIComponent(name)}`,
      { method: "POST" }
    );

    setJoined(true);
    setPhase("waiting");
  };

  // ---------------- POLL SESSION ----------------
  useEffect(() => {
    if (!joined) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/${id}`
      );
      const data = await res.json();
      setSession(data);

      // ✨ FIXED: Detect if this user is the host
      const amIHost = name === data.playerA;
      setIsHost(amIHost);

      // ✨ FIXED: Only host starts the countdown (prevents race condition)
      if (amIHost && data.playerA && data.playerB && !data.countdownStarted) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/${id}/start`,
          { method: "POST" }
        );
      }

      // 🔥 FIXED: Decide phase based on TIME not boolean
      if (!data.playerB) {
        setPhase("waiting");
      }
      else if (data.countdownStarted) {
        const diff = new Date(data.countdownAt).getTime() - Date.now();

        if (diff <= 0) {
          setPhase("snap");        // countdown finished
        } else {
          setPhase("countdown");   // still counting
        }
      }

      if (data.finished) {
        router.push(`/games/day3/chocolate-sync/result/${id}`);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [joined, id, router, name]); // ✨ Added 'name' to deps

  // ---------------- SYNC COUNTDOWN ----------------
  useEffect(() => {
    if (!session?.countdownAt) return;

    const timer = setInterval(() => {
      const diff = new Date(session.countdownAt).getTime() - Date.now();
      const seconds = Math.max(0, Math.ceil(diff / 1000));

      if (seconds <= 0) {
        setCountdown(0);
        setPhase("snap");
        clearInterval(timer);
      } else {
        setCountdown(seconds);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [session?.countdownAt]);

  // ---------------- SNAP DETECTION ----------------
  const sendSnap = async () => {
    if (snapped) return;
    setSnapped(true);

    // ✨ FIXED: Send correct player role (A or B)
    const playerRole = isHost ? 'A' : 'B';
    
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/${id}/snap?player=${playerRole}&time=${Date.now()}`,
      { method: "POST" }
    );
  };

  const onTouchStart = (e: any) => {
    swipeStart.current = e.touches[0].clientY;
    setSwipeProgress(0);
  };

  const onTouchMove = (e: any) => {
    if (swipeStart.current === null || phase !== "snap") return;
    const diff = swipeStart.current - e.touches[0].clientY;
    const progress = Math.min(Math.max(diff / 150, 0), 1);
    setSwipeProgress(progress);
  };

  const onTouchEnd = (e: any) => {
    if (swipeStart.current === null) return;
    const diff = swipeStart.current - e.changedTouches[0].clientY;

    if (diff > 80 && phase === "snap" && !snapped) {
      sendSnap();
    }
    
    setSwipeProgress(0);
    swipeStart.current = null;
  };

  // ---------------- JOIN PHASE ----------------
  if (phase === "join") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                opacity: 0.15
              }}
            >
              <span className="text-5xl">
                {['🍫', '💕', '✨', '💝'][Math.floor(Math.random() * 4)]}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full animate-slideUp">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-pink-400 rounded-full blur-3xl opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-8 shadow-2xl">
                  <span className="text-7xl">🍫</span>
                </div>
              </div>

              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-200 to-pink-200 mb-3 animate-shimmer">
                Join the Sync
              </h1>
              <p className="text-pink-200 text-lg font-semibold flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-pink-300 text-pink-300 animate-heartbeat" />
                Enter your sweet name
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
              
              <label className="block text-sm font-black text-pink-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Your Name
              </label>
              
              <input
                type="text"
                placeholder="e.g., Rahul"
                className="w-full border-3 border-pink-300 rounded-2xl px-5 py-4 mb-6 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-200 text-lg font-semibold text-pink-900 placeholder-pink-400 bg-white shadow-inner transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinSession()}
                autoFocus
              />

              <button
                onClick={joinSession}
                className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:via-rose-700 hover:to-red-700 text-white px-6 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000" />
                
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Join Chocolate Sync
                <span className="text-2xl group-hover:scale-125 transition-transform">💕</span>
              </button>

              {/* Decorative */}
              <div className="flex justify-center gap-3 mt-6">
                {['🍫', '💝', '🍫'].map((emoji, i) => (
                  <span 
                    key={i} 
                    className="text-3xl animate-bounce-slow opacity-70"
                    style={{animationDelay: `${i * 0.3}s`}}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
          }
          @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float linear infinite; }
          .animate-shimmer { 
            background-size: 200% auto;
            animation: shimmer 3s linear infinite; 
          }
          .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
          .animate-slideUp { animation: slideUp 0.6s ease-out; }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // ---------------- WAITING PHASE ----------------
  if (phase === "waiting") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
                opacity: 0.1
              }}
            >
              <Heart className="w-16 h-16 text-pink-300 fill-pink-300" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
          
          {/* Pulsing Connection Animation */}
          <div className="relative mb-12">
            {/* Outer Pulse Rings */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-4 border-pink-400 rounded-full animate-ping"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
            
            {/* Center Heart */}
            <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-16 shadow-2xl">
              <Heart className="w-24 h-24 text-white fill-white animate-heartbeat" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 mb-4 animate-shimmer">
            Waiting for Connection
          </h2>
          
          <p className="text-pink-200 text-xl font-semibold mb-8">
            {session?.playerA || "Your partner"} is waiting...
          </p>

          {/* Loading Dots */}
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-pink-400 rounded-full animate-bounce"
                style={{animationDelay: `${i * 0.2}s`}}
              />
            ))}
          </div>

          {/* Decorative Text */}
          <p className="mt-12 text-pink-300/60 text-sm italic">
            Setting up your chocolate connection...
          </p>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
          }
          @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.15); }
          }
          .animate-float { animation: float linear infinite; }
          .animate-shimmer { 
            background-size: 200% auto;
            animation: shimmer 3s linear infinite; 
          }
          .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // ---------------- COUNTDOWN PHASE ----------------
  if (phase === "countdown") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
        
        {/* Intense Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                opacity: 0.2
              }}
            >
              <Zap className="w-12 h-12 text-yellow-300" />
            </div>
          ))}
        </div>

        {/* Countdown Number */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            
            {/* Pulsing Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-60 animate-pulse" />
            </div>

            {/* Number */}
            <div className="relative">
              <h1 
                className="text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-orange-300 to-red-400 animate-countdown leading-none"
                style={{
                  WebkitTextStroke: '4px rgba(255, 255, 255, 0.3)',
                  filter: 'drop-shadow(0 0 60px rgba(251, 146, 60, 0.8))'
                }}
              >
                {countdown}
              </h1>
            </div>

            {/* Ready Text */}
            <p className="text-3xl font-black text-yellow-200 mt-8 animate-pulse uppercase tracking-wider">
              Get Ready! 🍫
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-40px) rotate(180deg); opacity: 0.4; }
          }
          @keyframes countdown {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); }
            100% { transform: scale(0.9); opacity: 0.8; }
          }
          .animate-float { animation: float linear infinite; }
          .animate-countdown { animation: countdown 1s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // ---------------- SNAP PHASE ----------------
  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Dynamic Background - Changes with swipe */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-600 transition-opacity duration-200"
        style={{ opacity: swipeProgress * 0.7 }}
      />

      {/* Chocolate Rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <span className="text-5xl opacity-30">🍫</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {snapped ? (
          /* Snapped State */
          <div className="text-center animate-scaleIn">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-60 animate-ping" />
              <div className="relative text-9xl animate-bounce-once">✨</div>
            </div>
            <h2 className="text-5xl font-black text-green-300 mb-4">
              Snapped! 🍫
            </h2>
            <p className="text-2xl text-green-200">
              Waiting for results...
            </p>
          </div>
        ) : (
          /* Active Snap Zone */
          <div className="text-center">
            
            {/* Chocolate Icon */}
            <div 
              className="relative mb-12 transition-transform duration-200"
              style={{
                transform: `translateY(${-swipeProgress * 100}px) scale(${1 + swipeProgress * 0.5})`,
                filter: `brightness(${1 + swipeProgress})`
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-64 h-64 bg-orange-500 rounded-full blur-3xl transition-opacity duration-200"
                  style={{ opacity: 0.4 + swipeProgress * 0.4 }}
                />
              </div>

              {/* Chocolate */}
              <div className="relative text-[12rem] leading-none animate-float-gentle">
                🍫
              </div>

              {/* Swipe Trail */}
              {swipeProgress > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-7xl animate-fade-up"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0.3 - i * 0.05
                      }}
                    >
                      🍫
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instruction */}
            <div className="relative">
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-200 mb-6 animate-shimmer">
                Swipe Up NOW!
              </h2>

              {/* Swipe Indicator */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl animate-swipe-up">👆</div>
                
                {/* Progress Bar */}
                <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/30">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-100 rounded-full"
                    style={{ width: `${swipeProgress * 100}%` }}
                  />
                </div>

                <p className="text-xl text-orange-200 font-semibold">
                  {swipeProgress > 0.5 ? "Keep going! 🔥" : "Swipe faster! ⚡"}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes swipe-up {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-30px); opacity: 0.5; }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes fade-up {
          0% { transform: translateY(0); opacity: 0.3; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-swipe-up { animation: swipe-up 1.5s ease-in-out infinite; }
        .animate-shimmer { 
          background-size: 200% auto;
          animation: shimmer 2s linear infinite; 
        }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        .animate-bounce-once { animation: bounce-once 0.6s ease-out; }
        .animate-fade-up { animation: fade-up 1s ease-out forwards; }
      `}</style>
    </div>
  );
}