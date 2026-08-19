import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <>
      {/* Page Header is implicitly in the Navbar for Admin, but we can add a welcome message here to match the body */}
      <PageHeader
        title="System Overview Dashboard"
        subtitle="Global platform metrics and administration."
      />

      {/* High-Level Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Total Researchers</h3>
            <div className="p-2 bg-primary-fixed rounded-lg text-on-primary-fixed">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">12,450</p>
            <p className="font-body-md text-secondary text-sm mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +5.2% this month
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Partner Institutions</h3>
            <div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">842</p>
            <p className="font-body-md text-secondary text-sm mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span> +12 new this quarter
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm text-on-surface-variant">Global Publications</h3>
            <div className="p-2 bg-tertiary-fixed rounded-lg text-on-tertiary-fixed">
              <span className="material-symbols-outlined">library_books</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-on-surface font-bold">1.2M</p>
            <p className="font-body-md text-outline text-sm mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">sync</span> Indexed daily
            </p>
          </div>
        </div>

        {/* Stat Card 4 (Health) */}
        <div className="bg-primary-container p-6 rounded-card shadow-card flex flex-col text-on-primary-container">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-sm">System Health</h3>
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
          </div>
          <div className="mt-auto">
            <p className="font-display-lg-mobile text-white font-bold">99.9%</p>
            <p className="font-body-md text-primary-fixed-dim text-sm mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> All services operational
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
            <button className="text-primary font-body-md font-semibold text-sm border border-outline-variant px-3 py-1 rounded-full hover:bg-surface-container transition-colors">Last 12 Months</button>
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
            <span className="font-body-md text-outline relative z-10 bg-surface/80 px-4 py-2 rounded-full shadow-sm font-semibold">Chart Visualization Area</span>
          </div>
        </div>

        {/* Institutional Analytics */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30 flex flex-col">
          <h2 className="font-headline-md text-on-surface mb-6">Top Institutions</h2>
          <div className="space-y-4 flex-1">
            {[
              { rank: 1, name: 'MIT', count: '12.4k', pct: '85%' },
              { rank: 2, name: 'Stanford Univ.', count: '9.8k', pct: '70%' },
              { rank: 3, name: 'Oxford', count: '8.1k', pct: '60%' },
              { rank: 4, name: 'ETH Zurich', count: '6.2k', pct: '45%' },
            ].map((inst) => (
              <div key={inst.rank} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-label-sm text-primary">{inst.rank}</div>
                <div className="flex-1">
                  <p className="font-label-sm text-on-surface">{inst.name}</p>
                  <div className="w-full bg-surface-container h-2 rounded-full mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: inst.pct }}></div>
                  </div>
                </div>
                <span className="font-body-md text-outline text-sm font-semibold">{inst.count}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-outline-variant rounded-full font-body-md font-semibold text-primary hover:bg-surface-container transition-colors">View Full List</button>
        </div>
      </section>

      {/* Bottom Row: Activity & Users */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        {/* Recent Activity Log */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">Recent Activity</h2>
            <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-secondary"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">New Institution Registered: <span className="font-label-sm">University of Tokyo</span></p>
                <p className="font-body-md text-sm text-outline">2 mins ago</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-primary"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">Bulk data sync completed (<span className="font-label-sm">5,430 records</span>)</p>
                <p className="font-body-md text-sm text-outline">15 mins ago • System</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-error-red"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">Failed login attempt alert</p>
                <p className="font-body-md text-sm text-outline">1 hour ago • IP: 192.168.1.1</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-secondary"></div>
              <div>
                <p className="font-body-md text-on-surface font-semibold">User <span className="font-label-sm">Dr. Sarah Chen</span> upgraded to Reviewer</p>
                <p className="font-body-md text-sm text-outline">3 hours ago</p>
              </div>
            </li>
          </ul>
        </div>

        {/* User Management Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-card shadow-card border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-on-surface">User Management</h2>
            <button className="bg-primary text-white font-body-md font-semibold px-4 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors text-sm">Add User</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50">
                  <th className="py-3 font-label-sm text-on-surface-variant">Name</th>
                  <th className="py-3 font-label-sm text-on-surface-variant">Role</th>
                  <th className="py-3 font-label-sm text-on-surface-variant">Status</th>
                  <th className="py-3 font-label-sm text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm font-semibold">
                <tr className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 text-on-surface font-label-sm">Dr. J. Smith</td>
                  <td className="py-3 text-outline">Researcher</td>
                  <td className="py-3"><span className="bg-primary-fixed text-on-primary-fixed text-xs px-2 py-1 rounded-full">Active</span></td>
                  <td className="py-3 text-right"><button className="text-primary hover:underline font-label-sm text-sm">Edit</button></td>
                </tr>
                <tr className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 text-on-surface font-label-sm">A. Patel</td>
                  <td className="py-3 text-outline">Inst. Admin</td>
                  <td className="py-3"><span className="bg-primary-fixed text-on-primary-fixed text-xs px-2 py-1 rounded-full">Active</span></td>
                  <td className="py-3 text-right"><button className="text-primary hover:underline font-label-sm text-sm">Edit</button></td>
                </tr>
                <tr className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 text-on-surface font-label-sm">M. Dubois</td>
                  <td className="py-3 text-outline">Reviewer</td>
                  <td className="py-3"><span className="bg-surface-variant text-on-surface-variant text-xs px-2 py-1 rounded-full">Pending</span></td>
                  <td className="py-3 text-right"><button className="text-primary hover:underline font-label-sm text-sm">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
