import React from 'react';
import Button from './Button';

export default function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-error">error_outline</span>
      </div>
      <h3 className="font-headline-md text-on-surface mb-2">Something went wrong</h3>
      <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon="refresh" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
