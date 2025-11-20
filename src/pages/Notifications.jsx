import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard, Button } from '../components/UI';
import { Heart, MessageCircle, Bell, UserPlus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../components/Avatar';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"), 
      where("toUserId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snap) => {
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [user]);

  const clearNotifications = async () => {
    if(!confirm("Clear all notifications?")) return;
    notifications.forEach(async (n) => {
        await deleteDoc(doc(db, "notifications", n.id));
    });
  };

  // Helper to get icon based on type
  const getIcon = (type) => {
    switch(type) {
        case 'like': return <Heart size={16} className="text-white fill-white" />;
        case 'comment': return <MessageCircle size={16} className="text-white fill-white" />;
        case 'follow': return <UserPlus size={16} className="text-white" />;
        default: return <Bell size={16} className="text-white" />;
    }
  };

  // Helper to get color based on type
  const getColor = (type) => {
    switch(type) {
        case 'like': return 'bg-pink-500 shadow-pink-500/40';
        case 'comment': return 'bg-indigo-500 shadow-indigo-500/40';
        case 'follow': return 'bg-emerald-500 shadow-emerald-500/40';
        default: return 'bg-slate-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4 px-2">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 shadow-lg shadow-indigo-900/20">
                <Bell size={28} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
                <p className="text-indigo-300/60 text-sm">Stay updated with your tribe</p>
            </div>
        </div>
        
        {notifications.length > 0 && (
            <button 
                onClick={clearNotifications}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Clear All"
            >
                <Trash2 size={20}/>
            </button>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell size={32} className="text-slate-600" />
            </div>
            <p className="text-white/30 text-lg">No updates yet.</p>
            <p className="text-white/10 text-sm">It's quiet... too quiet.</p>
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
          {notifications.map(notif => (
            <GlassCard key={notif.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/60 transition-all duration-200 border-l-[3px] border-l-transparent hover:border-l-indigo-500 group">
               
               {/* Icon Badge */}
               <div className="relative">
                   <Avatar seed={notif.fromUsername || notif.fromName} size="md" />
                   <div className={`absolute -bottom-1 -right-1 p-1 rounded-full shadow-lg ${getColor(notif.type)} border border-slate-900`}>
                      {getIcon(notif.type)}
                   </div>
               </div>

               {/* Content */}
               <div className="flex-1 min-w-0">
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    <span className="font-bold text-white">{notif.fromName}</span> 
                    <span className="text-indigo-300">
                        {notif.type === 'like' && ' liked your post'}
                        {notif.type === 'comment' && ' commented on your post'}
                        {notif.type === 'follow' && ' started following you'}
                    </span>
                    {notif.postTitle && (
                        <span className="text-white/60 italic"> "{notif.postTitle}"</span>
                    )}
                  </p>
                  <p className="text-xs text-indigo-400/50 mt-1">
                    {notif.createdAt && formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                  </p>
               </div>

               {/* Indicator Dot (Visual Flair) */}
               <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </GlassCard>
          ))}
      </div>
    </div>
  );
}