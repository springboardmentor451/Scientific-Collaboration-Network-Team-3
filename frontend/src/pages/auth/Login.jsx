import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import { authService } from '../../services/authService';
import { setOtpPending } from '../../utils/otpSession';
import { parseAuthError } from '../../utils/authErrors';

export default function Login() {
  const [activeRole, setActiveRole] = useState('Researcher');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [lang, setLang] = useState('EN');
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const roles = [
    'Researcher',
    'Institution Admin',
    'Reviewer',
    'System Admin',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authService.login({
        identifier: email,
        email,
        password,
        role: activeRole,
      });
      setOtpPending({ identifier: email, role: activeRole });
      navigate('/verify-otp', { replace: true });
    } catch (err) {
      const parsed = parseAuthError(err);
      setError(parsed.message);
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
      <div className="scna-login-card">
        <h2 className="scna-card-title">Login to your account</h2>

        <div className="scna-role-segmented-control">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              className={`scna-role-tab ${activeRole === role ? 'active' : ''}`}
              onClick={() => setActiveRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <form className="scna-login-form" onSubmit={handleSubmit}>
          {error && <div className="scna-auth-alert" role="alert">{error}</div>}

          <div className="scna-form-field">
            <label className="scna-field-label">Email or Username</label>
            <div className="scna-input-box">
              <svg className="scna-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <input
                type="text"
                className="scna-field-input"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="scna-form-field">
            <label className="scna-field-label">Password</label>
            <div className="scna-input-box">
              <svg className="scna-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="scna-field-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="scna-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="scna-form-options">
            <label className="scna-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="scna-checkbox-input"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password" className="scna-forgot-link">
              Forgot your password?
            </a>
          </div>

          <button type="submit" className="scna-submit-btn" disabled={submitting}>
            {submitting ? 'Checking credentials…' : 'Continue'}
          </button>

          <div className="scna-security-note">
            Secured with JWT authentication after OTP verification.
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
