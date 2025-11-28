import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Hash, Users, User, LayoutGrid, Menu, X, Bell, Bookmark, BarChart2, Rss } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { Button } from './UI';
import DynamicBackground from './DynamicBackground';
import { Toaster } from 'react-hot-toast';
import RightSidebar from './sidebar/RightSidebar'; // <--- NEW IMPORT

export default function Layout({ children }) {
  const { userData } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const SidebarItem = ({ icon, label, path }) => {
    const active = location.pathname === path;
    return (
      <Link to={path} onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
          active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-bold' 
            : 'text-indigo-200 hover:bg-white/10 hover:text-white'
        }`}>
        <div className={`p-1 rounded-lg transition-transform group-hover:scale-110 ${active ? '' : 'opacity-70 group-hover:opacity-100'}`}>
            {icon}
        </div>
        <span className="text-lg">{label}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen text-white relative flex justify-center overflow-hidden bg-slate-950">
      <DynamicBackground />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />

      {/* MASTER GRID - 3 COLUMNS */}
      <div className="flex w-full max-w-[1600px] h-full relative z-10">

        {/* COLUMN 1: LEFT NAV (Fixed) */}
        <aside className={`
            absolute inset-y-0 left-0 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 
            xl:relative xl:translate-x-0 xl:bg-transparent xl:border-r-0 xl:flex xl:flex-col xl:h-full
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 xl:pl-4 xl:pt-8">
            <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight mb-8">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
                <LayoutGrid className="w-7 h-7 text-white" />
              </div>
              <span className="hidden xl:block text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">BlogSphere</span>
            </h1>
            <nav className="space-y-2">
              <SidebarItem icon={<Hash size={22} />} label="Feed" path="/" />
              <SidebarItem icon={<Users size={22} />} label="Tribes" path="/communities" />
              <SidebarItem icon={<Bell size={22} />} label="Notifications" path="/notifications" />
              <SidebarItem icon={<Bookmark size={22} />} label="Saved" path="/saved" />
              <SidebarItem icon={<User size={22} />} label="Profile" path="/profile" />
              <SidebarItem icon={<BarChart2 size={22} />} label="Analytics" path="/analytics" />
              <SidebarItem icon={<Rss size={22} />} label="RSS Feed" path="/rss" />
            </nav>
          </div>
          <div className="p-6 mt-auto xl:pl-4 xl:pb-8">
             {userData && (
                <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl mb-4 backdrop-blur-sm flex items-center gap-3 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">{userData.fullName[0]}</div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-white text-sm truncate">{userData.fullName}</p>
                        <p className="text-indigo-300 text-xs truncate">@{userData.username}</p>
                    </div>
                </div>
             )}
              <Button variant="danger" className="w-full py-3 text-base" onClick={handleLogout}><LogOut size={18} /> Logout</Button>
          </div>
        </aside>

        {/* COLUMN 2: FEED (Scrollable) */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <div className="xl:hidden p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
                <span className="font-bold text-xl text-white">BlogSphere</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 bg-white/10 rounded-lg">{isMobileMenuOpen ? <X /> : <Menu />}</button>
            </div>
            <main className="flex-1 w-full overflow-y-auto custom-scrollbar scroll-smooth">
                {children}
            </main>
        </div>

        {/* COLUMN 3: RIGHT SIDEBAR (Fixed) */}
        <RightSidebar />

      </div>
    </div>
  );
}