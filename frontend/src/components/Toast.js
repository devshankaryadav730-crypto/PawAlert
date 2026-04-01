import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className={`toast ${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
