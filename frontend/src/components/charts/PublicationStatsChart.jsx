import React from 'react';

export default function PublicationStatsChart({ data }) {
  // data: [{ label: 'Jan', value: 10 }, ...]
  
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-on-surface-variant font-body-md">No data available</div>;
  }

  const maxVal = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full h-64 flex items-end justify-between gap-2 pt-8 pb-4 relative">
      {/* Background grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between z-0 pb-6 pointer-events-none">
        {[4, 3, 2, 1, 0].map(i => (
          <div key={i} className="w-full border-b border-outline-variant/30 flex-1 flex items-start">
            <span className="text-[10px] text-on-surface-variant -mt-2 ml-1 opacity-50">
              {Math.round(maxVal * (i / 4))}
            </span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 z-10 px-6 h-full pb-6">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <div 
              className="w-full max-w-[40px] bg-primary-container/80 rounded-t-sm group-hover:bg-primary-container transition-all relative"
              style={{ height: `${(item.value / maxVal) * 100}%`, minHeight: '4px' }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 absolute bottom-0">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
