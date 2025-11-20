import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { GlassCard, Button } from '../components/UI';
import { MapPin, User, AtSign, FileText, Loader2 } from 'lucide-react';
import DynamicBackground from '../components/DynamicBackground';

// --- BUG FIX: Component moved OUTSIDE the main function ---
const InputField = ({ icon, placeholder, value, onChange, required = false }) => (
  <div className="relative group z-20">
    <div className="absolute left-3 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors pointer-events-none">
      {icon}
    </div>
    <input 
      className="w-full pl-10 p-3 bg-slate-900/50 border border-white/10 rounded-xl outline-none text-white placeholder-indigo-300/50 focus:bg-slate-800 focus:border-indigo-400 transition-all relative z-20" 
      placeholder={placeholder} 
      required={required} 
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
  </div>
);

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", username: "", bio: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await setDoc(doc(db, "users", user.uid), { ...form, email: user.email, communities: [] });
        navigate('/'); // Redirect to Feed
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <DynamicBackground />
      
      <GlassCard className="w-full max-w-lg border-white/20 shadow-2xl animate-fade-in-up relative z-50 bg-slate-900/80">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Persona</h2>
            <p className="text-indigo-200">Tell the world who you are</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-50">
          <InputField 
            icon={<User size={18}/>} 
            placeholder="Full Name" 
            required={true} 
            value={form.fullName} 
            onChange={e => setForm({...form, fullName: e.target.value})} 
          />
          
          <InputField 
            icon={<AtSign size={18}/>} 
            placeholder="Username" 
            required={true} 
            value={form.username} 
            onChange={e => setForm({...form, username: e.target.value})} 
          />
          
          <div className="relative group z-20">
            <FileText className="absolute left-3 top-3.5 text-indigo-300 h-5 w-5 group-focus-within:text-white transition-colors pointer-events-none" />
            <textarea 
              className="w-full pl-10 p-3 bg-slate-900/50 border border-white/10 rounded-xl outline-none text-white placeholder-indigo-300/50 focus:bg-slate-800 focus:border-indigo-400 transition-all min-h-[100px] relative z-20" 
              placeholder="Bio - Write something epic..." 
              value={form.bio}
              onChange={e => setForm({...form, bio: e.target.value})} 
            />
          </div>

          <InputField 
            icon={<MapPin size={18}/>} 
            placeholder="Location" 
            value={form.location} 
            onChange={e => setForm({...form, location: e.target.value})} 
          />
          
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? <Loader2 className="animate-spin"/> : "Complete Setup"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}