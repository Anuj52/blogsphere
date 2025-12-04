import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard } from '../components/UI';
import { Bookmark } from 'lucide-react';

export default function Saved() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    // Query posts where the 'savedBy' array contains the current user's ID
    const q = query(collection(db, "posts"), where("savedBy", "array-contains", user.uid));

    return onSnapshot(q, (snap) => {
      setSavedPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-600 dark:text-yellow-400">
          <Bookmark size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Stories</h2>
      </div>

      {savedPosts.length === 0 && (
        <div className="text-center py-20">
          <Bookmark size={48} className="mx-auto text-slate-300 dark:text-white/20 mb-4" />
          <p className="text-slate-500 dark:text-white/30">You haven't bookmarked anything yet.</p>
        </div>
      )}

      {savedPosts.map(post => (
        <GlassCard key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
          <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] rounded-md mb-2 uppercase tracking-wider border border-indigo-200 dark:border-transparent">
            {post.category || "General"}
          </span>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{post.title}</h3>
          <p className="text-slate-600 dark:text-indigo-100/80 line-clamp-2 mb-4">{post.content}</p>
          <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400">
            <span>By @{post.username}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}