import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicationService } from '../../services/publicationService';
import FileUpload from '../../components/common/FileUpload';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Card from '../../components/common/Card';

export default function PublicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    type: 'Journal Article',
    date: '',
    status: 'Draft',
    doi: '',
  });

  useEffect(() => {
    if (!id) return;
    setLoadError(null);
    publicationService
      .list()
      .then((list) => {
        const existing = list.find((p) => p.id === id);
        if (existing) setFormData((current) => ({ ...current, ...existing }));
        else setLoadError('That publication could not be found.');
      })
      .catch(() => setLoadError('Could not load this publication.'));
  }, [id]);

  const errors = useMemo(() => {
    const next = {};
    if (!String(formData.title || '').trim()) next.title = 'Title is required.';
    if (!formData.type) next.type = 'Choose a publication type.';
    return next;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e, forceStatus) => {
    e.preventDefault();
    setTouched({ title: true, type: true });
    if (!isValid) return;
    setFormError('');
    setSubmitting(true);
    const submitData = { ...formData };
    if (forceStatus) submitData.status = forceStatus;
    try {
      if (id) {
        await publicationService.update(id, submitData);
      } else {
        await publicationService.create(submitData);
      }
      navigate('/publications');
    } catch {
      setFormError('Could not save this publication. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-stack-md">
      <PageHeader
        title={id ? 'Edit Publication' : 'Create Publication'}
        subtitle="Add a new manuscript, patent, or dataset to the network."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" disabled={!isValid || submitting} onClick={(e) => handleSubmit(e, 'Draft')}>
              Save Draft
            </Button>
            <Button disabled={!isValid || submitting} onClick={(e) => handleSubmit(e, 'Submitted')}>
              {submitting ? 'Saving…' : 'Submit Publication'}
            </Button>
          </div>
        }
      />

      {loadError && (
        <div className="scna-auth-alert" role="alert">{loadError}</div>
      )}
      {formError && (
        <div className="scna-auth-alert" role="alert">{formError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-stack-md">
          <Card>
            <h2 className="font-label-sm text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              Core Information
            </h2>
            <div className="space-y-6">
              <Input
                id="title"
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                error={touched.title ? errors.title : undefined}
                placeholder="Enter publication title..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-on-surface-variant" htmlFor="type">Publication Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-input px-4 py-3 font-body-md bg-surface focus:outline-none focus:border-primary"
                  >
                    <option>Journal Article</option>
                    <option>Conference Paper</option>
                    <option>Patent</option>
                    <option>Dataset</option>
                    <option>Book Chapter</option>
                  </select>
                </div>
                <Input id="date" name="date" label="Publication Date" type="date" value={formData.date || ''} onChange={handleChange} />
              </div>
              <TextArea
                id="abstract"
                name="abstract"
                label="Abstract / Summary"
                value={formData.abstract || ''}
                onChange={handleChange}
                placeholder="Provide a brief summary of the research..."
              />
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-label-sm text-primary flex items-center gap-2 uppercase tracking-wider">
                <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                Authors & Collaborators
              </h2>
              <button type="button" className="text-secondary font-label-sm hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">add</span> Add Author
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-bright">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">ER</div>
                <div>
                  <p className="font-body-md text-primary font-semibold">Dr. Elena Rossi</p>
                  <p className="text-xs text-on-surface-variant">Primary Author • SCNA Institute</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-stack-md">
          <Card>
            <h2 className="font-label-sm text-primary mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
              Manuscript / Files
            </h2>
            <FileUpload accept=".pdf,.docx,.zip" />
          </Card>
          <div className="bg-primary rounded-card p-6 shadow-card text-white">
            <h2 className="font-label-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>label</span>
              Metadata & Tags
            </h2>
            <p className="text-sm text-white/80 mb-4">Tagging improves visibility in the network map.</p>
            <Input
              label="Keywords"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="e.g., Quantum, Networking..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
