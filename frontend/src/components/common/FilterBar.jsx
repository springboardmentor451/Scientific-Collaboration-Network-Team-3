import React from 'react';

export default function FilterBar({ searchValue, onSearchChange, searchPlaceholder = 'Search...', filters = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-card p-4 shadow-card flex flex-col md:flex-row gap-4 items-stretch md:items-center border border-outline-variant/30">
      <div className="relative flex-1 w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-input border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 font-body-md text-on-surface"
          placeholder={searchPlaceholder}
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
        />
      </div>
      {filters.length > 0 && (
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
          {filters.map((f) => (
            <select
              key={f.id}
              className="border border-outline-variant bg-surface-container-lowest py-2.5 px-4 rounded-input font-body-md text-on-surface focus:outline-none focus:border-primary min-w-[150px]"
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              aria-label={f.label}
            >
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
}
