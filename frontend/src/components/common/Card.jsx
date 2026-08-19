import React from 'react';

export default function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-card shadow-card border border-outline-variant/30 ${
        padded ? 'p-6' : 'overflow-hidden'
      } ${className}`}
    >
      {children}
    </div>
  );
}
