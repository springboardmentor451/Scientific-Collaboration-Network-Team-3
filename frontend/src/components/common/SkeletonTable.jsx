import React from 'react';

export default function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden animate-pulse">
      <div className="bg-surface-container-low border-b border-outline-variant/50 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-surface-container-high rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex gap-4 border-b border-outline-variant/20">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={`h-4 bg-surface-container rounded flex-1 ${c === 0 ? 'max-w-xs' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
