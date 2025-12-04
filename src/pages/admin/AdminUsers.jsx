import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { collection, getDocs, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { GlassCard, Button } from '../../components/UI';
import { Trash2, Search, Shield, AlertTriangle } from 'lucide-react';
import Avatar from '../../components/Avatar';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        setFilteredUsers(users.filter(u =>
            u.fullName?.toLowerCase().includes(lower) ||
            u.username?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower)
        ));
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const snap = await getDocs(collection(db, 'users'));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete @${username}? This will delete their profile AND all their posts. This cannot be undone.`)) return;

        const toastId = toast.loading("Deleting user and posts...");

        try {
            // 1. Delete all posts by this user
            const postsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
            const postsSnap = await getDocs(postsQuery);

            const batch = writeBatch(db);
            postsSnap.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // 2. Delete the user document
            batch.delete(doc(db, 'users', userId));

            await batch.commit();

            setUsers(prev => prev.filter(u => u.id !== userId));
            toast.success(`User @${username} and ${postsSnap.size} posts deleted`, { id: toastId });

        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user", { id: toastId });
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 p-4 md:p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-500 dark:text-indigo-400">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                        <p className="text-indigo-500 dark:text-indigo-300">Manage all registered users</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <p className="text-center text-slate-500">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-slate-500">No users found.</p>
                ) : (
                    filteredUsers.map(user => (
                        <GlassCard key={user.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <Avatar seed={user.username} src={user.photoURL} size="md" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{user.fullName}</h3>
                                        {user.role === 'admin' && (
                                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right mr-4 hidden md:block">
                                    <p className="text-xs text-slate-400">Joined</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                    className="p-2"
                                    title="Delete User & Posts"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
