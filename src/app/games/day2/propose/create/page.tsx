"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, Sparkles, Send, CreditCard, Lock, Unlock } from "lucide-react";

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProposalResponse {
  id: string;
  unlocked: boolean;
}

export default function CreateProposalPage() {
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("romantic");
  const [ringStyle, setRingStyle] = useState("diamond");
  
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const createProposal = async () => {
    if (!fromName || !toName || !message) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromName,
            toName,
            message,
            theme,
            ringStyle,
          }),
        }
      );

      const data: ProposalResponse = await res.json();
      setProposalId(data.id);
      setIsUnlocked(data.unlocked);

      // Do NOT generate link here — backend will send correct link after payment
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Failed to create proposal:", err);
      alert("Failed to create proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!proposalId) return;

    setPaymentLoading(true);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/proposal/create-order/${proposalId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const orderData = await orderRes.json();

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Forever Proposal",
        description: `Unlock proposal for ${toName}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Step 3: Verify payment
          await verifyPayment({
            proposalId: proposalId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: fromName,
        },
        theme: {
          color: "#f43f5e",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setShowPaymentModal(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Failed to initiate payment:", err);
      alert("Failed to initiate payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/proposal/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await res.json();
      
      if (data.shareLink) {
        setShareLink(data.shareLink);
        setIsUnlocked(true);
        setShowPaymentModal(false);
      }
    } catch (err) {
      console.error("Payment verification failed:", err);
      alert("Payment verification failed. Please contact support.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const copyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setProposalId(null);
    setIsUnlocked(false);
    setShareLink(null);
    setFromName("");
    setToName("");
    setMessage("");
    setShowPaymentModal(false);
  };

  const isFormValid = fromName && toName && message;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50" />
      
      {/* Floating hearts background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Heart size={20 + Math.random() * 30} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!proposalId ? (
          // Creation Form
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(251,113,133,0.15)] rounded-[2.5rem] p-10 md:p-12 border border-white/60">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200">
                    <Heart size={32} className="text-white" fill="white" />
                  </div>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 via-pink-600 to-red-600 mb-2">
                  Forever Starts Now
                </h1>
                <p className="text-slate-500 text-sm">
                  Craft your perfect proposal moment
                </p>
              </motion.div>

              {/* Form Fields */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-5"
              >
                {/* Your Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-4">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Enter your name"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      className="w-full border-2 border-rose-100 focus:border-rose-300 rounded-2xl px-5 py-3.5 text-slate-700 placeholder:text-slate-300 transition-all focus:outline-none focus:ring-4 focus:ring-rose-100/50 bg-white/50"
                    />
                  </div>
                </div>

                {/* Partner Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-4">
                    Their Name
                  </label>
                  <div className="relative">
                    <input
                      placeholder="The love of your life"
                      value={toName}
                      onChange={(e) => setToName(e.target.value)}
                      className="w-full border-2 border-rose-100 focus:border-rose-300 rounded-2xl px-5 py-3.5 text-slate-700 placeholder:text-slate-300 transition-all focus:outline-none focus:ring-4 focus:ring-rose-100/50 bg-white/50"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold ml-4">
                    Your Proposal
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Will you marry me? Pour your heart out..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                      className="w-full border-2 border-rose-100 focus:border-rose-300 rounded-2xl px-5 py-4 h-36 resize-none text-slate-700 placeholder:text-slate-300 transition-all focus:outline-none focus:ring-4 focus:ring-rose-100/50 bg-white/50 font-serif"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-300">
                      {message.length}/500
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={createProposal}
                  disabled={loading || !isFormValid}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  className={`
                    w-full py-4 rounded-2xl font-semibold text-white text-base
                    transition-all duration-300 flex items-center justify-center gap-2
                    shadow-lg hover:shadow-xl
                    ${
                      isFormValid
                        ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600"
                        : "bg-slate-200 cursor-not-allowed"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={20} />
                      </motion.div>
                      <span>Creating Magic...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Create Proposal</span>
                    </>
                  )}
                </motion.button>

                {!isFormValid && (
                  <p className="text-xs text-center text-slate-400">
                    Fill all fields to continue
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : shareLink ? (
          // Success State - Unlocked
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg"
          >
            <div className="bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(251,113,133,0.15)] rounded-[2.5rem] p-10 md:p-12 border border-white/60 text-center space-y-6">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <Unlock size={40} className="text-white" strokeWidth={2.5} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 to-pink-600 mb-2">
                  Your Proposal is Ready! 💍
                </h2>
                <p className="text-slate-500 text-sm">
                  Share this special moment with {toName}
                </p>
              </motion.div>

              {/* Link Display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border-2 border-rose-100"
              >
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                  Your Proposal Link
                </p>
                <p className="text-rose-600 text-sm break-all font-mono bg-white/50 px-3 py-2 rounded-lg">
                  {shareLink}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <button
                  onClick={copyLink}
                  className={`
                    w-full py-4 rounded-2xl font-semibold text-white text-base
                    transition-all duration-300 flex items-center justify-center gap-2
                    shadow-lg hover:shadow-xl hover:scale-105
                    ${
                      copied
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500"
                    }
                  `}
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      <span>Copied! ❤️</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={resetForm}
                  className="w-full py-3 rounded-2xl text-slate-500 hover:text-rose-500 transition-colors text-sm"
                >
                  Create Another Proposal
                </button>
              </motion.div>

              {/* Share tip */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-slate-400 italic"
              >
                💡 Send this link through text, email, or any messenger
              </motion.p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => !paymentLoading && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              {/* Lock Icon */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200 mb-4">
                    <Lock size={40} className="text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-rose-600 to-pink-600 mb-2">
                  Unlock Your Proposal
                </h3>
                <p className="text-slate-500 text-sm">
                  Make this moment unforgettable
                </p>
              </div>

              {/* Pricing Info */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-rose-100">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-rose-600 mb-1">₹99</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">One-time unlock</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Personalized proposal page</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Shareable link for {toName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Beautiful animated experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>Forever saved moment</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={initiatePayment}
                disabled={paymentLoading}
                className="w-full py-4 rounded-2xl font-semibold text-white text-base bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Pay ₹99 & Unlock</span>
                  </>
                )}
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={paymentLoading}
                className="w-full py-3 mt-3 text-slate-400 hover:text-slate-600 transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Lock size={12} />
                  Secured by Razorpay
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}