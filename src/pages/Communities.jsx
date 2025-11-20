import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard, Button } from '../components/UI';
import { Users, Plus, Search, Trash2, Crown, MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function Communities() {
  const { user, userData } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // If set, we show Chat Room
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dummy = useRef();

  // Load Communities
  useEffect(() => {
    return onSnapshot(collection(db, "communities"), (snap) => 
      setCommunities(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  // Load Chat Messages when a community is opened
  useEffect(() => {
    if (!activeChat) return;
    // Messages are stored in a subcollection: communities/{id}/messages
    const q = query(collection(db, `communities/${activeChat.id}/messages`), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
        setMessages(snap.docs.map(d => d.data()));
        dummy.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [activeChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, `communities/${activeChat.id}/messages`), {
      text: newMessage,
      uid: user.uid,
      username: userData.username,
      createdAt: serverTimestamp()
    });
    setNewMessage("");
  };

  // --- RENDER CHAT ROOM ---
  if (activeChat) {
    return (
      <div className="h-[80vh] flex flex-col animate-fade-in-up">
        {/* Chat Header */}
        <GlassCard className="mb-4 flex items-center gap-4 py-4">
            <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/10 rounded-full transition">
                <ArrowLeft className="text-white"/>
            </button>
            <div>
                <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
                <span className="text-xs text-indigo-300">Community Chat</span>
            </div>
        </GlassCard>

        {/* Chat Messages Area */}
        <GlassCard className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 relative">
            {messages.length === 0 && <div className="text-center text-white/20 mt-10">Start the conversation...</div>}
            
            {messages.map((msg, idx) => {
                const isMe = msg.uid === user.uid;
                return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-indigo-300 mb-1 px-1">{msg.username}</span>
                        <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isMe ? 'bg-indigo-600 text-white' : 'bg-white/10 text-indigo-100'}`}>
                            {msg.text}
                        </div>
                    </div>
                )
            })}
            <span ref={dummy}></span>
        </GlassCard>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-2">
            <input 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                className="flex-1 p-4 bg-slate-900/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500"
                placeholder={`Message #${activeChat.name}...`}
            />
            <Button type="submit" className="px-6"><Send size={20}/></Button>
        </form>
      </div>
    );
  }

  // --- RENDER COMMUNITIES LIST (Normal View) ---
  // (Keep your existing Render Logic here, just update the "Join" button to "Chat" button)
  
  // Shortened for brevity - Insert your existing return logic below, 
  // but add this Button to the cards:
  
  return (
      <div className="space-y-6 pb-20">
          <h2 className="text-3xl font-bold text-white mb-6">Tribes</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {communities.map(c => {
                const isMember = c.members?.includes(user.uid);
                return (
                    <GlassCard key={c.id} className="relative group hover:border-indigo-500/50 transition">
                        <h3 className="font-bold text-xl text-white mb-2">{c.name}</h3>
                        <p className="text-indigo-200 text-sm mb-4">{c.members?.length || 0} members</p>
                        
                        <div className="flex gap-2">
                           {/* JOIN TOGGLE */}
                           <Button 
                             variant="secondary" 
                             onClick={() => {/* Toggle Join Logic */}}
                             className="flex-1"
                           >
                             {isMember ? "Leave" : "Join"}
                           </Button>

                           {/* CHAT BUTTON - Only if Member */}
                           {isMember && (
                               <Button onClick={() => setActiveChat(c)} className="flex-1 bg-indigo-600">
                                   <MessageSquare size={18} /> Chat
                               </Button>
                           )}
                        </div>
                    </GlassCard>
                )
            })}
          </div>
      </div>
  );
}