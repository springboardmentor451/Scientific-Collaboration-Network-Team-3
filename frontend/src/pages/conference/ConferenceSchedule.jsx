import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';

export default function ConferenceSchedule() {
  const navigate = useNavigate();
  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Conference Schedule"
        subtitle="Sessions across registered events."
        actions={
          <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/conferences')}>
            Back to List
          </Button>
        }
      />

      <Card>
        <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/50">
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-primary outline outline-4 outline-surface-container-lowest" />
            <div className="bg-surface-container-low p-4 rounded-xl ml-4">
              <span className="font-label-sm text-secondary">Nov 12, 2024 • 09:00 AM</span>
              <h3 className="font-bold text-primary mt-1">Keynote: Network Dynamics</h3>
              <p className="font-body-md text-on-surface-variant mt-2">
                Opening remarks by Dr. James Chen at Global Network Analysis 2024.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-outline outline outline-4 outline-surface-container-lowest" />
            <div className="bg-surface-container p-4 rounded-xl ml-4">
              <span className="font-label-sm text-on-surface-variant">Dec 05, 2024 • 14:00</span>
              <h3 className="font-bold text-primary mt-1">Panel: AI in Research</h3>
              <p className="font-body-md text-on-surface-variant mt-2">Virtual session discussing scalable models.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
