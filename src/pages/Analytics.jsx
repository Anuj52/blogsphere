import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard } from '../components/UI';
import { BarChart2, Eye, Heart, BookOpen, FileText, MessageSquare, Repeat } from 'lucide-react';

// Simple word count function
const countWords = (text = '') => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Estimated read time in minutes
const calculateReadTime = (wordCount) => {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function Analytics() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalReposts: 0,
    totalReadTime: 0,
  });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const userPosts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);

      // Calculate aggregate stats
      let totalViews = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let totalReposts = 0;
      let totalReadTime = 0;

      userPosts.forEach(post => {
        totalViews += post.views || 0;
        totalLikes += post.likes ? post.likes.length : 0;
        totalComments += post.comments ? post.comments.length : 0;
        totalReposts += post.reposts ? post.reposts.length : 0;
        const wordCount = countWords(post.content);
        totalReadTime += calculateReadTime(wordCount);
      });

      setStats({
        totalPosts: userPosts.length,
        totalViews,
        totalLikes,
        totalComments,
        totalReposts,
        totalReadTime
      });
    });

    return unsubscribe;
  }, [user]);

  const StatCard = ({ icon, label, value, color }) => (
    <GlassCard className={`bg-white/60 dark:bg-slate-900/60 border-${color}-500/20 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center`}>
      <div className={`p-3 bg-${color}-500/10 rounded-full mb-4 text-${color}-600 dark:text-${color}-400`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className={`text-sm font-medium text-slate-500 dark:text-white/50`}>{label}</p>
    </GlassCard>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 text-slate-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><BarChart2 size={28} /> Author Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FileText />} label="Total Posts" value={stats.totalPosts} color="indigo" />
        <StatCard icon={<Eye />} label="Total Views" value={stats.totalViews} color="cyan" />
        <StatCard icon={<Heart />} label="Total Likes" value={stats.totalLikes} color="pink" />
        <StatCard icon={<MessageSquare />} label="Total Comments" value={stats.totalComments} color="yellow" />
        <StatCard icon={<Repeat />} label="Total Reposts" value={stats.totalReposts} color="green" />
        <StatCard icon={<BookOpen />} label="Est. Read Time (min)" value={stats.totalReadTime} color="emerald" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <GlassCard key={post.id} className="bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-indigo-500/20 p-4 flex justify-between items-center">
              <p className="font-semibold truncate text-slate-900 dark:text-white">{post.title}</p>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-white/80">
                <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views || 0}</span>
                <span className="flex items-center gap-1.5"><Heart size={14} /> {post.likes ? post.likes.length : 0}</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.comments ? post.comments.length : 0}</span>
                <span className="flex items-center gap-1.5"><Repeat size={14} /> {post.reposts ? post.reposts.length : 0}</span>
                <span className="flex items-center gap-1.5"><BookOpen size={14} /> {calculateReadTime(countWords(post.content))} min read</span>
              </div>
            </GlassCard>
          ))
        ) : (
          <p className="text-slate-500 dark:text-white/50">You haven't written any posts yet.</p>
        )}
      </div>
    </div>
  );
}
