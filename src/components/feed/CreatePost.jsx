import React from 'react';
import { GlassCard, Button } from '../UI';
import { Plus, Sparkles } from 'lucide-react';

export default function CreatePost({ title, setTitle, content, setContent, category, setCategory, handlePost, isPosting, categories }) {
  return (
    <GlassCard className="border-indigo-500/20 bg-gradient-to-br from-white to-indigo-50 dark:from-indigo-900/20 dark:to-purple-900/10 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-yellow-500 dark:text-yellow-400" size={16} />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-200 uppercase tracking-widest">Create New Story</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            className="flex-[2] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 text-slate-900 dark:text-white outline-none font-bold placeholder-slate-400 dark:placeholder-indigo-300/30 focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 transition-all"
            placeholder="An Interesting Title..."
          />
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-indigo-950/50 text-slate-700 dark:text-indigo-100 rounded-xl px-4 py-3 outline-none border border-slate-200 dark:border-white/10 focus:border-indigo-500/50 cursor-pointer hover:bg-slate-200 dark:hover:bg-indigo-900/50 transition-colors appearance-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white min-h-[120px] font-mono text-sm outline-none focus:bg-white dark:focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder-slate-400 dark:placeholder-indigo-300/30 resize-none"
          placeholder="Share your thoughts... (Markdown supported: **bold**, # headers, - lists)"
        />
      </div>

      <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
        <Button onClick={handlePost} disabled={!title.trim() || !content.trim() || isPosting} className="shadow-lg shadow-indigo-500/20">
          <Plus size={18} /> Publish Post
        </Button>
      </div>
    </GlassCard>
  );
}