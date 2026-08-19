import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';

export default function ReviewerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Reviewer Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Reviewer'}. Here is your peer review queue.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Pending Reviews</h3>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">12</div>
            <p className="font-body-md text-[12px] text-error-red mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">priority_high</span> 3 urgent
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Completed</h3>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">45</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +8 this month
            </p>
          </div>
        </div>
        
        {/* Placeholder cards to match 4-column layout */}
        <div className="bg-surface-container-lowest rounded-card p-6 shadow-card border border-outline-variant/30 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Avg Turnaround</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <span className="material-symbols-outlined">timer</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-on-surface font-bold leading-none">4d</div>
            <p className="font-body-md text-[12px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              Better than average
            </p>
          </div>
        </div>

        <div className="bg-primary-container rounded-card p-6 shadow-card flex flex-col justify-between h-full text-on-primary-container">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm uppercase tracking-wider">Reviewer Score</h3>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined">star</span>
            </div>
          </div>
          <div>
            <div className="font-headline-lg font-bold leading-none">4.9</div>
            <p className="font-body-md text-[12px] mt-2 font-semibold">Highly rated</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-on-surface">Peer Review Queue</h2>
          <button className="bg-primary text-white font-body-md font-semibold px-4 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/50">
                <th className="py-3 px-4 font-label-sm text-on-surface-variant">Submission Title</th>
                <th className="py-3 px-4 font-label-sm text-on-surface-variant">Journal</th>
                <th className="py-3 px-4 font-label-sm text-on-surface-variant">Due Date</th>
                <th className="py-3 px-4 font-label-sm text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm font-semibold">
              <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-4 text-on-surface">Quantum Error Correction using Surface Codes</td>
                <td className="py-4 px-4 text-on-surface-variant">Nature Physics</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-on-error-container border border-error-red/20">Tomorrow</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-primary hover:underline font-label-sm">Start Review</button>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-4 text-on-surface">Novel Materials for Superconducting Qubits</td>
                <td className="py-4 px-4 text-on-surface-variant">Physical Review Letters</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim">In 5 Days</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-primary hover:underline font-label-sm">Continue</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
