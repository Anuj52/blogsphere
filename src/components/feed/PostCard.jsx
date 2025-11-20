import React from 'react';
import { GlassCard } from '../UI';
import { Trash2, Heart, MessageCircle, Repeat, Eye, BadgeCheck, Clock, Flame, Share2, Bookmark, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import Avatar from '../Avatar';
import toast from 'react-hot-toast';
import FollowButton from '../FollowButton';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase-config';

export default function PostCard({ post, user, userData, toggleLike, toggleRepost, deletePost, openModal, onEdit }) {
  
  const isMe = user?.uid && post?.uid && user.uid === post.uid;
  
  const likesArray = Array.isArray(post.likes) ? post.likes : [];
  const repostsArray = Array.isArray(post.reposts) ? post.reposts : [];
  const savedArray = Array.isArray(post.savedBy) ? post.savedBy : [];
  
  const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
  const viewsCount = post.views || 0;

  const isLiked = likesArray.includes(user.uid);
  const isReposted = repostsArray.includes(user.uid);
  const isSaved = savedArray.includes(user.uid);
  const isVerified = post.uid === user.uid || post.authorName === "Admin";
  const isHot = likesArray.length >= 5;

  const wordCount = post.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://blogsphere.app/post/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  // Handle Bookmark Click locally in the card
  const toggleBookmark = async (e) => {
    e.stopPropagation();
    const ref = doc(db, "posts", post.id);
    if (isSaved) {
        await updateDoc(ref, { savedBy: arrayRemove(user.uid) });
        toast("Removed from Saved", { icon: '🗑️' });
    } else {
        await updateDoc(ref, { savedBy: arrayUnion(user.uid) });
        toast.success("Saved for later");
    }
  };

  return (
    <GlassCard className={`
        transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group relative
        ${isHot ? 'border-orange-500/30 shadow-orange-500/10 bg-gradient-to-b from-slate-900/60 to-orange-900/10' : 'hover:bg-slate-800/40 border-white/5 hover:border-indigo-500/30'}
    `}>
      
      {/* Meta Row */}
      <div className="flex items-center gap-3 mb-4">
          {isReposted && <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold uppercase tracking-wider"><Repeat size={12} /> You boosted</div>}
          {isHot && <div className="flex items-center gap-1 text-xs text-orange-400 font-bold uppercase tracking-wider animate-pulse"><Flame size={12} fill="currentColor" /> Trending</div>}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar seed={post.username} size="md" />
          <div>
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-white group-hover:text-indigo-200 transition-colors">{post.authorName}</h3>
                {isVerified && <BadgeCheck size={16} className="text-blue-400 fill-blue-400/10" />}
                <FollowButton targetUserId={post.uid} targetUserName={post.authorName} className="ml-1 text-xs py-1 px-3"/>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-400/60">
              <span>@{post.username}</span>
              <span>•</span>
              <span>{post.createdAt && formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}</span>
              {post.isEdited && <span className="italic text-white/20">(edited)</span>}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        {isMe && (
          <div className="flex gap-2">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(post); }} 
                className="text-white/20 hover:text-indigo-400 p-2 transition-colors rounded-full hover:bg-indigo-500/10"
                title="Edit Post"
             >
                <Edit2 size={16} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); deletePost(post.id); }} 
                className="text-white/20 hover:text-red-400 p-2 transition-colors rounded-full hover:bg-red-500/10"
                title="Delete Post"
             >
                <Trash2 size={16} />
             </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="cursor-pointer" onClick={() => openModal(post)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
                {post.category && post.category !== "" && (
                    <span className="inline-block px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold rounded-md border border-indigo-500/20 uppercase tracking-wider">
                        {post.category}
                    </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 text-indigo-400/50 text-[10px] font-medium">
                    <Clock size={10} /> {readTime} min read
                </span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-indigo-100 transition-colors">{post.title}</h2>
          
          <div className="text-indigo-100/80 leading-relaxed mb-4 line-clamp-3 prose prose-invert prose-sm">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
      </div>
      
      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-indigo-300 text-sm">
         <div className="flex gap-6">
            <button onClick={(e) => { e.stopPropagation(); openModal(post); }} className="flex gap-2 items-center hover:text-indigo-400 transition-all hover:scale-105"><MessageCircle size={20}/> <span className="font-medium">{commentsCount}</span></button>
            <button onClick={(e) => { e.stopPropagation(); toggleRepost(post); }} className={`flex gap-2 items-center transition-all hover:scale-105 ${isReposted ? 'text-emerald-400' : 'hover:text-emerald-400'}`}><Repeat size={20}/> <span className="font-medium">{repostsArray.length}</span></button>
            <button onClick={(e) => { e.stopPropagation(); toggleLike(post); }} className={`flex gap-2 items-center transition-all hover:scale-105 ${isLiked ? 'text-pink-500' : 'hover:text-pink-400'}`}><Heart size={20} className={isLiked ? 'fill-pink-500' : ''}/> <span className="font-medium">{likesArray.length}</span></button>
         </div>

         <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-indigo-400/40 text-xs hidden sm:flex"><Eye size={14}/> <span>{viewsCount}</span></div>
             <button onClick={toggleBookmark} className={`transition-all hover:scale-110 ${isSaved ? 'text-yellow-400' : 'text-indigo-400/40 hover:text-white'}`}>
                <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
             </button>
             <button onClick={handleShare} className="text-indigo-400/40 hover:text-white transition"><Share2 size={18} /></button>
         </div>
      </div>
    </GlassCard>
  );
}