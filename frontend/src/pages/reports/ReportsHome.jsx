import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const REPORTS = [
  {
    type: 'publications',
    title: 'Publications',
    description: 'Export full history of manuscripts, datasets, and patents.',
    icon: 'description',
    iconWrap: 'bg-primary-fixed text-on-primary-fixed',
  },
  {
    type: 'collaborations',
    title: 'Collaborations',
    description: 'Export network metrics, active projects, and institutional maps.',
    icon: 'hub',
    iconWrap: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  {
    type: 'citations',
    title: 'Citations',
    description: 'Export citation graphs and cross-disciplinary impact analysis.',
    icon: 'format_quote',
    iconWrap: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
];

export default function ReportsHome() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(null);

  const handleExport = async (type, format) => {
    const key = `${type}-${format}`;
    setBusy(key);
    setStatus(null);
    try {
      const result = await reportService.exportReport(type, format);
      if (result.success) {
        setStatus({ tone: 'ok', message: `Export ready: ${result.url}` });
      } else {
        setStatus({ tone: 'err', message: 'Export did not complete.' });
      }
    } catch {
      setStatus({ tone: 'err', message: 'Export failed. Try again.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate and download comprehensive analytics reports."
      />
      {status && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            status.tone === 'ok'
              ? 'bg-secondary-fixed text-on-secondary-fixed'
              : 'bg-error-container text-on-error-container'
          }`}
          role="status"
        >
          {status.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {REPORTS.map((report) => (
          <Card key={report.type} className="flex flex-col justify-between h-full">
            <div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${report.iconWrap}`}>
                <span className="material-symbols-outlined text-[24px]">{report.icon}</span>
              </div>
              <h3 className="font-bold text-lg text-primary mb-2">{report.title}</h3>
              <p className="text-sm text-on-surface-variant mb-6">{report.description}</p>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={busy === `${report.type}-pdf`}
                onClick={() => handleExport(report.type, 'pdf')}
              >
                {busy === `${report.type}-pdf` ? 'Exporting…' : 'PDF'}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                disabled={busy === `${report.type}-excel`}
                onClick={() => handleExport(report.type, 'excel')}
              >
                {busy === `${report.type}-excel` ? 'Exporting…' : 'Excel'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
