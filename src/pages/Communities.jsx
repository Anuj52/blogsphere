import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard, Button } from '../components/UI';
import { Users, Plus, Search, Trash2, Crown, MessageSquare, ArrowLeft, Send, Lock, Unlock, Settings, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Communities() {
  const { user, userData } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityPrivacy, setNewCommunityPrivacy] = useState("public"); // 'public' | 'private'
  const [newCommunityCode, setNewCommunityCode] = useState("");

  // Join Private Tribe State
  const [joinModal, setJoinModal] = useState({ isOpen: false, community: null });
  const [joinCodeInput, setJoinCodeInput] = useState("");

  // Manage Tribe State
  const [manageModal, setManageModal] = useState({ isOpen: false, community: null });
  const [manageCodeInput, setManageCodeInput] = useState("");

  const dummy = useRef();

  // Load Communities
  useEffect(() => {
    return onSnapshot(collection(db, "communities"), (snap) =>
      setCommunities(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  // Load Chat Messages
  useEffect(() => {
    if (!activeChat) return;
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

  const createCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunityName.trim()) return;
    if (newCommunityPrivacy === 'private' && !newCommunityCode.trim()) {
      toast.error("Please set a join code for private tribe");
      return;
    }

    await addDoc(collection(db, "communities"), {
      name: newCommunityName,
      privacy: newCommunityPrivacy,
      joinCode: newCommunityPrivacy === 'private' ? newCommunityCode : null,
      members: [user.uid],
      createdAt: serverTimestamp(),
      createdBy: user.uid
    });
    setNewCommunityName("");
    setNewCommunityPrivacy("public");
    setNewCommunityCode("");
    setIsCreating(false);
    toast.success("Tribe created!");
  };

  const handleJoin = async (community) => {
    // If already a member, leave
    if (community.members?.includes(user.uid)) {
      await updateDoc(doc(db, "communities", community.id), { members: arrayRemove(user.uid) });
      toast.success(`Left ${community.name}`);
      return;
    }

    // If Public, join directly
    if (community.privacy === 'public') {
      await updateDoc(doc(db, "communities", community.id), { members: arrayUnion(user.uid) });
      toast.success(`Joined ${community.name}`);
    } else {
      // If Private, open modal
      setJoinModal({ isOpen: true, community });
      setJoinCodeInput("");
    }
  };

  const submitJoinCode = async (e) => {
    e.preventDefault();
    if (joinCodeInput === joinModal.community.joinCode) {
      await updateDoc(doc(db, "communities", joinModal.community.id), { members: arrayUnion(user.uid) });
      toast.success(`Joined ${joinModal.community.name}`);
      setJoinModal({ isOpen: false, community: null });
    } else {
      toast.error("Incorrect Join Code");
    }
  };

  const togglePrivacy = async () => {
    const c = manageModal.community;
    const isNowPublic = c.privacy === 'public';

    if (isNowPublic) {
      // Switching to Private
      if (!manageCodeInput.trim()) {
        toast.error("Set a code to make it private");
        return;
      }
      await updateDoc(doc(db, "communities", c.id), {
        privacy: 'private',
        joinCode: manageCodeInput
      });
      toast.success("Tribe is now Private");
    } else {
      // Switching to Public
      await updateDoc(doc(db, "communities", c.id), {
        privacy: 'public',
        joinCode: null
      });
      toast.success("Tribe is now Public");
    }
    setManageModal({ isOpen: false, community: null });
  };

  // --- RENDER CHAT ROOM ---
  if (activeChat) {
    return (
      <div className="h-[80vh] flex flex-col animate-fade-in-up">
        {/* Chat Header */}
        <GlassCard className="mb-4 flex items-center gap-4 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200 dark:border-white/10">
          <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition text-slate-600 dark:text-white">
            <ArrowLeft />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {activeChat.name}
              {activeChat.privacy === 'private' && <Lock size={14} className="text-slate-400" />}
            </h2>
            <span className="text-xs text-slate-500 dark:text-indigo-300">Community Chat</span>
          </div>
        </GlassCard>

        {/* Chat Messages Area */}
        <GlassCard className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200 dark:border-white/10">
          {messages.length === 0 && <div className="text-center text-slate-400 dark:text-white/20 mt-10">Start the conversation...</div>}

          {messages.map((msg, idx) => {
            const isMe = msg.uid === user.uid;
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 dark:text-indigo-300 mb-1 px-1">{msg.username}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-indigo-100'}`}>
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
            className="flex-1 p-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 shadow-sm"
            placeholder={`Message #${activeChat.name}...`}
          />
          <Button type="submit" className="px-6"><Send size={20} /></Button>
        </form>
      </div>
    );
  }

  // --- RENDER COMMUNITIES LIST ---
  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tribes</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus size={20} /> Create Tribe
        </Button>
      </div>

      {/* CREATE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Tribe</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={createCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Tribe Name</label>
                <input
                  autoFocus
                  value={newCommunityName}
                  onChange={e => setNewCommunityName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Tech Enthusiasts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-2">Privacy</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCommunityPrivacy('public')}
                    className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition ${newCommunityPrivacy === 'public' ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}
                  >
                    <Unlock size={18} /> Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCommunityPrivacy('private')}
                    className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition ${newCommunityPrivacy === 'private' ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300' : 'border-slate-200 dark:border-white/10 text-slate-500'}`}
                  >
                    <Lock size={18} /> Private
                  </button>
                </div>
              </div>

              {newCommunityPrivacy === 'private' && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-medium text-slate-700 dark:text-indigo-200 mb-1">Set Join Code</label>
                  <input
                    value={newCommunityCode}
                    onChange={e => setNewCommunityCode(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. SECRET123"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <Button type="submit" disabled={!newCommunityName.trim()}>Create Tribe</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* JOIN PRIVATE MODAL */}
      {joinModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-sm p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Private Tribe</h3>
              <p className="text-sm text-slate-500 dark:text-indigo-300/60">Enter the code to join <b>{joinModal.community?.name}</b></p>
            </div>
            <form onSubmit={submitJoinCode} className="space-y-4">
              <input
                autoFocus
                value={joinCodeInput}
                onChange={e => setJoinCodeInput(e.target.value)}
                className="w-full p-3 text-center tracking-widest text-lg font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="CODE"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setJoinModal({ isOpen: false, community: null })} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">Cancel</button>
                <Button type="submit" className="flex-1">Join</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MANAGE MODAL */}
      {manageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tribe Settings</h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-indigo-200">Current Status</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${manageModal.community.privacy === 'private' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'}`}>
                  {manageModal.community.privacy === 'private' ? 'PRIVATE' : 'PUBLIC'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {manageModal.community.privacy === 'private'
                  ? "Only people with the code can join."
                  : "Anyone can join this tribe."}
              </p>
            </div>

            {manageModal.community.privacy === 'public' ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-indigo-200">Make this tribe <b>Private</b>? You'll need to set a join code.</p>
                <input
                  value={manageCodeInput}
                  onChange={e => setManageCodeInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
                  placeholder="Set Join Code"
                />
                <Button onClick={togglePrivacy} className="w-full bg-red-500 hover:bg-red-600 text-white">
                  <Lock size={18} /> Make Private
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl text-yellow-800 dark:text-yellow-200 text-sm">
                  <AlertTriangle size={20} className="shrink-0" />
                  <p>Warning: Making this tribe <b>Public</b> will remove the join code. Anyone will be able to join instantly.</p>
                </div>
                <Button onClick={togglePrivacy} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Unlock size={18} /> Make Public
                </Button>
              </div>
            )}

            <button onClick={() => setManageModal({ isOpen: false, community: null })} className="w-full mt-4 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm">Cancel</button>
          </GlassCard>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {communities.length === 0 && !isCreating && (
          <div className="col-span-2 text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-white/30 text-lg">No tribes found.</p>
            <p className="text-slate-400 dark:text-white/10 text-sm mb-6">Be the first to start a community!</p>
            <Button onClick={() => setIsCreating(true)} variant="secondary">Create First Tribe</Button>
          </div>
        )}

        {communities.map(c => {
          const isMember = c.members?.includes(user.uid);
          const isOwner = c.createdBy === user.uid;

          return (
            <GlassCard key={c.id} className="relative group hover:border-indigo-500/50 transition bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                  {c.name}
                  {c.privacy === 'private' && <Lock size={16} className="text-slate-400" title="Private Tribe" />}
                </h3>
                {isOwner && (
                  <button
                    onClick={() => {
                      setManageModal({ isOpen: true, community: c });
                      setManageCodeInput("");
                    }}
                    className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition"
                    title="Tribe Settings"
                  >
                    <Settings size={16} />
                  </button>
                )}
              </div>

              <p className="text-slate-600 dark:text-indigo-200 text-sm mb-4">{c.members?.length || 0} members</p>

              <div className="flex gap-2">
                {/* JOIN/LEAVE BUTTON */}
                <Button
                  variant="secondary"
                  onClick={() => handleJoin(c)}
                  className="flex-1"
                >
                  {isMember ? "Leave" : (c.privacy === 'private' ? "Join (Code)" : "Join")}
                </Button>

                {/* CHAT BUTTON - Only if Member */}
                {isMember && (
                  <Button onClick={() => setActiveChat(c)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
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