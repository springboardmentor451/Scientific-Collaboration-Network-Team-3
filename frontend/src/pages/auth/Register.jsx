import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import AuthLayout from '../../components/layout/AuthLayout';
import { parseAuthError } from '../../utils/authErrors';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [lang, setLang] = useState('EN');
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    role: 'Researcher',
    password: '',
    confirmPassword: '',
  });

  const roles = ['Researcher', 'Institution Admin', 'Reviewer', 'System Admin'];

  const errors = useMemo(() => {
    const next = {};
    if (!formData.name.trim()) next.name = 'Name is required.';
    if (!formData.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Enter a valid email.';
    if (!formData.institution.trim()) next.institution = 'Institution is required.';
    if (formData.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    return next;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, institution: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setFormError('');
    setSubmitting(true);
    try {
      await authService.register(formData);
      login(formData.role);
      navigate('/');
    } catch (error) {
      setFormError(parseAuthError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      lang={lang}
      setLang={setLang}
      carouselIndex={carouselIndex}
      onPrev={() => setCarouselIndex((prev) => (prev === 1 ? 5 : prev - 1))}
      onNext={() => setCarouselIndex((prev) => (prev % 5) + 1)}
    >
      <div className="scna-login-card" style={{ maxWidth: '500px' }}>
        <h2 className="scna-card-title">Create an account</h2>
        <div className="scna-role-segmented-control" style={{ flexWrap: 'wrap', borderRadius: '12px' }}>
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className={`scna-role-tab ${formData.role === role ? 'active' : ''}`}
              style={{ flex: '1 1 45%' }}
              onClick={() => setFormData({ ...formData, role })}
            >
              {role}
            </button>
          ))}
        </div>

        <form className="scna-login-form" onSubmit={handleSubmit} noValidate>
          {formError && <div className="scna-auth-alert" role="alert">{formError}</div>}

          <div className="scna-form-field">
            <label className="scna-field-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="scna-field-input"
              style={{ paddingLeft: '14px' }}
              placeholder="Jane Doe"
              value={formData.name}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              onChange={handleChange}
            />
            {touched.name && errors.name && <p className="text-xs text-error font-medium">{errors.name}</p>}
          </div>

          <div className="scna-form-field">
            <label className="scna-field-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="scna-field-input"
              style={{ paddingLeft: '14px' }}
              placeholder="jane.doe@university.edu"
              value={formData.email}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              onChange={handleChange}
            />
            {touched.email && errors.email && <p className="text-xs text-error font-medium">{errors.email}</p>}
          </div>

          <div className="scna-form-field">
            <label className="scna-field-label">Institution</label>
            <input
              type="text"
              name="institution"
              className="scna-field-input"
              style={{ paddingLeft: '14px' }}
              placeholder="University Name"
              value={formData.institution}
              onBlur={() => setTouched((t) => ({ ...t, institution: true }))}
              onChange={handleChange}
            />
            {touched.institution && errors.institution && <p className="text-xs text-error font-medium">{errors.institution}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="scna-form-field flex-1">
              <label className="scna-field-label">Password</label>
              <input
                type="password"
                name="password"
                className="scna-field-input"
                style={{ paddingLeft: '14px' }}
                placeholder="••••••••"
                value={formData.password}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                onChange={handleChange}
              />
              {touched.password && errors.password && <p className="text-xs text-error font-medium">{errors.password}</p>}
            </div>
            <div className="scna-form-field flex-1">
              <label className="scna-field-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="scna-field-input"
                style={{ paddingLeft: '14px' }}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                onChange={handleChange}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-error font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button type="submit" className="scna-submit-btn" disabled={!isValid || submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
