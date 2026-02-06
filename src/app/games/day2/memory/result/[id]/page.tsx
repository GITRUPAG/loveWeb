"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MemoryResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const score = Number(params.get("score") || 0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getMessage = () => {
    if (score === 3) return "You remember everything 🥹❤️";
    if (score === 2) return "You remember us pretty well 💞";
    if (score === 1) return "Some memories faded… but love didn't 🤍";
    return "We need to make more memories together 🌙";
  };

  const getEncouragement = () => {
    if (score === 3) return "Every moment with you is unforgettable";
    if (score === 2) return "Our story is written in your heart";
    if (score === 1) return "Let's create new memories together";
    return "Every journey starts with a single memory";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 text-center p-6 relative overflow-hidden">
      {/* Decorative elements - increased opacity for better visibility */}
      <div className="absolute top-10 left-10 text-6xl opacity-30 animate-pulse">🌸</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-30 animate-pulse delay-700">💝</div>
      <div className="absolute top-1/3 right-20 text-4xl opacity-25">✨</div>
      <div className="absolute bottom-1/3 left-16 text-4xl opacity-25">💫</div>

      {/* Main content */}
      <div
        className={`relative z-10 max-w-lg transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Our Memories
        </h1>
        <p className="text-slate-500 mb-8">Together in Time</p>

        {/* Score display - reduced blur */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-8 border border-rose-100">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg mb-4">
              <span className="text-6xl">🌹</span>
            </div>
          </div>

          {/* Score circles */}
          <div className="flex justify-center gap-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-500 delay-${i * 100} ${
                  i < score
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 scale-110"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <p className="text-4xl font-bold text-slate-800 mb-2">
            {score} <span className="text-slate-400">/ 3</span>
          </p>
          
          <p className="text-2xl font-semibold text-rose-600 mb-3">
            {getMessage()}
          </p>
          
          <p className="text-slate-500 italic">
            {getEncouragement()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/games/day2/memory/create")}
            className="group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              Create Your Own Memory
              <span className="group-hover:translate-x-1 transition-transform">❤️</span>
            </span>
          </button>

          <button
            onClick={() => router.push("/games/day2/memory")}
            className="text-slate-600 hover:text-rose-600 px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>

      {/* Floating hearts animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-pulse {
          animation: float 3s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}