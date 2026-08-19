import { Link } from 'react-router-dom';

export default function AuthLayout({ children, lang, setLang, carouselIndex, onPrev, onNext }) {
  return (
    <div className="scna-stitch-page">
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
            <input type="text" placeholder="Search" className="scna-search-input" />
          </div>

          <Link to="/login" className="scna-nav-login-btn">Login</Link>

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

      <div className="scna-split-container">
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

            <Link to="/register" className="scna-register-link">
              New institution or researcher? Register &rarr;
            </Link>
          </div>

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

        <section className="scna-map-panel">
          <div className="scna-featured-tag">FEATURED RESEARCH GROUP</div>
          {children}
          <div className="scna-carousel-controls">
            <button className="scna-carousel-btn" onClick={onPrev} aria-label="Previous slide">
              &lang;
            </button>
            <span className="scna-carousel-counter">
              0{carouselIndex}/05
            </span>
            <button className="scna-carousel-btn" onClick={onNext} aria-label="Next slide">
              &rang;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
