"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Share2, Sparkles, Heart } from "lucide-react";

export default function CreateChocolateSync() {
  const [partnerName, setPartnerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const createSession = async () => {
    if (!partnerName.trim()) return alert("Please enter your partner's name");

    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/create?playerA=${encodeURIComponent(partnerName)}`,
      { method: "POST" }
    );

    const data = await res.json();

    const shareLink = `${window.location.origin}/games/day3/chocolate-sync/${data.id}`;
    setLink(shareLink);
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAndShare = () => {
    window.open(link, '_blank');
    
    if (navigator.share) {
      navigator.share({
        title: 'Chocolate Sync Game 🍫',
        text: `${partnerName}, let's test our chocolate connection! 💕`,
        url: link
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-red-900">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Chocolates */}
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
            <span className="text-6xl">
              {['🍫', '🍬', '🍰', '🎂', '🧁'][Math.floor(Math.random() * 5)]}
            </span>
          </div>
        ))}

        {/* Heart particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.15
            }}
          >
            <Heart className="w-8 h-8 text-pink-300 fill-pink-300" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          
          {!link ? (
            /* Create Form */
            <div className="animate-slideUp">
              
              {/* Header with Melting Effect */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  {/* Chocolate Bar Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-amber-600 via-orange-700 to-amber-800 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <span className="text-7xl animate-bounce-slow">🍫</span>
                    </div>
                  </div>
                  
                  {/* Dripping Chocolate Effect */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-700 to-transparent rounded-full animate-drip" />
                  </div>
                </div>

                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 mt-8 mb-3 animate-shimmer">
                  Chocolate Sync
                </h1>
                <p className="text-amber-200 text-lg font-medium flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400 animate-heartbeat" />
                  Test Your Sweet Connection
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400 animate-heartbeat" style={{animationDelay: '0.3s'}} />
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-2xl p-8 border-4 border-amber-300 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                
                <div className="mb-6">
                  <label className="block text-base font-bold text-amber-900 mb-3 leading-relaxed flex items-start gap-2">
                    <Heart className="w-5 h-5 text-pink-600 fill-pink-600 mt-0.5 shrink-0" />
                    <span>Who do you want to share this chocolate with?</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rahul"
                    className="w-full border-3 border-amber-300 rounded-2xl px-5 py-4 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-200 text-lg font-semibold text-amber-900 placeholder-amber-400 bg-white shadow-inner transition-all"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createSession()}
                  />
                </div>

                <button
                  onClick={createSession}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:via-rose-700 hover:to-red-700 text-white px-6 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                  disabled={loading}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000" />
                  
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="animate-pulse">Preparing chocolate...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-6 h-6 animate-heartbeat fill-white" />
                      Save This Chocolate For Them
                      <span className="text-2xl animate-bounce-slow">🍫</span>
                    </>
                  )}
                </button>

                {/* Decorative chocolate chips */}
                <div className="flex justify-center gap-2 mt-6">
                  {['💌', '🍫', '💝'].map((emoji, i) => (
                    <span 
                      key={i} 
                      className="text-3xl animate-bounce-slow opacity-60"
                      style={{animationDelay: `${i * 0.2}s`}}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Link Created - Success State */
            <div className="animate-scaleIn space-y-6">
              
              {/* Success Animation */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-60 animate-ping" />
                  
                  {/* Success icon */}
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-8 shadow-2xl animate-bounce-once">
                    <div className="text-6xl">✨</div>
                  </div>

                  {/* Confetti */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-confetti"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${i * 30}deg)`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      <span className="text-2xl">
                        {['🍫', '💝', '✨', '🎉'][i % 4]}
                      </span>
                    </div>
                  ))}
                </div>

                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-green-300 mb-2 animate-shimmer">
                  Chocolate Saved!
                </h2>
                <p className="text-amber-100 text-lg font-semibold">
                  Ready for <span className="text-pink-300 animate-pulse">{partnerName}</span> 💕
                </p>
              </div>

              {/* Link Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-2xl p-6 border-4 border-green-300 animate-wiggle">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-3 border-amber-300 rounded-2xl p-4 mb-5">
                  <p className="text-xs font-black text-amber-900 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <span className="animate-pulse">🔗</span>
                    Share This Link
                  </p>
                  <div className="bg-white rounded-xl p-4 border-2 border-dashed border-amber-400 break-all text-sm text-amber-800 font-mono shadow-inner">
                    {link}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  
                  {/* Primary Button */}
                  <button
                    onClick={openAndShare}
                    className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white px-6 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000" />
                    
                    <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Send to {partnerName}
                    <span className="text-2xl group-hover:scale-125 transition-transform">💌</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={copyLink}
                    className="w-full bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 text-amber-900 px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border-3 border-amber-400 shadow-lg hover:shadow-xl group"
                  >
                    {copied ? (
                      <>
                        <span className="text-2xl animate-bounce-once">✓</span>
                        <span className="font-black">Copied to Clipboard!</span>
                        <span className="text-xl">🎉</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Copy Link
                        <span className="text-xl">📋</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions Card */}
              <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm border-3 border-purple-400 rounded-3xl p-6 shadow-2xl animate-slideUp">
                <h3 className="font-black text-purple-100 mb-4 flex items-center gap-3 text-xl">
                  <span className="text-3xl animate-bounce-slow">📖</span>
                  What Happens Next:
                </h3>
                <ol className="space-y-3 text-purple-100">
                  <li className="flex gap-4 items-start group">
                    <span className="shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">1</span>
                    <span className="pt-1">Click the pink button to <strong>join the game yourself</strong> 🎮</span>
                  </li>
                  <li className="flex gap-4 items-start group">
                    <span className="shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">2</span>
                    <span className="pt-1"><strong>Share the link</strong> with {partnerName} 💌</span>
                  </li>
                  <li className="flex gap-4 items-start group">
                    <span className="shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-black text-white shadow-lg group-hover:scale-110 transition-transform">3</span>
                    <span className="pt-1">When they join, you'll both <strong>sync together</strong>! 🍫</span>
                  </li>
                </ol>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Add Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        
        @keyframes drip {
          0% { height: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { height: 32px; opacity: 0; }
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        
        @keyframes confetti {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateY(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--rotate)) translateY(100px); opacity: 0; }
        }
        
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float { animation: float linear infinite; }
        .animate-drip { animation: drip 3s ease-in-out infinite; }
        .animate-shimmer { 
          background-size: 200% auto;
          animation: shimmer 3s linear infinite; 
        }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out; }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
        .animate-confetti { animation: confetti 1.5s ease-out forwards; }
        .animate-bounce-once { animation: bounce-once 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}
// ```

// ## 🎯 Key Psychology Changes:

// ### **Before → After**

// | Element | ❌ Before | ✅ After |
// |---------|----------|----------|
// | **Variable name** | `name` | `partnerName` |
// | **Label** | "Your Sweet Name" | "Who do you want to share this chocolate with?" ❤️ |
// | **Placeholder** | "e.g., Rupa" | "e.g., Rahul" |
// | **Button** | "Create Chocolate Sync" | "Save This Chocolate For Them 🍫" |
// | **Loading text** | "Melting Magic..." | "Preparing chocolate..." |
// | **Success title** | "Sweet Success!" | "Chocolate Saved!" |
// | **Success subtitle** | "Session ready for [name]" | "Ready for [name] 💕" |
// | **Primary CTA** | "Open & Share to Partner" | "Send to [name] 💌" |
// | **Instructions** | Generic steps | Personalized with {partnerName} |
// | **Decorative emojis** | 🍫🍬🍫 | 💌🍫💝 |

// ### **Psychological Shift:**

// **Before (wrong):**
// ```
// User thinks: "I'm creating a game session"
// Feels like: Technical setup
// ```

// **After (correct):**
// ```
// User thinks: "I'm sending something special to Rahul"
// Feels like: Gift-giving moment