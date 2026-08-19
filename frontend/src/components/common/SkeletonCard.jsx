import React from 'react';

export default function SkeletonCard({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container h-36"
        >
          <div className="h-3 bg-surface-container-high rounded w-2/3 mb-4" />
          <div className="h-8 bg-surface-container-high rounded w-1/2 mb-3" />
          <div className="h-3 bg-surface-container rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
