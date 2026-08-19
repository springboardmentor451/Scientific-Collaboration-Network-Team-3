import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { researcherService } from '../../services/researcherService';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';

export default function ResearcherList() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    researcherService
      .getAll()
      .then(setResearchers)
      .catch(() => setError('Could not load researchers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = researchers.filter((r) => {
    const haystack = `${r.name} ${r.department} ${r.institution}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const columns = [
    {
      header: 'Name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
            {r.name?.charAt(0)}
          </div>
          <span className="font-semibold text-primary">{r.name}</span>
        </div>
      ),
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Institution', accessor: 'institution' },
  ];

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Researchers"
        subtitle="Browse affiliated researchers and open a profile for collaboration context."
      />
      <FilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by name, department, or institution..."
      />
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRetry={load}
        emptyIcon="group"
        emptyTitle="No researchers yet"
        emptyMessage="Researchers will appear here once they are added to your institution."
        onRowClick={(row) => navigate(`/researchers/${row.id}`)}
      />
    </div>
  );
}
