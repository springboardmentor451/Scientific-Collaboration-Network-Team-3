import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicationService } from '../../services/publicationService';
import PageHeader from '../../components/common/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

export default function PublicationList() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    publicationService
      .list()
      .then(setPublications)
      .catch(() => setError('Could not load publications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = publications.filter((pub) => {
    const matchesQuery = `${pub.title} ${pub.authors || ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === 'all' || pub.publication_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  const columns = [
    {
      header: 'Title',
      render: (pub) => (
        <div>
          <div className="font-semibold text-primary max-w-md truncate">{pub.title}</div>
          <div className="text-xs text-on-surface-variant mt-0.5">{pub.journal || pub.conference || 'Internal Report'}</div>
        </div>
      ),
    },
    { header: 'Type', render: (pub) => <StatusBadge status={pub.type} variant="type" /> },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Authors',
      render: (pub) => (
        <div className="flex -space-x-2">
          {pub.authors?.slice(0, 3).map((author, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-xs font-bold text-on-surface"
              title={author}
            >
              {author.substring(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      ),
    },
    { header: 'Status', render: (pub) => <StatusBadge status={pub.status} /> },
    {
      header: 'Actions',
      className: 'text-right',
      render: (pub) => (
        <button
          type="button"
          aria-label="Edit"
          className="text-outline hover:text-primary p-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/publications/${pub.id}/edit`);
          }}
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Publications Repository"
        subtitle="Manage and track your research output across journals, conferences, and patents."
        actions={
          <Button icon="add" onClick={() => navigate('/publications/new')}>
            Add New Publication
          </Button>
        }
      />
      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search publications by title or author..."
        filters={[
          {
            id: 'type',
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'Paper', label: 'Paper' },
              { value: 'Journal', label: 'Journal' },
              { value: 'Conference', label: 'Conference' },
              { value: 'Report', label: 'Report' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'Published', label: 'Published' },
              { value: 'Submitted', label: 'Submitted' },
              { value: 'Draft', label: 'Draft' },
            ],
          },
        ]}
      />
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        emptyIcon="article"
        emptyTitle="No publications found"
        emptyMessage="Add a manuscript or adjust filters to see results."
        emptyActionLabel="Add New Publication"
        onEmptyAction={() => navigate('/publications/new')}
        onRowClick={(pub) => navigate(`/publications/${pub.id}/edit`)}
        pagination={{
          label: `Showing ${filtered.length} of ${publications.length} entries`,
          page: 1,
          totalPages: 1,
          onPrev: () => {},
          onNext: () => {},
        }}
      />
    </div>
  );
}
