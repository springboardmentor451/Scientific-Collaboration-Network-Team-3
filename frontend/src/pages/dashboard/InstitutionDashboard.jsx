import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import CollaborationNetworkGraph from '../../components/charts/CollaborationNetworkGraph';
import PageHeader from '../../components/common/PageHeader'; 

export default function InstitutionDashboard() {
  const { user } = useAuth();

  const mockGraphData = {
    nodes: [
      { id: '1', group: 1 },
      { id: '2', group: 2 },
    ],
    links: [
      { source: '1', target: '2', value: 1 },
    ]
  };

  return (
    <>
      <PageHeader
        title="Institution Overview"
        subtitle={`Welcome back, ${user?.name || 'Admin'}. Here's the performance of ${user?.institution || 'your institution'}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Output</h3>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined">library_books</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">1,204</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +5% YoY
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Active Grants</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">42</div>
            <p className="font-body-md text-[12px] text-on-surface-variant mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">pending</span> 12 pending renewal
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Partner Inst.</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined">public</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">38</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">add</span> +3 this quarter
            </p>
          </div>
        </div>

        <div className="bg-primary-container rounded-card p-6 shadow-card flex flex-col justify-between h-full text-on-primary-container">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm uppercase tracking-wider">Global Rank</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg font-bold leading-none">#12</div>
            <p className="font-body-md text-[12px] mt-2 font-semibold">Top 1% globally</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Top Performing Departments</h2>
            <a className="font-body-md font-semibold text-sm text-secondary hover:underline" href="#all">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Department</th>
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Publications</th>
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Active Projects</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm font-semibold">
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 text-on-surface">Quantum Physics</td>
                  <td className="py-4 px-4 text-on-surface-variant">342</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim">15 Active</span>
                  </td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-4 text-on-surface">Bioinformatics</td>
                  <td className="py-4 px-4 text-on-surface-variant">284</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim">9 Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Key Metrics</h2>
          </div>
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-secondary transition-colors cursor-pointer bg-surface-container-low/50">
              <h4 className="font-body-md font-semibold text-on-surface mb-1">Grant Utilization</h4>
              <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-on-surface-variant font-label-sm">
                <span>82% Used</span>
                <span>$4.2M</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-secondary transition-colors cursor-pointer bg-surface-container-low/50">
              <h4 className="font-body-md font-semibold text-on-surface mb-1">Open Access Ratio</h4>
              <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-on-surface-variant font-label-sm">
                <span>65% Open Access</span>
                <span>Target: 75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
