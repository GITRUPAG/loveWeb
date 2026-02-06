"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ChocolateSyncResult() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chocolate-sync/${id}`
      );
      const data = await res.json();
      setSession(data);
      setLoading(false);
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-xl">Calculating compatibility…</p>
      </div>
    );
  }

  const score = session.compatibilityScore || 0;

  const getMessage = () => {
    if (score === 100) return "We literally act at the same moment.";
    if (score >= 90) return "You two just click naturally.";
    if (score >= 70) return "Your timing is adorable.";
    if (score >= 40) return "Still learning each other 😄";
    return "Opposites attract… probably 😂";
  };

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "Our Chocolate Compatibility 🍫",
        text: `We scored ${score}% — can you beat us?`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center text-center px-6">

      {/* BREAK ANIMATION */}
      <div className="relative mb-10">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: -80, rotate: -10 }}
          transition={{ duration: 0.7 }}
          className="text-7xl absolute"
        >
          🍫
        </motion.div>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 80, rotate: 10 }}
          transition={{ duration: 0.7 }}
          className="text-7xl"
        >
          🍫
        </motion.div>
      </div>

      {/* SCORE */}
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="text-6xl font-bold text-amber-700 mb-4"
      >
        {score}%
      </motion.h1>

      <p className="text-xl text-amber-800 mb-10">
        {getMessage()}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/games/day3/chocolate-sync")}
          className="bg-amber-700 text-white px-6 py-3 rounded-xl"
        >
          Play Again
        </button>

        <button
          onClick={share}
          className="bg-white border px-6 py-3 rounded-xl"
        >
          Share
        </button>
      </div>

    </div>
  );
}
