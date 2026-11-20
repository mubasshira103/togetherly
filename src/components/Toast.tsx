'use client';
import { useEffect } from 'react';
export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div
      className="fixed right-6 bottom-6 z-60 bg-forest text-white py-3.5 px-4 rounded-lg shadow-soft flex gap-4 items-center text-sm"
      role="status"
    >
      <span>{message}</span>
      <button onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
