import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { GlassCard } from '../components/UI';
import { MapPin, Edit2, Save, X, LayoutGrid, Heart, Trophy, Star, Pin } from 'lucide-react';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import PostCard from '../components/feed/PostCard';
import Avatar from '../components/Avatar';
import toast from 'react-hot-toast';

export default function Profile() {
  const { userData, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", bio: "", location: "" });
  const [myPosts, setMyPosts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const fetchMyPosts = async () => {
        if(!user) return;
        const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const posts = snap.docs.map(d => ({id: d.id, ...d.data()}));
        setMyPosts(posts);
        const likes = posts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
        setTotalLikes(likes);
    };
    fetchMyPosts();
  }, [user]);

  // Logic to Pin/Unpin a post
  const togglePin = async (postId) => {
    const newPinnedId = userData?.pinnedPostId === postId ? null : postId; // Toggle
    await updateDoc(doc(db, "users", user.uid), { pinnedPostId: newPinnedId });
    toast.success(newPinnedId ? "Post Pinned!" : "Post Unpinned");
  };

  const handleSave = async () => {
    await updateDoc(doc(db, "users", user.uid), editForm);
    setIsEditing(false);
  };

  React.useEffect(() => { if (userData) setEditForm(userData); }, [userData]);

  // Sort posts: Pinned post comes first!
  const sortedPosts = [...myPosts].sort((a, b) => {
    if (a.id === userData?.pinnedPostId) return -1;
    if (b.id === userData?.pinnedPostId) return 1;
    return 0;
  });

  // Rank Logic
  let rank = "Rookie";
  let rankColor = "text-gray-400";
  if (totalLikes > 5) { rank = "Rising Star"; rankColor = "text-indigo-400"; }
  if (totalLikes > 20) { rank = "Influencer"; rankColor = "text-pink-400"; }
  if (totalLikes > 50) { rank = "Legend"; rankColor = "text-yellow-400"; }

  return (
    <div className="max-w-4xl mx-auto pb-20">
        <div className="relative mb-8">
            <div className="h-48 rounded-t-2xl bg-gradient-to-r from-indigo-900 to-purple-900 w-full absolute top-0 left-0 -z-10 border-x border-t border-white/10"></div>
            
            <GlassCard className="mt-32 pt-0 border-t-0 text-center relative overflow-visible">
                <div className="absolute top-4 right-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><X size={18}/></button>
                      <button onClick={handleSave} className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Save size={18}/></button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20"><Edit2 size={18}/></button>
                  )}
                </div>

                <div className="-mt-16 mb-4 relative inline-block">
                   <Avatar seed={userData?.username} size="xl" className="shadow-2xl ring-4 ring-slate-900" />
                   <div className="absolute bottom-0 right-0 bg-slate-900 rounded-full p-1">
                      <div className="bg-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/10">Lvl {Math.floor(totalLikes / 5) + 1}</div>
                   </div>
                </div>

                {isEditing ? (
                   <div className="space-y-3 max-w-sm mx-auto">
                    <input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-center font-bold text-xl text-white" />
                    <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-white text-sm" rows="3" />
                    <input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full p-2 bg-white/5 border border-white/10 rounded text-center text-sm text-white" placeholder="Location" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                        {userData?.fullName} 
                        {rank === "Legend" && <Trophy size={24} className="text-yellow-400" fill="currentColor"/>}
                    </h2>
                    <p className={`font-bold text-sm mb-1 flex items-center justify-center gap-1 ${rankColor}`}><Star size={12} fill="currentColor" /> {rank}</p>
                    <p className="text-indigo-400/60 font-medium mb-4 text-sm">@{userData?.username}</p>
                    <p className="text-indigo-100 max-w-md mx-auto mb-6 leading-relaxed">{userData?.bio || "No bio yet."}</p>
                    
                    <div className="flex justify-center gap-8 mb-6 border-y border-white/10 py-4">
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{userData?.communities?.length || 0}</div>
                            <div className="text-xs text-indigo-300">Tribes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{userData?.following?.length || 0}</div>
                            <div className="text-xs text-indigo-300">Following</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-white">{totalLikes}</div>
                            <div className="text-xs text-indigo-300">Reputation</div>
                        </div>
                    </div>
                  </>
                )}
            </GlassCard>
        </div>

        <div className="flex gap-4 mb-6 border-b border-white/10 pb-2 px-4">
            <button className={`pb-2 text-sm font-bold flex items-center gap-2 transition text-white border-b-2 border-indigo-500`}>
                <LayoutGrid size={16}/> My Posts
            </button>
        </div>

        <div className="space-y-4">
            {sortedPosts.length === 0 && <p className="text-center text-white/20 py-10">You haven't posted anything yet.</p>}
            
            {sortedPosts.map(post => {
                const isPinned = post.id === userData?.pinnedPostId;
                return (
                    <div key={post.id} className="relative group">
                        {isPinned && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                <Pin size={12} fill="currentColor" /> Pinned Post
                            </div>
                        )}
                        
                        <div className="relative">
                             {/* PIN ACTION BUTTON */}
                            <button 
                                onClick={() => togglePin(post.id)}
                                className={`absolute top-4 right-14 p-2 rounded-full transition z-20 ${isPinned ? 'text-indigo-400 bg-indigo-500/20' : 'text-white/20 hover:text-indigo-400 hover:bg-white/10'}`}
                                title={isPinned ? "Unpin Post" : "Pin to Profile"}
                            >
                                <Pin size={18} fill={isPinned ? "currentColor" : "none"} />
                            </button>

                            <PostCard 
                                post={post} 
                                user={user} 
                                userData={userData}
                                toggleLike={() => {}} 
                                toggleFollow={() => {}}
                                deletePost={() => {}} // Disabled delete in profile view for safety/simplicity
                                openModal={() => {}}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}