import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conferenceService } from '../../services/conferenceService';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function ConferenceList() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError(null);
    conferenceService
      .list()
      .then(setConferences)
      .catch(() => setError('Could not load conferences.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Conferences"
        subtitle="Upcoming events and registrations across the research network."
        actions={<Button variant="secondary" onClick={() => navigate('/conferences/schedule')}>View Schedule</Button>}
      />

      {loading && <SkeletonCard count={3} />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && conferences.length === 0 && (
        <EmptyState
          icon="event"
          title="No conferences yet"
          message="When conferences are published, they will appear here."
        />
      )}
      {!loading && !error && conferences.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {conferences.map((conf) => {
            const dateObj = new Date(conf.date);
            const validDate = !Number.isNaN(dateObj.getTime());
            const month = validDate ? dateObj.toLocaleString('default', { month: 'short' }) : 'TBD';
            const day = validDate ? dateObj.getDate().toString().padStart(2, '0') : '--';

            return (
              <div key={conf.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-card p-6 shadow-card">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container flex flex-col items-center justify-center text-primary flex-shrink-0 border border-outline-variant/30">
                    <span className="text-[10px] font-bold uppercase leading-none">{month}</span>
                    <span className="text-xl font-bold leading-none mt-1">{day}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary leading-tight mb-1">{conf.title}</h3>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {conf.location}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                  <StatusBadge status={conf.status} />
                  <Button variant="ghost" onClick={() => navigate('/conferences/schedule')}>Details</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
