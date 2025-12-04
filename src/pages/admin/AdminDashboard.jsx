import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/UI';
import { Users, FileText, Clock, ChevronRight, Activity, Shield } from 'lucide-react';
import Avatar from '../../components/Avatar';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [pendingPostsCount, setPendingPostsCount] = useState(0);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentPendingPosts, setRecentPendingPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Counts
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            setUserCount(userSnapshot.size);

            const postsCollection = collection(db, 'posts');
            const postSnapshot = await getDocs(postsCollection);
            setPostCount(postSnapshot.size);

            const pendingPostsQuery = query(postsCollection, where('status', '==', 'pending'));
            const pendingPostSnapshot = await getDocs(pendingPostsQuery);
            setPendingPostsCount(pendingPostSnapshot.size);

            // Recent Users
            const recentUsersQuery = query(usersCollection, orderBy('createdAt', 'desc'), limit(5));
            const recentUserSnapshot = await getDocs(recentUsersQuery);
            setRecentUsers(recentUserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Recent Pending Posts
            const recentPendingQuery = query(postsCollection, where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(5));
            const recentPendingSnapshot = await getDocs(recentPendingQuery);
            setRecentPendingPosts(recentPendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchData();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <GlassCard className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                {icon}
            </div>
            <div className="relative z-10">
                <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-200 uppercase tracking-wider mb-1">{title}</h2>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{value}</p>
            </div>
        </GlassCard>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 p-4 md:p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-500 dark:text-indigo-400">
                    <Shield size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-indigo-500 dark:text-indigo-300">Overview of platform activity</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value={userCount} icon={<Users size={100} />} color="text-blue-500" />
                <StatCard title="Total Posts" value={postCount} icon={<FileText size={100} />} color="text-emerald-500" />
                <StatCard title="Pending Approvals" value={pendingPostsCount} icon={<Clock size={100} />} color="text-orange-500" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <GlassCard>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Activity size={20} className="text-indigo-500 dark:text-indigo-400" /> New Users</h2>
                        <Link to="/admin/users" className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white flex items-center gap-1 transition-colors">View All <ChevronRight size={14} /></Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map(user => (
                            <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                <Avatar seed={user.username} src={user.photoURL} size="sm" />
                                <div className="overflow-hidden">
                                    <p className="text-slate-900 dark:text-white font-bold text-sm truncate">{user.fullName || user.displayName}</p>
                                    <p className="text-indigo-500/60 dark:text-indigo-300/60 text-xs truncate">{user.email}</p>
                                </div>
                            </div>
                        ))}
                        {recentUsers.length === 0 && <p className="text-center text-slate-400 dark:text-white/20 py-4">No recent users.</p>}
                    </div>
                </GlassCard>

                {/* Recent Pending Posts */}
                <GlassCard>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Clock size={20} className="text-orange-500 dark:text-orange-400" /> Pending Posts</h2>
                        <Link to="/admin/blogs" className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white flex items-center gap-1 transition-colors">View All <ChevronRight size={14} /></Link>
                    </div>
                    <div className="space-y-4">
                        {recentPendingPosts.map(post => (
                            <div key={post.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-lg">
                                        <FileText size={18} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-slate-900 dark:text-white font-bold text-sm truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">{post.title}</p>
                                        <p className="text-indigo-500/60 dark:text-indigo-300/60 text-xs truncate">by {post.authorName}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-400 dark:text-white/30">{post.createdAt?.toDate().toLocaleDateString()}</span>
                            </div>
                        ))}
                        {recentPendingPosts.length === 0 && <p className="text-center text-slate-400 dark:text-white/20 py-4">No pending posts.</p>}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AdminDashboard;
