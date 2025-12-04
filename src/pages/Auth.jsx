import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { GlassCard, Button } from '../components/UI';
import DynamicBackground from '../components/DynamicBackground';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Local state for auth check isn't enough, need context

  // We need to check auth state. Ideally import useAuth, but for now let's use onAuthStateChanged locally or import useAuth
  // Let's use the standard firebase auth check for simplicity in this file without adding context dependency if not needed, 
  // BUT we already have AuthContext. Let's use it.

  // Wait, I need to import useAuth first.
  // actually, let's just use the existing auth import.

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) navigate('/feed');
    });
    return unsubscribe;
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (isRegistering) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
      navigate('/feed'); // Redirect to Feed on success
    } catch (err) {
      console.error("Auth Error:", err);
      // Clean up error message
      let msg = err.message.replace("Firebase: ", "").replace("auth/", "").replace(/-/g, " ");
      // Capitalize first letter
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* 1. Add the Dynamic Background */}
      <DynamicBackground />

      {/* 2. Animated Entry for the Card */}
      <div className="w-full max-w-md animate-fade-in-up z-10">
        <GlassCard className="border-slate-200 dark:border-white/20 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 drop-shadow-sm">
              BlogSphere
            </h1>
            <p className="text-slate-600 dark:text-indigo-200 font-medium">
              {isRegistering ? "Join the community" : "Welcome back, traveler"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="group relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-indigo-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-white transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-indigo-200/50 focus:bg-white dark:focus:bg-white/20 focus:ring-2 focus:ring-indigo-500 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 dark:text-indigo-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-white transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-indigo-200/50 focus:bg-white dark:focus:bg-white/20 focus:ring-2 focus:ring-indigo-500 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 text-sm text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3.5 text-lg shadow-indigo-500/30" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
              className="text-slate-600 dark:text-indigo-200 hover:text-indigo-600 dark:hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-1 mx-auto group"
            >
              {isRegistering ? "Already have an account? Login" : "New here? Create account"}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}