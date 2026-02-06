"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Copy, Share2, Sparkles, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Array of romantic one-liner messages
const QUICK_MESSAGES = [
  "This rose is for the one who makes my heart skip a beat.",
  "You're the petal to my flower and the beat to my heart.",
  "Every rose has thorns, but every day with you is pure sweetness.",
  "Sending a digital bouquet to my favorite person in the world.",
  "If I had a rose for every time I thought of you, I'd have a giant garden.",
  "You're more beautiful than any rose, inside and out.",
  "Just like a rose, your love adds fragrance to my life.",
  "For you, my love, a message as timeless as a blooming rose.",
  "My love for you grows deeper with every passing day, just like a rose.",
  "You are the sunshine that makes my rose bloom."
];

export default function RoseMessageGeneratorPage() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(
    QUICK_MESSAGES[Math.floor(Math.random() * QUICK_MESSAGES.length)] // Start with a random message
  );
  const [copied, setCopied] = useState(false);

  const generateNewMessage = () => {
    // Filter out the current message to avoid immediate repetition
    const availableMessages = QUICK_MESSAGES.filter(msg => msg !== currentMessage);
    const newMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    setCurrentMessage(newMessage);
    setCopied(false); // Reset copied state
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(currentMessage)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => console.error('Failed to copy message:', err));
  };

  const shareMessage = () => {
    // This is a placeholder for actual web share API or custom share logic
    // On a real application, you'd use navigator.share or generate an image.
    alert('Share functionality coming soon! For now, please use the copy button.');
    // Example using Web Share API (requires HTTPS and user interaction)
    /*
    if (navigator.share) {
      navigator.share({
        title: 'A Rose Day Message for You!',
        text: currentMessage,
        url: window.location.href, // Or a specific shareable URL
      }).then(() => {
        console.log('Shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      alert('Web Share API is not supported in this browser. Please use the copy button.');
    }
    */
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-rose-200/30 blur-3xl rounded-full animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-52 h-52 bg-purple-200/30 blur-3xl rounded-full animate-pulse-slow delay-500" />
      <Heart size={60} className="absolute top-10 right-10 text-rose-100 fill-rose-100 animate-float" />
      <Sparkles size={40} className="absolute bottom-20 left-10 text-purple-200 animate-spin-slow" />

      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="absolute top-6 left-6 p-3 bg-white rounded-full shadow-md text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors z-10"
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-rose-50 text-center z-10"
      >
        <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full text-rose-500 font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles size={16} /> Rose Message Generator
        </div>
        
        <h2 className="text-3xl font-black mb-8 text-slate-900 leading-snug">
          Your Daily Dose of Digital Romance
        </h2>

        <motion.p
          key={currentMessage} // Key to trigger animation on message change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg md:text-xl font-serif italic text-rose-600 leading-relaxed min-h-[80px] flex items-center justify-center bg-rose-50 p-6 rounded-2xl border border-rose-100 mb-10"
        >
          "{currentMessage}"
        </motion.p>

        <div className="grid grid-cols-3 gap-4">
          <motion.button
            onClick={generateNewMessage}
            className="col-span-1 bg-rose-100 text-rose-600 p-4 rounded-full flex flex-col items-center justify-center text-sm font-semibold shadow-sm hover:bg-rose-200 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={20} />
            <span className="mt-1 hidden md:block">Generate</span>
          </motion.button>

          <motion.button
            onClick={copyMessage}
            className={`col-span-1 p-4 rounded-full flex flex-col items-center justify-center text-sm font-semibold shadow-sm transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
            whileTap={{ scale: 0.95 }}
          >
            <Copy size={20} />
            <span className="mt-1 hidden md:block">{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>

          <motion.button
            onClick={shareMessage}
            className="col-span-1 bg-purple-100 text-purple-600 p-4 rounded-full flex flex-col items-center justify-center text-sm font-semibold shadow-sm hover:bg-purple-200 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={20} />
            <span className="mt-1 hidden md:block">Share</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Animation Styles (Add these to your global CSS or directly in the component style tag if preferred) */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 5s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}