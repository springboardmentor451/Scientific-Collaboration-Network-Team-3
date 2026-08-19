import React, { useEffect, useState } from 'react';
import { auditService } from '../../services/auditService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    auditService
      .list()
      .then(setLogs)
      .catch(() => setError('Could not load audit events.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesModule = filter === 'All' || l.module === filter;
    const haystack = `${l.actor} ${l.action} ${l.entity}`.toLowerCase();
    return matchesModule && haystack.includes(query.toLowerCase());
  });

  const columns = [
    {
      header: 'Timestamp',
      render: (l) => <span className="font-mono text-xs text-on-surface-variant">{new Date(l.timestamp).toLocaleString()}</span>,
    },
    { header: 'Actor', render: (l) => <span className="font-semibold text-primary">{l.actor}</span> },
    { header: 'Action', accessor: 'action' },
    { header: 'Module', render: (l) => <StatusBadge status={l.module} /> },
    { header: 'Target Entity', render: (l) => <span className="font-mono text-xs text-on-surface-variant">{l.entity}</span> },
  ];

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Audit Log"
        subtitle="Review system activity, security events, and administrative actions."
        actions={<Button variant="secondary" icon="download">Export</Button>}
      />
      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search actor, action, or entity..."
        filters={[
          {
            id: 'module',
            label: 'Module',
            value: filter,
            onChange: setFilter,
            options: [
              { value: 'All', label: 'All Modules' },
              { value: 'Users', label: 'Users' },
              { value: 'Publications', label: 'Publications' },
              { value: 'Auth', label: 'Auth' },
            ],
          },
        ]}
      />
      <DataTable
        columns={columns}
        data={filteredLogs}
        loading={loading}
        error={error}
        onRetry={load}
        emptyIcon="history"
        emptyTitle="No audit logs found"
        emptyMessage="Adjust filters or wait for new system activity."
      />
    </div>
  );
}
