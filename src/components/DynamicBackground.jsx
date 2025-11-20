import React from 'react';

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
      {/* Deep Space Background Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-900 opacity-80"></div>
      
      {/* Floating Blob 1 (Purple) */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      
      {/* Floating Blob 2 (Indigo) */}
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      
      {/* Floating Blob 3 (Pink) */}
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Grid Overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
}