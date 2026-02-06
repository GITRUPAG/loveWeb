"use client";
import { useAuth } from '@/context/AuthContext';

export default function InvitePartnerModal() {
  const { user } = useAuth();

  const handlePayment = async () => {
    // 1. Trigger Razorpay
    // 2. On Success: Create 'couple' document in Firestore
    // 3. Link current user UID to that couple document
  };

  return (
    <div className="p-8 bg-white rounded-t-[32px] shadow-2xl border-t-4 border-rose-500">
      <h2 className="text-2xl font-bold text-gray-800">Ready to Invite Them? 💌</h2>
      <ul className="my-6 space-y-3 text-gray-600">
        <li className="flex items-center gap-2">✅ Play Shared Games</li>
        <li className="flex items-center gap-2">✅ Create a Love Timeline</li>
        <li className="flex items-center gap-2">✅ Your Own Valentine Page</li>
      </ul>
      
      <button 
        onClick={handlePayment}
        className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
      >
        Unlock Couple Space — ₹99
      </button>
      <p className="text-center text-xs text-gray-400 mt-4">Partner joins for FREE</p>
    </div>
  );
}