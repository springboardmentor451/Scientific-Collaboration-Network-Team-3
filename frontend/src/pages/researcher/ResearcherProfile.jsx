import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { researcherService } from '../../services/researcherService';

export default function ResearcherProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    setProfile(null);
    researcherService.getById(id || '1').then((data) => {
      if (!data) {
        setError('This researcher could not be found.');
        return;
      }
      setProfile(data);
    }).catch(() => setError('Could not load this profile.'));
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px] text-error">error_outline</span>
        </div>
        <h3 className="font-headline-md text-on-surface mb-2">Profile unavailable</h3>
        <p className="text-on-surface-variant">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-pulse">
        <div className="lg:col-span-8 h-64 rounded-card bg-surface-container" />
        <div className="lg:col-span-4 h-64 rounded-card bg-surface-container" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Hero Profile Card */}
        <div className="md:col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-4xl font-bold text-primary z-10 overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          
          <div className="flex-1 z-10 w-full">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="font-display-lg-mobile md:font-headline-lg text-primary mb-1 font-bold">{profile.name}</h1>
                <p className="font-headline-md text-on-surface-variant text-lg">{profile.department}</p>
                <p className="text-secondary font-body-md flex items-center gap-2 mt-2 font-semibold">
                  <span className="material-symbols-outlined text-sm">domain</span> {profile.institution}
                </p>
              </div>
              <button className="border border-primary text-primary hover:bg-surface-container-low px-6 py-2 rounded-full font-semibold transition-colors text-sm">
                Contact
              </button>
            </div>
            <div className="mt-6 border-t border-outline-variant/30 pt-6">
              <h3 className="font-label-sm text-on-surface-variant mb-2">About</h3>
              <p className="font-body-md text-on-surface">
                Pioneering research in quantum network architectures and decentralized data validation. Leading a global team to bridge the gap between theoretical physics and scalable computational models. Passionate about fostering interdisciplinary collaborations across institutions.
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Card */}
        <div className="md:col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-50"></div>
          <h3 className="font-headline-md text-lg z-10 mb-6 flex items-center gap-2 font-bold text-white">
            <span className="material-symbols-outlined">analytics</span> Impact Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4 z-10">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <p className="font-label-sm text-inverse-primary mb-1">Publications</p>
              <p className="font-display-lg-mobile text-white">142</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <p className="font-label-sm text-inverse-primary mb-1">Citations</p>
              <p className="font-display-lg-mobile text-white">8.4k</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 col-span-2">
              <div className="flex justify-between items-center">
                <p className="font-label-sm text-inverse-primary">h-index</p>
                <span className="material-symbols-outlined text-inverse-primary">trending_up</span>
              </div>
              <p className="font-display-lg-mobile text-white">45</p>
            </div>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="md:col-span-6 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
          <h3 className="font-headline-md text-lg text-primary mb-4 flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined">psychology</span> Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Quantum Computing', 'Machine Learning', 'Data Analysis', 'Algorithm Design', 'Cryptography'].map(skill => (
              <span key={skill} className="bg-surface-container-low text-on-surface px-4 py-1.5 rounded-full font-label-sm border border-outline-variant/50">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Research Interests & Affiliations */}
        <div className="md:col-span-6 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-lg text-primary mb-4 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">explore</span> Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-secondary-fixed/50 text-on-secondary-fixed-variant px-4 py-1.5 rounded-full font-label-sm border border-secondary-fixed-dim/50">Decentralized Networks</span>
              <span className="bg-secondary-fixed/50 text-on-secondary-fixed-variant px-4 py-1.5 rounded-full font-label-sm border border-secondary-fixed-dim/50">Predictive Maintenance</span>
              <span className="bg-secondary-fixed/50 text-on-secondary-fixed-variant px-4 py-1.5 rounded-full font-label-sm border border-secondary-fixed-dim/50">Network Topology</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-lg text-primary mb-4 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">account_balance</span> Affiliations
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 font-body-md text-on-surface">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">school</span>
                </div>
                <span className="font-semibold">University of Tokyo</span>
                <span className="text-on-surface-variant text-sm ml-auto">2018 - Present</span>
              </li>
              <li className="flex items-center gap-3 font-body-md text-on-surface">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">school</span>
                </div>
                <span className="font-semibold">Stanford University</span>
                <span className="text-on-surface-variant text-sm ml-auto">2012 - 2018</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Publications List */}
        <div className="md:col-span-12 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-primary flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">article</span> Recent Publications
            </h3>
            <button className="text-secondary font-label-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Scalable Validation in Quantum Networks</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Published in <span className="italic">Journal of Advanced Physics</span> • Oct 2023</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-semibold bg-surface-container px-2 py-1 rounded text-on-surface-variant">Peer Reviewed</span>
                    <span className="text-sm text-primary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-xs">format_quote</span> 42 Citations</span>
                  </div>
                </div>
                <button className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">open_in_new</span>
                </button>
              </div>
            </div>
            <div className="p-4 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors">Predictive Modeling of Decentralized Topologies</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Published in <span className="italic">IEEE Transactions on Network Science</span> • Mar 2023</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-semibold bg-surface-container px-2 py-1 rounded text-on-surface-variant">Open Access</span>
                    <span className="text-sm text-primary-fixed-dim flex items-center gap-1"><span className="material-symbols-outlined text-xs">format_quote</span> 18 Citations</span>
                  </div>
                </div>
                <button className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
