"use client";
import { useState } from 'react';
import { db } from '@/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { Heart, Copy, Check } from 'lucide-react';

export default function SetupPage() {
  const [details, setDetails] = useState({ userA: '', userB: '', pin: '' });
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    const coupleId = nanoid(10);
    await setDoc(doc(db, "couples", coupleId), {
      ...details,
      createdAt: serverTimestamp(),
      nudge: { type: '', time: null }
    });
    setLink(`${window.location.origin}/nest/${coupleId}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-6 text-black">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-rose-100">
        <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">Love Nest Setup</h1>
        
        {!link ? (
          <div className="flex flex-col gap-5">
            <input className="p-4 bg-rose-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none" placeholder="Your Name" onChange={e => setDetails({...details, userA: e.target.value})} />
            <input className="p-4 bg-rose-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none" placeholder="Partner's Name" onChange={e => setDetails({...details, userB: e.target.value})} />
            <input className="p-4 bg-rose-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-400 outline-none" type="password" maxLength={4} placeholder="4-Digit Secret PIN" onChange={e => setDetails({...details, pin: e.target.value})} />
            <button onClick={handleCreate} className="bg-rose-500 text-white py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95">
              Pay ₹99 & Get Link
            </button>
          </div>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 text-green-700 p-4 rounded-2xl mb-6 font-semibold flex items-center justify-center gap-2">
              <Heart className="fill-green-700 w-5 h-5" /> Space Created!
            </div>
            <p className="text-sm text-gray-500 mb-2 font-medium">Share this magic link:</p>
            <div className="bg-rose-50 p-4 rounded-2xl flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono text-rose-600 truncate">{link}</span>
              <button onClick={copyToClipboard} className="p-2 hover:bg-rose-100 rounded-lg transition">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-rose-500" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">Partner needs PIN: <span className="font-bold text-gray-600">{details.pin}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}