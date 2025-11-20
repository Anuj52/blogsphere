import React from 'react';
import { GlassCard } from '../UI';
import { TrendingUp, Hash } from 'lucide-react';

export default function TrendingSidebar({ posts, setSearchTerm }) {
  const categories = posts.map(p => p.category || "General");
  const counts = categories.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  const trending = Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <GlassCard className="bg-slate-900/60 border-indigo-500/20 backdrop-blur-xl">
      <h3 className="font-bold text-white mb-5 flex items-center gap-2 border-b border-white/5 pb-3">
          <TrendingUp className="text-pink-500" size={20}/> Trending Topics
      </h3>
      
      <div className="space-y-2">
          {trending.length === 0 && <p className="text-white/20 text-sm italic">No trends yet.</p>}
          
          {trending.map(([cat, count]) => (
              <button 
                  key={cat}
                  onClick={() => setSearchTerm(cat)} 
                  className="w-full flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition-all duration-200 border border-transparent hover:border-white/5"
              >
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                          <Hash size={14}/>
                      </div>
                      <span className="text-sm font-medium text-indigo-100 group-hover:text-white truncate">
                          {cat}
                      </span>
                  </div>
                  
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-500/20 shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                      {count}
                  </span>
              </button>
          ))}
      </div>
    </GlassCard>
  );
}