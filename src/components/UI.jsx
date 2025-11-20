import React from 'react';

// Dark Glass Card: Translucent white on dark background
export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 text-white ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, type="button" }) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    // Glowing Gradient
    primary: "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:brightness-110",
    
    // Translucent White
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    
    // Danger (Red Glow)
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};
// ... (Keep GlassCard and Button as they are) ...

// NEW: Skeleton Loader Component
export const SkeletonPost = () => (
  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-white/10"></div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-white/10 rounded"></div>
        <div className="h-3 w-20 bg-white/5 rounded"></div>
      </div>
    </div>
    <div className="h-6 w-3/4 bg-white/10 rounded"></div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-white/5 rounded"></div>
      <div className="h-4 w-full bg-white/5 rounded"></div>
      <div className="h-4 w-2/3 bg-white/5 rounded"></div>
    </div>
  </div>
);