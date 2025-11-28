import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { GlassCard } from '../UI';
import { TrendingUp, Award } from 'lucide-react';

export default function TrendingPostsWidget() {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const scoredPosts = posts.map(post => {
        const views = post.views || 0;
        const likes = post.likes ? post.likes.length : 0;
        // Simple trending score: 1 view = 1 point, 1 like = 5 points
        const score = views + likes * 5;
        return { ...post, score };
      });

      const sortedPosts = scoredPosts.sort((a, b) => b.score - a.score).slice(0, 5);
      
      setTrendingPosts(sortedPosts);
    });
    return unsubscribe;
  }, []);

  return (
    <GlassCard className="bg-slate-900/60 border-indigo-500/20 backdrop-blur-xl">
      <h3 className="font-bold text-white mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
          <TrendingUp className="text-pink-500" size={20}/> Trending Posts
      </h3>
      
      <div className="space-y-2">
          {trendingPosts.length === 0 && <p className="text-white/20 text-sm italic">No trending posts yet.</p>}
          
          {trendingPosts.map((post) => (
              <div 
                  key={post.id}
                  className="w-full flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition-all duration-200 border border-transparent hover:border-white/5"
              >
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                          <Award size={14}/>
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium text-indigo-100 group-hover:text-white truncate">
                            {post.title}
                        </p>
                        <p className="text-xs text-white/40 group-hover:text-white/60 truncate">
                            by {post.authorName || 'Anonymous'}
                        </p>
                      </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-500/20 shrink-0">
                      {post.score}
                  </span>
              </div>
          ))}
      </div>
    </GlassCard>
  );
}