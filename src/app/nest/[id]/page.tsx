"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default function NestPage() {
  const { id } = useParams();
  const [couple, setCouple] = useState<any>(null);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "couples", id as string), (doc) => {
      if (doc.exists()) {
        setCouple(doc.data());
        // Trigger animation if a new nudge comes in
        setShowNudge(true);
        setTimeout(() => setShowNudge(false), 3000);
      }
    });
    return () => unsub();
  }, [id]);

  const sendHeart = async () => {
    await updateDoc(doc(db, "couples", id as string), {
      nudge: { type: 'heart', time: serverTimestamp() }
    });
  };

  if (!couple) return <div className="h-screen flex items-center justify-center bg-rose-50 text-rose-400">✨ Entering your space...</div>;

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-between py-12 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-serif text-gray-800">{couple.userA} & {couple.userB}</h1>
        <div className="w-16 h-1 bg-rose-200 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="relative">
        <button onClick={sendHeart} className="bg-rose-100 p-12 rounded-full hover:scale-110 transition active:scale-95">
          <span className="text-7xl">💖</span>
        </button>
        {showNudge && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce text-2xl font-bold text-rose-500">
            Received!
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm italic">Tap the heart to let them know you're thinking of them.</p>
    </div>
  );
}