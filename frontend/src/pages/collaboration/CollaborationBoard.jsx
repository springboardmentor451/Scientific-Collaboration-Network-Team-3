import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collaborationService } from '../../services/collaborationService';
import CollaborationNetworkGraph from '../../components/charts/CollaborationNetworkGraph';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CollaborationBoard() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    collaborationService
      .list()
      .then(setCollaborations)
      .catch(() => setError('Could not load collaborations.'))
      .finally(() => setLoading(false));
  }, []);

  const mockGraphData = {
    nodes: [
      { id: '1', group: 1 },
      { id: '2', group: 2 },
      { id: '3', group: 2 },
      { id: '4', group: 3 },
    ],
    links: [
      { source: '1', target: '2', value: 1 },
      { source: '2', target: '3', value: 1 },
      { source: '1', target: '4', value: 1 },
    ]
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Collaboration Board"
        subtitle="Track research networks, active projects, and institutional partnerships."
        actions={
          <Button variant="secondary" icon="download">Export Report</Button>
        }
      />

      {error && <ErrorState message={error} />}
      {loading && <LoadingSpinner className="py-12" />}
      {!loading && !error && (

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Co-Author Network */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-[18px] font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span> Co-Author Network
            </h3>
            <button className="text-secondary font-label-sm hover:underline">View Full Graph</button>
          </div>
          <div className="flex-1 relative bg-surface-bright rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px] flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-40">
              <CollaborationNetworkGraph data={mockGraphData} width={800} height={400} />
            </div>
            <div className="relative z-10 text-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-outline-variant/30 shadow-sm">
               <p className="font-body-md font-semibold text-primary">Interactive Graph Visualization</p>
               <p className="text-xs text-on-surface-variant">Real graph component renders here</p>
            </div>
          </div>
        </section>

        {/* Find New Collaborators */}
        <section className="lg:col-span-4 bg-primary-container text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">person_add</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-headline-md mb-2 font-bold">Expand Your Network</h3>
            <p className="font-body-md text-inverse-primary mb-6 text-sm">Discover researchers with matching methodology profiles and recent publications in your field.</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 backdrop-blur-sm border border-white/5">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm">AS</div>
                <div>
                  <p className="font-label-sm text-white">Dr. A. Schmidt</p>
                  <p className="text-[12px] text-inverse-primary">Max Planck Institute • 94% Match</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 backdrop-blur-sm border border-white/5">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-sm">LG</div>
                <div>
                  <p className="font-label-sm text-white">Dr. L. Gomez</p>
                  <p className="text-[12px] text-inverse-primary">Stanford • 88% Match</p>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full bg-white text-primary font-semibold py-3 rounded-full hover:bg-surface-container-low transition-colors z-10 relative shadow-sm text-sm">
            View All Suggestions
          </button>
        </section>

        {/* Active Research Projects */}
        <section className="lg:col-span-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-[20px] font-bold text-primary">Active Research Projects</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collaborations.map(collab => (
              <div key={collab.id} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">{collab.status || 'Active'}</span>
                    <span className="material-symbols-outlined text-outline">bookmark_border</span>
                  </div>
                  <h4 className="font-headline-md text-[18px] font-bold text-primary mb-2 leading-tight">{collab.title}</h4>
                  <p className="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-2">Cross-institutional collaboration focusing on {collab.title.toLowerCase()} methodologies.</p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-semibold text-on-surface-variant mb-2">
                      <span>Progress</span>
                      <span>{collab.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${collab.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4 mt-auto">
                  <div className="flex -space-x-2">
                    {collab.members?.slice(0, 3).map((m, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface-container-lowest flex items-center justify-center text-[10px] font-bold text-on-surface bg-surface-container-high`} title={m}>
                        {m.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span> {collab.dueDate || 'Dec 2024'}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Add New Project Card */}
            <div onClick={() => navigate('/collaborations/teams')} className="bg-surface-bright rounded-2xl p-6 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer min-h-[250px]">
              <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">add</span>
              </div>
              <h4 className="font-headline-md text-[18px] font-bold text-primary mb-2">Initiate New Project</h4>
              <p className="font-body-md text-sm text-on-surface-variant">Setup a new collaboration workspace and invite peers.</p>
            </div>
          </div>
        </section>
        
        {/* Institutional Collaborations */}
        <section className="lg:col-span-12 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row min-h-[350px]">
          <div className="p-6 md:w-1/3 flex flex-col border-r border-outline-variant bg-surface-container-lowest z-10">
            <h3 className="font-headline-md text-[18px] font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>public</span> Global Partnerships
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">Active institutional agreements and shared resource hubs.</p>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer">
                <h4 className="font-headline-md text-sm font-bold text-primary">CERN</h4>
                <p className="text-xs font-semibold text-on-surface-variant flex justify-between mt-2">
                  <span>Geneva, CH</span> 
                  <span className="text-secondary">3 Active Projects</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer bg-surface-container-low/50">
                <h4 className="font-headline-md text-sm font-bold text-primary">MIT Media Lab</h4>
                <p className="text-xs font-semibold text-on-surface-variant flex justify-between mt-2">
                  <span>Cambridge, USA</span> 
                  <span className="text-secondary">1 Active Project</span>
                </p>
              </div>
            </div>
            <button className="mt-6 w-full border border-primary text-primary font-semibold py-2 rounded-full hover:bg-surface-container-low transition-colors text-sm">
              View All Directory
            </button>
          </div>
          
          <div className="bg-surface-container-highest flex-1 relative flex items-center justify-center p-8">
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-outline-variant/30 shadow-sm max-w-sm">
               <span className="material-symbols-outlined text-[48px] text-outline mb-2">map</span>
               <p className="font-body-md font-semibold text-primary">Interactive Map</p>
               <p className="text-xs text-on-surface-variant">Global institutional partners would be plotted here using a map component.</p>
            </div>
          </div>
        </section>
      </div>
      )}
    </div>
  );
}
