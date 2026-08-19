import React from 'react';
import DataTable from './DataTable';

export default function Table({ columns, data = [], onRowClick }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={onRowClick}
      emptyTitle="No records found"
      emptyMessage="Nothing to show here yet."
    />
  );
}
