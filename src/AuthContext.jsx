import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase-config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Listen to user profile changes in real-time
        const unsubUserData = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
          setUserData(doc.exists() ? doc.data() : null);
          setLoading(false);
        }, (error) => {
          console.error("AuthContext Snapshot Error:", error);
          // If permission denied or other error, stop loading so app doesn't hang
          setUserData(null);
          setLoading(false);
        });
        return () => unsubUserData();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};