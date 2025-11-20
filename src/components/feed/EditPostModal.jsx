import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import { Button } from '../UI';
import { Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import toast from 'react-hot-toast';

export default function EditPostModal({ post, onClose }) {
  const [content, setContent] = useState(post?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) setContent(post.content);
  }, [post]);

  const handleSave = async () => {
    if (!content.trim() || !post) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "posts", post.id), {
        content: content,
        isEdited: true // Mark as edited
      });
      toast.success("Post updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update post.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={!!post} onClose={onClose} title="Edit Post">
      <div className="p-6 bg-slate-900">
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-indigo-500/50 transition-all resize-none font-mono text-sm"
          placeholder="What did you mean to say?"
        />
        
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || content === post?.content}>
            {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </Button>
        </div>
      </div>
    </Modal>
  );
}