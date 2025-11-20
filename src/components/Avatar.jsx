import React from 'react';

export default function Avatar({ seed, size = "md", className = "" }) {
  // Size mappings
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-32 h-32"
  };

  // We use 'Notionists' style from DiceBear for a sketchy, artistic look
  // The 'seed' ensures the same username always gets the same face
  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-indigo-900/50 border border-white/10 shadow-inner shrink-0 ${className}`}>
      <img 
        src={avatarUrl} 
        alt="Avatar" 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}