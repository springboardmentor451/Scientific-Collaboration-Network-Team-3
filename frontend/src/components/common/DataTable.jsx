import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import SkeletonTable from './SkeletonTable';

export default function DataTable({
  columns,
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyIcon = 'inbox',
  emptyTitle = 'No records found',
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
  pagination,
}) {
  if (loading) return <SkeletonTable rows={5} cols={columns.length} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  return (
    <div className="bg-surface-container-lowest rounded-[24px] shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/50">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`p-4 font-label-sm text-on-surface-variant font-semibold ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-body-md text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    message={emptyMessage}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className={`border-b border-outline-variant/20 hover:bg-surface/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`p-4 ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && data.length > 0 && (
        <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <span className="font-body-md text-sm text-on-surface-variant">{pagination.label}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-outline-variant rounded-md text-sm font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              disabled={pagination.page <= 1}
              onClick={pagination.onPrev}
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md text-sm font-semibold">
              {pagination.page}
            </button>
            <button
              className="px-3 py-1 border border-outline-variant rounded-md text-sm font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              disabled={pagination.page >= pagination.totalPages}
              onClick={pagination.onNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
