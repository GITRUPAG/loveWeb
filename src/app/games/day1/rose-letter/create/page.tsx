"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Copy, Check, PenTool } from "lucide-react";

const MAX_WORDS = 500;

export default function CreateRoseLetterPage() {
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [letterText, setLetterText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const wordCount = letterText.trim()
    ? letterText.trim().split(/\s+/).length
    : 0;

  const canSubmit =
    fromName.trim() &&
    toName.trim() &&
    letterText.trim() &&
    wordCount <= MAX_WORDS;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rose-letters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromName, toName, letterText }),
        }
      );

      if (!res.ok) throw new Error("Failed to create rose letter");
      const data = await res.json();
      const link = `${window.location.origin}/games/day1/rose-letter/${data.id}`;
      setShareLink(link);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f8] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-100 via-white to-slate-50 flex items-center justify-center p-6 font-serif">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-pink-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block p-3 bg-rose-50 rounded-2xl mb-4"
          >
            <PenTool className="text-rose-400" size={28} />
          </motion.div>
          <h1 className="text-4xl font-serif italic text-slate-800 mb-2">Compose a Rose Letter</h1>
          <p className="text-slate-500 font-sans text-sm tracking-wide uppercase">For your partner's eyes only</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-sans font-bold text-slate-400 uppercase ml-1 tracking-widest">From</label>
              <input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-5 py-4 rounded-2xl border border-rose-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-sans font-bold text-slate-400 uppercase ml-1 tracking-widest">To</label>
              <input
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Partner's Name"
                className="w-full px-5 py-4 rounded-2xl border border-rose-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-sans font-bold text-slate-400 uppercase ml-1 tracking-widest flex justify-between">
              Your Message
              <span className={wordCount > MAX_WORDS ? "text-rose-500" : "text-slate-400"}>
                {wordCount}/{MAX_WORDS}
              </span>
            </label>
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              placeholder="Start writing your heart out..."
              rows={8}
              className="w-full px-6 py-5 rounded-3xl border border-rose-100 bg-white/50 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all outline-none text-slate-700 resize-none italic text-lg leading-relaxed"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-rose-500 text-center font-sans">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {!shareLink ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              className="w-full py-5 rounded-2xl font-sans font-bold text-white bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 shadow-lg shadow-rose-200 flex items-center justify-center gap-3 disabled:opacity-50 transition-all overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Seal with a Rose</>}
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-8 bg-rose-50/50 rounded-[2rem] border-2 border-dashed border-rose-200 text-center"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Check className="text-white" />
                </div>
                <h3 className="font-sans font-bold text-rose-900 tracking-tight">Letter Sealed!</h3>
                <p className="text-xs text-rose-600 font-sans mt-1">Send this link to your partner</p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 px-5 py-3 rounded-xl border border-rose-200 bg-white text-sm font-sans text-slate-600 select-all outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-8 py-3 rounded-xl font-sans font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    copied ? "bg-emerald-500 text-white" : "bg-rose-500 text-white hover:bg-rose-600"
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);