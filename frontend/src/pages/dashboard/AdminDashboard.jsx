import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import { dashboardService } from '../../services/dashboardService';

function StatCard({ title, value, icon, bgClass, trend, trendIcon }) {
  return (
    <div className={`${bgClass || 'bg-surface-container-lowest border border-outline-variant/30'} p-6 rounded-card shadow-card flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-label-sm text-on-surface-variant">{title}</h3>
        <div className="p-2 bg-primary-fixed rounded-lg text-on-primary-fixed">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      <div className="mt-auto">
        <p className="font-display-lg-mobile text-on-surface font-bold">
          {value ?? '—'}
        </p>
        {trend && (
          <p className="font-body-md text-secondary text-sm mt-1 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">{trendIcon || 'trending_up'}</span>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch((err) => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) => (n == null ? '—' : n.toLocaleString());

  return (
    <>
      <PageHeader
        title="System Overview Dashboard"
        subtitle="Global platform metrics and administration."
      />

      {/* High-Level Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Total Researchers</h3>
            <div className="p-2 bg-primary-fixed rounded-lg text-on-primary-fixed">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">
              {loading ? '…' : fmt(stats?.total_researchers)}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Partner Institutions</h3>
            <div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">
              {loading ? '…' : fmt(stats?.total_institutions)}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Global Publications</h3>
            <div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
              <span className="material-symbols-outlined">library_books</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">
              {loading ? '…' : fmt(stats?.total_publications)}
            </p>
          </div>
        </div>

        <div className="bg-primary-container p-6 rounded-card shadow-card flex flex-col text-on-primary-container">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm">Total Citations</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">format_quote</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-white font-bold">
              {loading ? '…' : fmt(stats?.total_citations)}
            </p>
            <p className="font-body-md text-primary-fixed-dim text-sm mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {loading ? '' : `${fmt(stats?.total_collaborations)} collaborations`}
            </p>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Publication Trends */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Publication Trends</h2>
          </div>
          <div className="h-64 w-full bg-surface-container rounded-lg flex items-center justify-center border border-outline-variant/50 relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-full flex items-end justify-between px-4 pb-4 gap-2 opacity-50">
              <div className="w-full bg-primary/20 rounded-t-sm h-1/4"></div>
              <div className="w-full bg-primary/30 rounded-t-sm h-2/4"></div>
              <div className="w-full bg-primary/40 rounded-t-sm h-1/3"></div>
              <div className="w-full bg-primary/50 rounded-t-sm h-3/4"></div>
              <div className="w-full bg-primary/60 rounded-t-sm h-2/3"></div>
              <div className="w-full bg-primary/70 rounded-t-sm h-4/5"></div>
              <div className="w-full bg-primary/80 rounded-t-sm h-full"></div>
            </div>
            <span className="font-body-md text-outline relative z-10 bg-surface/80 px-4 py-2 rounded-full shadow-sm font-semibold">
              Chart visualization — connect to report API for live data
            </span>
          </div>
        </div>

        {/* Conferences */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <h2 className="font-headline-md text-on-surface mb-6">Platform Summary</h2>
          <div className="space-y-4 flex-1">
            {[
              { label: 'Total Researchers', value: stats?.total_researchers, icon: 'group' },
              { label: 'Total Institutions', value: stats?.total_institutions, icon: 'account_balance' },
              { label: 'Total Conferences', value: stats?.total_conferences, icon: 'event' },
              { label: 'Total Collaborations', value: stats?.total_collaborations, icon: 'hub' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-sm text-on-surface">{item.label}</p>
                </div>
                <span className="font-body-md text-outline text-sm font-semibold">
                  {loading ? '…' : fmt(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Row: User Management */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Recent Activity</h2>
            <button className="text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">Platform statistics loaded</p>
                <p className="font-body-md text-sm text-outline">Just now • System</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">
                  {loading ? 'Loading…' : `${fmt(stats?.total_publications)} publications in database`}
                </p>
                <p className="font-body-md text-sm text-outline">Live from backend</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', icon: 'manage_accounts', path: '/admin/users' },
              { label: 'Audit Log', icon: 'history', path: '/admin/audit-log' },
              { label: 'Reports', icon: 'assessment', path: '/reports' },
              { label: 'Institutions', icon: 'account_balance', path: '/institutions' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.path}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary">{action.icon}</span>
                <span className="font-label-sm text-on-surface text-center text-xs">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
