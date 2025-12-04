import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { Search, Loader2 } from 'lucide-react';
import Avatar from '../Avatar';
import FollowButton from '../FollowButton';
import { Link } from 'react-router-dom';

export default function UserSearchWidget() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchUsers = async () => {
            if (!searchTerm.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                // Simple search by username (prefix match simulation)
                // Note: Firestore doesn't support native full-text search. 
                // We'll use a simple query for exact/prefix matches on username or fullName.
                // For production, Algolia is recommended.

                const usersRef = collection(db, "users");
                const q = query(
                    usersRef,
                    where("username", ">=", searchTerm),
                    where("username", "<=", searchTerm + '\uf8ff'),
                    limit(5)
                );

                const snap = await getDocs(q);
                setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <div className="bg-white/60 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 transition-colors duration-300">
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                <Search size={18} className="text-indigo-500 dark:text-indigo-400" /> Find People
            </h3>

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors placeholder-slate-400 dark:placeholder-indigo-400/50"
                />
                {loading && <Loader2 size={16} className="absolute right-3 top-2.5 text-indigo-500 dark:text-indigo-400 animate-spin" />}
            </div>

            <div className="space-y-3">
                {results.map(user => (
                    <div key={user.id} className="flex items-center justify-between group">
                        <Link to={`/profile/${user.id}`} className="flex items-center gap-3 min-w-0">
                            <Avatar seed={user.username} src={user.photoURL} size="sm" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">{user.fullName}</p>
                                <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                            </div>
                        </Link>
                        <FollowButton targetUserId={user.id} targetUserName={user.fullName} className="text-[10px] px-2 py-1 h-auto" />
                    </div>
                ))}

                {searchTerm && !loading && results.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-2">No users found.</p>
                )}
            </div>
        </div>
    );
}
