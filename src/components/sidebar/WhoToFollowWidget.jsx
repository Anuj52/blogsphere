import React, { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../AuthContext';
import { GlassCard } from '../UI';
import { Sparkles } from 'lucide-react';
import Avatar from '../Avatar';
import FollowButton from '../FollowButton';

export default function WhoToFollowWidget() {
  const { user, userData } = useAuth();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userData) return;
      const q = query(collection(db, "users"), limit(10));
      const snap = await getDocs(q);
      
      const users = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.id !== user.uid && !userData.following?.includes(u.id))
        .slice(0, 3);

      setSuggestions(users);
    };
    fetchUsers();
  }, [userData, user]);

  if (suggestions.length === 0) return null;

  return (
    <GlassCard className="bg-slate-900/60 border-indigo-500/20 backdrop-blur-xl">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles className="text-yellow-400" size={18}/> Who to Follow
      </h3>

      <div className="space-y-4">
        {suggestions.map(suggestedUser => (
            <div key={suggestedUser.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar seed={suggestedUser.username} size="sm" />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{suggestedUser.fullName}</p>
                        <p className="text-xs text-indigo-400 truncate">@{suggestedUser.username}</p>
                    </div>
                </div>
                <FollowButton 
                    targetUserId={suggestedUser.id} 
                    targetUserName={suggestedUser.fullName}
                    className="text-xs px-3 py-1"
                />
            </div>
        ))}
      </div>
    </GlassCard>
  );
}