import React from 'react';
import { X, Send, MessageCircle, Heart, Repeat, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Avatar from '../Avatar';
import { formatDistanceToNow } from 'date-fns';
import Modal from '../modal/Modal'; // <--- Import the new Portal Wrapper

export default function PostModal({ post, close, commentText, setCommentText, handleComment }) {
  
  // Calculate stats
  const wordCount = post?.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  // Custom Header for the Post
  const PostHeader = () => (
    <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
            <Avatar seed={post.username} size="md" />
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{post.authorName}</span>
                    <span className="text-xs text-indigo-400">@{post.username}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-500">
                        {post.createdAt && formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
                    </span>
                </div>
            </div>
        </div>
        <button onClick={close} className="p-2 hover:bg-white/10 rounded-full text-white transition"><X size={20} /></button>
    </div>
  );

  return (
    // Use the Portal Modal - It handles centering and overlay
    <Modal isOpen={!!post} onClose={close}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-slate-900/95 backdrop-blur sticky top-0 z-10 shrink-0">
            <PostHeader />
        </div>

        {/* SCROLLABLE CONTENT (Only this part scrolls) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
            
            {/* POST BODY */}
            <div className="p-6 border-b border-white/5">
                <div className="flex gap-2 mb-4">
                    {post?.category && (
                        <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded border border-indigo-500/30 uppercase tracking-wider">
                            {post.category}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-slate-500 text-[10px] font-medium">
                        <Clock size={10} /> {readTime} min read
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 leading-tight">{post?.title}</h2>
                <div className="text-slate-300 leading-relaxed text-lg prose prose-invert max-w-none">
                    <ReactMarkdown>{post?.content}</ReactMarkdown>
                </div>

                <div className="flex gap-6 mt-6 pt-4 border-t border-white/5 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={18} /> <span>{post?.comments?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Repeat size={18} /> <span>{post?.reposts?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart size={18} className="text-pink-500/50" /> <span>{post?.likes?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="p-6 bg-slate-950/30 min-h-[200px]">
                <div className="space-y-6">
                    {!post?.comments?.length && (
                        <div className="text-center py-8">
                            <p className="text-slate-500 italic text-sm">No comments yet. Be the first.</p>
                        </div>
                    )}
                    
                    {post?.comments?.map((c, i) => (
                        <div key={i} className="flex gap-3">
                            <Avatar seed={c.username} size="sm" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-200">@{c.username}</span>
                                    <span className="text-[10px] text-slate-500">
                                        {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Just now'}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* FOOTER INPUT (Fixed to bottom of modal) */}
        <div className="p-4 border-t border-white/10 bg-slate-900 z-20 shrink-0">
            <div className="flex gap-3 items-center bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-colors">
                <input 
                    value={commentText} onChange={(e) => setCommentText(e.target.value)} 
                    placeholder="Write a thoughtful reply..." 
                    className="flex-1 bg-transparent px-4 text-white text-sm outline-none placeholder-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post?.id, post?.uid)}
                    autoFocus
                />
                <button 
                    onClick={() => handleComment(post?.id, post?.uid)} 
                    disabled={!commentText.trim()}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl text-white transition shadow-lg"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    </Modal>
  );
}