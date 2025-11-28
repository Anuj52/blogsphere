import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard, Button, SkeletonPost } from '../components/UI';

import FeedHeader from '../components/feed/FeedHeader';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import PostModal from '../components/feed/PostModal';
import EditPostModal from '../components/feed/EditPostModal';

export default function Feed() {
  const { user, userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  
  // States
  const [feedType, setFeedType] = useState("global");
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState(""); 
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const categories = ["General", "Tech", "Life", "Art", "Music", "Gaming", "Crypto"];

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (feedType === 'trending') {
      const sorted = [...posts].sort((a, b) => {
        const scoreA = (a.views || 0) + (a.likes?.length || 0) * 5;
        const scoreB = (b.views || 0) + (b.likes?.length || 0) * 5;
        return scoreB - scoreA;
      });
      setTrendingPosts(sorted);
    }
  }, [feedType, posts]);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsPosting(true);
    try {
      await addDoc(collection(db, "posts"), {
        title, content, category,
        uid: user.uid, authorName: userData.fullName, username: userData.username,
        createdAt: serverTimestamp(), 
        likes: [], comments: [], savedBy: [], 
        reposts: [], views: 0 
      });
      setTitle(""); setContent(""); setCategory("General");
    } catch (error) { console.error(error); } 
    finally { setIsPosting(false); }
  };

  const toggleRepost = async (post) => {
    const ref = doc(db, "posts", post.id);
    const hasReposted = post.reposts?.includes(user.uid);
    await updateDoc(ref, { reposts: hasReposted ? arrayRemove(user.uid) : arrayUnion(user.uid) });
  };

  const incrementView = async (postId) => {
    const ref = doc(db, "posts", postId);
    await updateDoc(ref, { views: increment(1) });
  };

  const toggleFollow = async (targetId) => {};

  const toggleLike = async (post) => {
    const ref = doc(db, "posts", post.id);
    const hasLiked = post.likes?.includes(user.uid);
    await updateDoc(ref, { likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });

    if (!hasLiked && post.uid !== user.uid) {
      await addDoc(collection(db, "notifications"), {
        toUserId: post.uid,
        fromUserId: user.uid,
        fromName: userData.fullName,
        fromUsername: userData.username,
        type: 'like',
        postId: post.id,
        postTitle: post.title,
        createdAt: serverTimestamp()
      });
    }
  };

  const deletePost = async (id) => {
    if(confirm("Delete this post?")) await deleteDoc(doc(db, "posts", id));
  };

  const handleComment = async (postId, postOwnerId) => {
    if (!commentText.trim()) return;
    const newComment = { 
        text: commentText, username: userData.username, uid: user.uid, createdAt: new Date().toISOString() 
    };
    await updateDoc(doc(db, "posts", postId), { comments: arrayUnion(newComment) });
    
    if (postOwnerId && postOwnerId !== user.uid) {
      const postTitle = posts.find(p => p.id === postId)?.title || "a post";
      await addDoc(collection(db, "notifications"), {
        toUserId: postOwnerId,
        fromUserId: user.uid,
        fromName: userData.fullName,
        fromUsername: userData.username,
        type: 'comment',
        postId: postId,
        postTitle: postTitle,
        createdAt: serverTimestamp()
      });
    }
    setCommentText("");
  };

  const openModal = (id) => {
    setSelectedPostId(id);
    incrementView(id); 
  };

  const postsToDisplay = feedType === 'trending' ? trendingPosts : posts;

  const filteredPosts = postsToDisplay.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || post.content?.toLowerCase().includes(searchTerm.toLowerCase()) || post.category?.toLowerCase().includes(searchTerm.toLowerCase());
    if (feedType === 'following') {
        return matchesSearch && (userData?.following || []).includes(post.uid);
    }
    return matchesSearch;
  });

  const activePost = posts.find(p => p.id === selectedPostId);

  return (
    // REMOVED GRID. JUST A CONTAINER NOW.
    <div className="animate-fade-in-up relative max-w-3xl mx-auto w-full">
        
        <div className="p-4 md:p-6 space-y-6 pb-32">
            <FeedHeader 
                feedType={feedType} setFeedType={setFeedType} 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
            />
            <CreatePost 
                title={title} setTitle={setTitle}
                content={content} setContent={setContent}
                category={category} setCategory={setCategory}
                handlePost={handlePost} isPosting={isPosting}
                categories={categories}
            />
            
            <div className="space-y-5">
                {isLoading && <><SkeletonPost /><SkeletonPost /></>}
                {!isLoading && filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-white/30 italic">
                        {feedType === 'following' ? "Your timeline is empty." : "No posts found."}
                    </div>
                )}
                {!isLoading && filteredPosts.map(post => (
                <PostCard 
                    key={post.id} post={post} user={user} userData={userData} 
                    toggleLike={toggleLike} toggleFollow={toggleFollow} 
                    toggleRepost={toggleRepost} 
                    deletePost={deletePost}
                    openModal={() => openModal(post.id)} 
                    onEdit={setEditingPost}
                />
                ))}
            </div>
        </div>

        {/* REMOVED THE RIGHT SIDEBAR COLUMN FROM HERE (It's in Layout now) */}

        <PostModal 
            post={activePost}
            close={() => setSelectedPostId(null)}
            commentText={commentText}
            setCommentText={setCommentText}
            handleComment={handleComment}
        />

        <EditPostModal 
            post={editingPost} 
            onClose={() => setEditingPost(null)} 
        />
    </div>
  );
}