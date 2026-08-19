import React from 'react';

export default function ResearcherDashboard({ onLogout }) {
  return (
    <div className="bg-background text-on-background font-body-md antialiased h-screen overflow-hidden flex w-full">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col bg-surface border-r border-outline-variant/50 py-stack-sm z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xl">
              S
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary">SCNA</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Network Analyzer</p>
            </div>
          </div>
        </div>
        <div className="px-4 mb-6">
          <button className="w-full bg-primary-container text-on-primary rounded-full py-3 px-4 font-label-sm text-label-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            New Project
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {/* Active Navigation */}
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold bg-surface-container-low transition-colors group" href="#dashboard">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">dashboard</span>
            <span className="font-label-sm text-label-sm">Dashboard</span>
          </a>
          {/* Inactive Navigation */}
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors group" href="#publications">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:scale-110 transition-transform">description</span>
            <span className="font-label-sm text-label-sm">Publications</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors group" href="#collaborations">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:scale-110 transition-transform">hub</span>
            <span className="font-label-sm text-label-sm">Collaborations</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors group" href="#conferences">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:scale-110 transition-transform">event</span>
            <span className="font-label-sm text-label-sm">Conferences</span>
          </a>
        </div>
        <div className="px-4 mt-auto space-y-2 border-t border-outline-variant/50 pt-4">
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" href="#settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-sm text-label-sm">Settings</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" href="#support">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-sm text-label-sm">Support</span>
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="sticky top-0 w-full z-30 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 flex justify-between items-center h-16 px-gutter">
          <button className="lg:hidden text-on-surface-variant mr-4">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 font-body-md text-sm text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-all" 
                placeholder="Search publications, authors, or data..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[20px]">language</span>
              <span>EN/ES</span>
            </button>
            <div className="h-6 w-px bg-outline-variant"></div>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={onLogout}>
              <img 
                className="w-8 h-8 rounded-full object-cover border border-outline-variant" 
                alt="Profile" 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              />
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto bg-surface-bright p-gutter lg:p-container-padding scroll-smooth">
          <div className="max-w-[1536px] mx-auto space-y-stack-lg">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-headline-lg md:font-headline-lg text-headline-lg md:text-headline-lg font-bold text-primary mb-2">
                  Welcome back, Dr. Aris Thorne
                </h2>
                <p className="font-body-md text-on-surface-variant">Institute of Quantum Computing | Physics Department</p>
              </div>
              <button className="bg-primary-container text-on-primary rounded-full px-6 py-3 font-label-sm text-label-sm flex items-center gap-2 hover:scale-95 transition-transform shadow-sm">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                New Publication
              </button>
            </div>

            {/* Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-sm">
              {/* Stat 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined">library_books</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-green-600">trending_up</span> +2 this month
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Publications</p>
                <h3 className="font-headline-lg text-headline-lg font-bold text-primary">42</h3>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">Active</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Active Projects</p>
                <h3 className="font-headline-lg text-headline-lg font-bold text-primary">8</h3>
              </div>

              {/* Stat 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Collaborators</p>
                <h3 className="font-headline-lg text-headline-lg font-bold text-primary">124</h3>
              </div>

              {/* Stat 4 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined">format_quote</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-green-600">trending_up</span> +45 this year
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Citations</p>
                <h3 className="font-headline-lg text-headline-lg font-bold text-primary">1.2k</h3>
              </div>
            </div>

            {/* Main Content Layout (8 + 4 columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-sm lg:gap-stack-md">
              {/* Left Column (Span 8) */}
              <div className="lg:col-span-8 space-y-stack-sm lg:space-y-stack-md">
                
                {/* Collaboration Network Visualization */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-md text-headline-md font-bold text-primary">Collaboration Network</h3>
                    <button className="text-primary-container hover:bg-surface-container-low rounded-full p-2 transition-colors">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                  {/* Mock Visualization Area */}
                  <div className="h-[300px] w-full bg-surface-container-low rounded-lg border border-outline-variant/50 relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#c5c6cf 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    {/* Placeholder for D3/Network Graph */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                      <svg height="100%" viewBox="0 0 400 300" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <line opacity="0.3" stroke="#081b3a" strokeWidth="1" x1="200" x2="100" y1="150" y2="80"></line>
                        <line opacity="0.6" stroke="#081b3a" strokeWidth="2" x1="200" x2="320" y1="150" y2="100"></line>
                        <line opacity="0.4" stroke="#081b3a" strokeWidth="1.5" x1="200" x2="250" y1="150" y2="250"></line>
                        <line opacity="0.2" stroke="#081b3a" strokeWidth="1" x1="200" x2="80" y1="150" y2="200"></line>
                        <circle className="animate-pulse" cx="200" cy="150" fill="#081b3a" r="16"></circle>
                        <circle cx="100" cy="80" fill="#7384a8" r="8"></circle>
                        <circle cx="320" cy="100" fill="#7384a8" r="12"></circle>
                        <circle cx="250" cy="250" fill="#7384a8" r="10"></circle>
                        <circle cx="80" cy="200" fill="#7384a8" r="6"></circle>
                      </svg>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-4 font-label-sm text-label-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                      <span>Core Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-on-primary-container"></div>
                      <span>Satellite Researchers</span>
                    </div>
                  </div>
                </div>

                {/* Recent Publications Table */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
                    <h3 className="font-headline-md text-headline-md font-bold text-primary">Recent Publications</h3>
                    <button className="text-primary-container font-label-sm text-label-sm hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant/50">
                          <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Title</th>
                          <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                          <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Co-Authors</th>
                          <th className="p-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-md text-sm text-on-surface divide-y divide-outline-variant/50">
                        <tr className="hover:bg-surface/50 transition-colors">
                          <td className="p-4 font-semibold text-primary max-w-xs truncate" title="Quantum Entanglement in Macroscopic Systems">Quantum Entanglement in Macroscopic Systems</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wide">Published</span>
                          </td>
                          <td className="p-4">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-primary-container">JD</div>
                              <div className="w-6 h-6 rounded-full bg-secondary-container border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-on-secondary-container">SL</div>
                            </div>
                          </td>
                          <td className="p-4 text-on-surface-variant">Oct 12, 2023</td>
                        </tr>
                        <tr className="hover:bg-surface/50 transition-colors">
                          <td className="p-4 font-semibold text-primary max-w-xs truncate" title="Topological Insulators for Next-Gen Computing">Topological Insulators for Next-Gen...</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-inverse-on-surface text-on-surface-variant text-[10px] font-bold uppercase tracking-wide border border-outline-variant">Submitted</span>
                          </td>
                          <td className="p-4">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-tertiary-container border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-on-tertiary">MK</div>
                            </div>
                          </td>
                          <td className="p-4 text-on-surface-variant">Sep 28, 2023</td>
                        </tr>
                        <tr className="hover:bg-surface/50 transition-colors">
                          <td className="p-4 font-semibold text-primary max-w-xs truncate" title="Decoherence Metrics in Superconducting Qubits">Decoherence Metrics in Superconducting...</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wide border border-outline-variant border-dashed">Draft</span>
                          </td>
                          <td className="p-4">
                            <div className="text-on-surface-variant text-xs italic">Pending</div>
                          </td>
                          <td className="p-4 text-on-surface-variant">--</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (Span 4) */}
              <div className="lg:col-span-4 space-y-stack-sm lg:space-y-stack-md">
                
                {/* Active Projects (Progress) */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <h3 className="font-headline-md text-headline-md font-bold text-primary mb-6">Active Projects</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-body-md text-sm font-semibold text-primary">Topological Data Analysis</span>
                        <span className="font-label-sm text-label-sm text-primary-container">75%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2">
                        <div className="bg-primary-container h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-body-md text-sm font-semibold text-primary">Neural Network Scalability</span>
                        <span className="font-label-sm text-label-sm text-primary-container">42%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2">
                        <div className="bg-primary-container h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Conferences */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <h3 className="font-headline-md text-headline-md font-bold text-primary mb-4">Upcoming Conferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/50">
                      <div className="w-10 h-10 rounded bg-surface-container flex flex-col items-center justify-center text-primary-container flex-shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                        <span className="text-[10px] font-bold uppercase leading-none">Nov</span>
                        <span className="text-sm font-bold leading-none mt-1">12</span>
                      </div>
                      <div>
                        <h4 className="font-body-md text-sm font-semibold text-primary group-hover:text-primary-container transition-colors">Global Network Analysis 2024</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant font-normal">Geneva, Switzerland</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/50">
                      <div className="w-10 h-10 rounded bg-surface-container flex flex-col items-center justify-center text-primary-container flex-shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                        <span className="text-[10px] font-bold uppercase leading-none">Dec</span>
                        <span className="text-sm font-bold leading-none mt-1">05</span>
                      </div>
                      <div>
                        <h4 className="font-body-md text-sm font-semibold text-primary group-hover:text-primary-container transition-colors">AI in Research Summit</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant font-normal">Virtual Event</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity (Timeline) */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                  <h3 className="font-headline-md text-headline-md font-bold text-primary mb-6">Recent Activity</h3>
                  <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/50">
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-primary-container outline outline-4 outline-surface-container-lowest"></div>
                      <p className="font-body-md text-sm text-primary">New citation added to <span className="font-semibold">Quantum Dynamics</span></p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-1">2 hours ago</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-on-primary-container outline outline-4 outline-surface-container-lowest"></div>
                      <p className="font-body-md text-sm text-primary"><span className="font-semibold">Dr. Sarah J.</span> invited you to collaborate.</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-1">Yesterday</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-outline outline outline-4 outline-surface-container-lowest"></div>
                      <p className="font-body-md text-sm text-primary">Manuscript <span className="font-semibold">Decoherence Metrics</span> approved.</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-1">Oct 15, 2023</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Section: Quick Reports Strip */}
            <div className="pt-8 pb-12">
              <h3 className="font-headline-md text-headline-md font-bold text-primary mb-4">Quick Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary-container hover:bg-surface-container-low transition-all text-left group">
                  <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">picture_as_pdf</span>
                  <span className="font-body-md text-sm font-semibold text-primary">Export Publication Report</span>
                </button>
                <button className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary-container hover:bg-surface-container-low transition-all text-left group">
                  <span className="material-symbols-outlined text-green-700 group-hover:scale-110 transition-transform">table_chart</span>
                  <span className="font-body-md text-sm font-semibold text-primary">Export Collaboration Report</span>
                </button>
                <button className="flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary-container hover:bg-surface-container-low transition-all text-left group">
                  <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">analytics</span>
                  <span className="font-body-md text-sm font-semibold text-primary">View Institution Analytics</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
