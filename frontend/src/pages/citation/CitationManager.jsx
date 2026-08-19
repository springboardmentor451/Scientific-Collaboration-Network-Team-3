import React, { useEffect, useState } from 'react';
import { citationService } from '../../services/citationService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';

export default function CitationManager() {
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    citationService
      .list()
      .then(setCitations)
      .catch(() => setError('Could not load citations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      header: 'Linked Publication ID',
      render: (c) => <span className="font-mono text-xs text-on-surface-variant">{c.publicationId}</span>,
    },
    { header: 'Cited By', render: (c) => <span className="font-semibold text-primary">{c.citedBy}</span> },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Action',
      className: 'text-right',
      render: () => (
        <button type="button" className="text-secondary font-semibold hover:underline text-xs">
          DOI Lookup
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Citation Manager"
        subtitle="Track where your research is being referenced globally."
        actions={<Button icon="search">Add Citation Manually</Button>}
      />
      <DataTable
        columns={columns}
        data={citations}
        loading={loading}
        error={error}
        onRetry={load}
        emptyIcon="format_quote"
        emptyTitle="No citations yet"
        emptyMessage="Citations will appear here as your publications are referenced."
      />
    </div>
  );
}
