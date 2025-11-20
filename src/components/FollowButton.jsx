import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

export default function FollowButton({ targetUserId, targetUserName, className = "" }) {
  const { user, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isFollowing = userData?.following?.includes(targetUserId);
  if (user?.uid === targetUserId) return null;

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const currentUserRef = doc(db, "users", user.uid);
      
      if (isFollowing) {
        await updateDoc(currentUserRef, { following: arrayRemove(targetUserId) });
        toast(`Unfollowed ${targetUserName}`, { icon: '👋' });
      } else {
        await updateDoc(currentUserRef, { following: arrayUnion(targetUserId) });
        
        // FIXED: Added fromUsername
        await addDoc(collection(db, "notifications"), {
          toUserId: targetUserId,
          fromUserId: user.uid,
          fromName: userData.fullName,
          fromUsername: userData.username, // <--- ADDED THIS
          type: 'follow',
          createdAt: serverTimestamp()
        });
        
        toast.success(`Following ${targetUserName}`);
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles = `px-4 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${className}`;
  const followStyles = "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20";
  const followingStyles = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";

  return (
    <button onClick={handleFollow} disabled={isLoading} className={`${baseStyles} ${isFollowing ? followingStyles : followStyles}`}>
      {isLoading ? "..." : (isFollowing ? "Following" : "Follow")}
    </button>
  );
}