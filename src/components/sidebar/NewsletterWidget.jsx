import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { GlassCard } from '../UI';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp(),
      });
      toast.success("You've subscribed to the newsletter!");
      setEmail('');
    } catch (error) {
      console.error("Error subscribing to newsletter: ", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="bg-slate-900/60 border-indigo-500/20 backdrop-blur-xl">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Mail className="text-pink-500" size={20}/> Subscribe to our Newsletter
      </h3>
      <p className="text-sm text-white/50 mb-4">
        Get the latest posts and trends delivered right to your inbox.
      </p>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
      </form>
       {/* Note for backend implementation */}
       <p className="text-xs text-white/30 mt-4 italic">
         Note: This form adds your email to our subscribers list. Email sending would be handled by a backend service (e.g., a Firebase Cloud Function) that is not implemented in this demo.
       </p>
    </GlassCard>
  );
}