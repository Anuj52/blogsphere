import React from 'react';
import TrendingWidget from './TrendingWidget';
import WhoToFollowWidget from './WhoToFollowWidget';

export default function RightSidebar() {
  return (
    <div className="hidden xl:flex flex-col w-80 h-full border-l border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <TrendingWidget />
            <WhoToFollowWidget />
            
            {/* Footer */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-indigo-400/30 px-2 justify-center pt-4 border-t border-white/5">
                <span>© 2025 BlogSphere</span>
                <a href="#" className="hover:text-indigo-400">Privacy</a>
                <a href="#" className="hover:text-indigo-400">Terms</a>
                <a href="#" className="hover:text-indigo-400">Cookies</a>
            </div>
        </div>
    </div>
  );
}