import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  icon,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  const baseClasses =
    'rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-navy-hover px-6 py-3 shadow-sm',
    secondary:
      'border border-primary text-primary bg-surface-container-lowest hover:bg-surface-container-low px-6 py-3',
    ghost:
      'text-on-surface-variant hover:bg-surface-container-low hover:text-primary px-4 py-2',
    danger:
      'text-error hover:bg-error-container px-4 py-2',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
