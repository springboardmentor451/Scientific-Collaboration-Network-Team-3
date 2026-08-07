import { useState } from 'react';

/**
 * Login page implementation matching the Stitch design for SCNA.
 * Features top navigation, split layout (Hero + Dark satellite map login form),
 * role selector tabs, remember me, and JWT authentication footer.
 */
export default function Login({ onLogin }) {
  const [activeRole, setActiveRole] = useState('Researcher');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [lang, setLang] = useState('EN');
  const [carouselIndex, setCarouselIndex] = useState(1);

  const roles = [
    'Researcher',
    'Institution Admin',
    'Reviewer',
    'System Admin',
  ];

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev % 5) + 1);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev === 1 ? 5 : prev - 1));
  };

  return (
    <div className="scna-stitch-page">
      {/* ==================== TOP NAVIGATION BAR ==================== */}
      <header className="scna-navbar">
        <div className="scna-nav-left">
          <div className="scna-logo">SCNA</div>
          <nav className="scna-nav-links">
            <a href="#dashboard" className="scna-nav-item">Dashboard</a>
            <div className="scna-nav-item scna-dropdown-trigger">
              Publications <span className="scna-dropdown-arrow">▾</span>
            </div>
            <a href="#collaborations" className="scna-nav-item">Collaborations</a>
            <a href="#conferences" className="scna-nav-item">Conferences</a>
          </nav>
        </div>

        <div className="scna-nav-right">
          <div className="scna-search-wrapper">
            <svg className="scna-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="scna-search-input"
            />
          </div>

          <button className="scna-nav-login-btn">Login</button>

          <div className="scna-lang-selector">
            <span
              className={`scna-lang-opt ${lang === 'EN' ? 'active' : ''}`}
              onClick={() => setLang('EN')}
            >
              EN
            </span>
            <span className="scna-lang-divider">|</span>
            <span
              className={`scna-lang-opt ${lang === 'ES' ? 'active' : ''}`}
              onClick={() => setLang('ES')}
            >
              ES
            </span>
          </div>
        </div>
      </header>

      {/* ==================== SPLIT MAIN BODY ==================== */}
      <div className="scna-split-container">
        {/* ----- LEFT HERO PANEL ----- */}
        <section className="scna-hero-panel">
          <div className="scna-hero-content">
            <p className="scna-hero-tagline">CENTRALIZED RESEARCH MANAGEMENT</p>

            <div className="scna-headline-wrapper">
              <h1 className="scna-hero-title">
                CONNECTING<br />
                <span className="scna-highlight-container">
                  RESEARCHERS ACROSS
                  <svg className="scna-underline-swoosh" viewBox="0 0 400 24" fill="none" preserveAspectRatio="none">
                    <path d="M 5 16 Q 200 24, 395 10" stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
                  </svg>
                </span><br />
                INSTITUTIONS.
              </h1>

              {/* Decorative Floating 3D Spheres Graphic */}
              <div className="scna-spheres-graphic">
                <div className="scna-sphere sphere-main">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="5" cy="7" r="2" />
                    <circle cx="19" cy="7" r="2" />
                    <circle cx="7" cy="18" r="2" />
                    <line x1="12" y1="12" x2="5" y2="7" />
                    <line x1="12" y1="12" x2="19" y2="7" />
                    <line x1="12" y1="12" x2="7" y2="18" />
                  </svg>
                </div>
                <div className="scna-sphere sphere-sub1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="2.5" />
                    <circle cx="6" cy="6" r="1.5" />
                    <circle cx="18" cy="18" r="1.5" />
                    <line x1="12" y1="12" x2="6" y2="6" />
                    <line x1="12" y1="12" x2="18" y2="18" />
                  </svg>
                </div>
                <div className="scna-sphere sphere-sub2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="17" cy="7" r="1.5" />
                    <line x1="12" y1="12" x2="17" y2="7" />
                  </svg>
                </div>
              </div>
            </div>

            <a href="#register" className="scna-register-link">
              New institution or researcher? Register &rarr;
            </a>
          </div>

          {/* Bottom Card Banner */}
          <div className="scna-hero-card">
            <div className="scna-card-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=400&q=80"
                alt="University Campus"
                className="scna-card-img"
              />
            </div>
            <div className="scna-card-info">
              <p className="scna-card-text">
                TRACKING PUBLICATIONS AND CO-AUTHORSHIP ACROSS GLOBAL NETWORKS, EMPOWERING RESEARCH DISCOVERY.
              </p>
              <button className="scna-learn-more-btn">Learn More</button>
            </div>
          </div>
        </section>

        {/* ----- RIGHT SATELLITE MAP LOGIN PANEL ----- */}
        <section className="scna-map-panel">
          <div className="scna-featured-tag">FEATURED RESEARCH GROUP</div>

          {/* Floating White Login Card */}
          <div className="scna-login-card">
            <h2 className="scna-card-title">Login to your account</h2>

            {/* Role Pills Segmented Control Bar */}
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

            {/* Login Form */}
            <form className="scna-login-form" onSubmit={(e) => { e.preventDefault(); if (onLogin) onLogin(); }}>
              {/* Email / Username Field */}
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
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
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

              {/* Remember Me & Forgot Password */}
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

              {/* Primary Login Button */}
              <button type="submit" className="scna-submit-btn">
                Login
              </button>

              {/* Security Footer */}
              <div className="scna-security-note">
                Secured with JWT authentication.
              </div>
            </form>
          </div>

          {/* Bottom Right Carousel Controls */}
          <div className="scna-carousel-controls">
            <button className="scna-carousel-btn" onClick={handlePrevSlide} aria-label="Previous slide">
              &lang;
            </button>
            <span className="scna-carousel-counter">
              0{carouselIndex}/05
            </span>
            <button className="scna-carousel-btn" onClick={handleNextSlide} aria-label="Next slide">
              &rang;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
