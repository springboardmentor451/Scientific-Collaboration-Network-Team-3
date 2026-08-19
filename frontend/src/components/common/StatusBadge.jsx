import React from 'react';

const STATUS_STYLES = {
  Published: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim',
  Submitted: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
  Draft: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed-dim',
  Archived: 'bg-surface-container text-on-surface-variant border-outline-variant',
  Registered: 'bg-primary-container text-on-primary border-transparent',
  Upcoming: 'bg-transparent text-on-surface-variant border-outline-variant',
  Active: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim',
  Completed: 'bg-surface-container text-on-surface-variant border-outline-variant',
  Pending: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
  Researcher: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim',
  Reviewer: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
  'System Admin': 'bg-error-container text-on-error-container border-error-container',
  'Institution Admin': 'bg-secondary-fixed/50 text-on-secondary-container border-secondary-fixed',
  Users: 'bg-surface-container text-on-surface-variant border-outline-variant',
  Publications: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim',
  Auth: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
};

const TYPE_STYLES = {
  Journal: 'bg-secondary-container/50 text-on-secondary-container border-secondary-fixed',
  'Journal Article': 'bg-secondary-container/50 text-on-secondary-container border-secondary-fixed',
  Conference: 'bg-tertiary-container/20 text-tertiary-container border-tertiary-fixed',
  'Conference Paper': 'bg-tertiary-container/20 text-tertiary-container border-tertiary-fixed',
  Patent: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim',
  Report: 'bg-surface-container text-on-surface-variant border-outline-variant',
  Book: 'bg-surface-container-high text-on-surface border-outline-variant',
  'Book Chapter': 'bg-surface-container-high text-on-surface border-outline-variant',
  Dataset: 'bg-secondary-fixed/30 text-on-secondary-fixed border-secondary-fixed-dim',
};

export default function StatusBadge({ status, variant = 'status' }) {
  const styles = variant === 'type' ? TYPE_STYLES : STATUS_STYLES;
  const style = styles[status] || 'bg-surface-container text-on-surface-variant border-outline-variant';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      {status}
    </span>
  );
}
