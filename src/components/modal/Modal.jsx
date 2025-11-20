import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children, title }) {
  // 1. Lock the background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // 2. Use createPortal to render this OUTSIDE the root div (directly in body)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in-up">
      
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* The Modal Box */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Header (Optional) */}
        {title && (
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur sticky top-0 z-10 shrink-0">
              <h2 className="text-lg font-bold text-white truncate">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition"><X size={20} /></button>
           </div>
        )}

        {/* Content */}
        {children}
      
      </div>
    </div>,
    document.body // <--- This attaches it to the BODY, not the Feed
  );
}