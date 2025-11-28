import React from 'react';
import { Globe, Users, Search, Flame } from 'lucide-react';

export default function FeedHeader({ feedType, setFeedType, searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-30 py-4 bg-slate-900/80 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:static">
      
      {/* Tabs */}
      <div className="flex bg-indigo-900/30 p-1 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
        <button 
            onClick={() => setFeedType('global')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm ${feedType === 'global' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' : 'text-indigo-300 hover:text-white hover:bg-white/5'}`}
        >
            <Globe size={16}/> Global
        </button>
        <button 
            onClick={() => setFeedType('following')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm ${feedType === 'following' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' : 'text-indigo-300 hover:text-white hover:bg-white/5'}`}
        >
            <Users size={16}/> Following
        </button>
        <button 
            onClick={() => setFeedType('trending')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm ${feedType === 'trending' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' : 'text-indigo-300 hover:text-white hover:bg-white/5'}`}
        >
            <Flame size={16}/> Trending
        </button>
      </div>

      {/* Search */}
      <div className="relative group w-full md:w-64">
        <Search className="absolute left-4 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors" size={18}/>
        <input 
          type="text" 
          placeholder="Search topics..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 p-2.5 bg-indigo-900/20 border border-indigo-500/30 rounded-xl text-white outline-none focus:bg-indigo-900/40 focus:border-indigo-400 transition-all placeholder-indigo-400/50"
        />
      </div>
    </div>
  );
}