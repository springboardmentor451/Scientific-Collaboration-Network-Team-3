import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import CollaborationNetworkGraph from '../../components/charts/CollaborationNetworkGraph';
import PageHeader from '../../components/common/PageHeader';

export default function ResearcherDashboard() {
  const { user } = useAuth();
  
  // Fake graph data for the network context
  const mockGraphData = {
    nodes: [
      { id: '1', group: 1 },
      { id: '2', group: 2 },
      { id: '3', group: 2 },
    ],
    links: [
      { source: '1', target: '2', value: 1 },
      { source: '2', target: '3', value: 1 },
    ]
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Overview Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Dr. Rossi'}. Here's a summary of your recent activity.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Publications</h3>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined">article</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">142</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +12% from last year
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Active Projects</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined">science</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">8</div>
            <p className="font-body-md text-[12px] text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">pending_actions</span> 3 nearing completion
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Total Citations</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined">format_quote</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">3,492</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +450 this month
            </p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-primary-container rounded-card p-6 shadow-card flex flex-col justify-between h-full text-on-primary-container">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm uppercase tracking-wider">Collab Index</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined">language</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg font-bold leading-none">9.4</div>
            <p className="font-body-md text-[12px] mt-2">Top 5% globally</p>
          </div>
        </div>
      </div>

      {/* Main Content Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent Publications Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Recent Publications</h2>
            <a className="font-body-md font-semibold text-sm text-secondary hover:underline" href="#all">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Title</th>
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Date</th>
                  <th className="py-3 px-4 font-label-sm text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm">
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-4 font-semibold text-on-surface group-hover:text-primary">Machine Learning Approaches in Genomic Sequencing...</td>
                  <td className="py-4 px-4 text-on-surface-variant">Oct 12, 2024</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim">Published</span>
                  </td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-4 font-semibold text-on-surface group-hover:text-primary">Quantitative Analysis of Global Collaboration Networks</td>
                  <td className="py-4 px-4 text-on-surface-variant">Sep 28, 2024</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim">Under Review</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-4 font-semibold text-on-surface group-hover:text-primary">Longitudinal Studies on Interdisciplinary Research Impact</td>
                  <td className="py-4 px-4 text-on-surface-variant">Aug 15, 2024</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim">Draft</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Projects List */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Active Projects</h2>
          </div>
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-secondary transition-colors cursor-pointer bg-surface-container-low/50">
              <h4 className="font-body-md font-semibold text-on-surface mb-1">Project GENESIS</h4>
              <p className="font-body-md text-xs text-on-surface-variant mb-3">Multi-institution genomic analysis.</p>
              <div className="w-full bg-surface-variant rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-on-surface-variant font-label-sm">
                <span>Progress: 75%</span>
                <span>Due: Nov 2024</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-secondary transition-colors cursor-pointer bg-surface-container-low/50">
              <h4 className="font-body-md font-semibold text-on-surface mb-1">Network Dynamics Lab</h4>
              <p className="font-body-md text-xs text-on-surface-variant mb-3">Studying academic collaboration flow.</p>
              <div className="w-full bg-surface-variant rounded-full h-1.5">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-on-surface-variant font-label-sm">
                <span>Progress: 40%</span>
                <span>Due: Jan 2025</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg font-body-md font-semibold text-on-surface hover:bg-surface-container transition-colors text-sm">
            View All Projects
          </button>
        </div>
      </div>

      {/* Bottom Section: Conferences & Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Recent Conferences */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
          <h2 className="font-headline-md text-on-surface mb-6">Upcoming Conferences</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex flex-col items-center justify-center leading-none">
                <span className="font-bold text-sm">NOV</span>
                <span className="text-xs">12</span>
              </div>
              <div>
                <h4 className="font-body-md font-semibold text-on-surface">International Summit on Data Science</h4>
                <p className="font-body-md text-sm text-on-surface-variant">Boston, MA • Keynote Speaker</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-surface-container-high text-on-surface rounded-lg flex flex-col items-center justify-center leading-none">
                <span className="font-bold text-sm">DEC</span>
                <span className="text-xs">05</span>
              </div>
              <div>
                <h4 className="font-body-md font-semibold text-on-surface">Global Research Collab Forum 2024</h4>
                <p className="font-body-md text-sm text-on-surface-variant">Virtual • Panelist</p>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Network Highlights */}
        <div className="bg-primary rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-end min-h-[250px]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <CollaborationNetworkGraph data={mockGraphData} width={600} height={300} />
          </div>
          <div className="relative z-10 text-white">
            <h3 className="font-headline-md text-xl mb-2">Expand Your Network</h3>
            <p className="font-body-md text-inverse-primary text-sm mb-4 max-w-sm">Discover potential collaborators based on your recent publication history and research focus.</p>
            <button className="bg-white text-primary font-body-md font-semibold px-5 py-2 rounded-full hover:bg-surface-container transition-colors text-sm">
              Explore Connections
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
