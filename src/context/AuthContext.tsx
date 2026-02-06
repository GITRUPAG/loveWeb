"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

type UserState = "GUEST" | "SOLO_LOGGED_IN" | "COUPLE_PREMIUM";

const AuthContext = createContext<{
  user: User | null;
  role: UserState;
  loading: boolean;
}>({ user: null, role: "GUEST", loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserState>("GUEST");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setRole("GUEST");
        setLoading(false);
      } else {
        // If logged in, listen to their DB document for status updates
        const unsubDoc = onSnapshot(doc(db, "users", u.uid), (doc) => {
          const data = doc.data();
          if (data?.isPaid && data?.partnerId) {
            setRole("COUPLE_PREMIUM");
          } else {
            setRole("SOLO_LOGGED_IN");
          }
          setLoading(false);
        });
        return () => unsubDoc();
      }
    });
    return () => unsubAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);