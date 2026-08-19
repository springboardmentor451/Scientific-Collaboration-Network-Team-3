import React from 'react';

export default function TextArea({
  label,
  error,
  id,
  className = '',
  rows = 5,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-label-sm text-on-surface-variant">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full border rounded-input px-4 py-3 font-body-md bg-surface text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all resize-none ${
          error ? 'border-error' : 'border-outline-variant'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
