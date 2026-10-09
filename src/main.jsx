import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/* ==========================================================================
   OneBill Mobile-First Release Configuration
   ========================================================================== */
const RELEASE = {
  version: '1.0.0',
  buildNumber: '8000',
  packageName: 'com.onebill.app',
  minAndroid: 'Android 7.0 (API 24+)',
  targetAndroid: 'Android 15 (API 35)',
  // Left blank per user instructions: "just leave the download apk bcz still i am doing the app so i will add that apk at last"
  downloadUrl: '',
  githubRepo: 'https://github.com/asraf-it-hub/OneBill-DistributionChannel',
  fileSize: '~22 MB (ARM64)',
  status: 'v1.0.0 Packaging in Progress',
  releaseNotes: [
    'Strict 3-Language System: English, Hindi (हिन्दी), Telugu (తెలుగు).',
    '100% Offline-First architecture powered by local Drift SQLite on device.',
    'Instant UPI Payment QR Code generated directly on invoices for scan & pay.',
    'Customer Ledger (Khata) with real-time due tracking and payment history.',
    'Income and Expense management with category validation.',
    '5 Native Android notification channels with Quiet Hours protection.',
    'App Lock security with 4-6 digit PIN and biometric fingerprint unlock.'
  ]
};

/* Real 3-Language App Preview Data */
const APP_TRANSLATIONS = {
  en: {
    biz: 'Sri Venkateswara Traders',
    sub: '100% Offline • Drift SQLite',
    billed: 'Billed',
    received: 'Received',
    due: 'Outstanding',
    rate: 'Collection',
    alert: '2 Invoices Overdue (₹14,200)',
    client: 'Rajesh Enterprises',
    invNum: '#INV-2026-089'
  },
  hi: {
    biz: 'श्री वेंकटेश्वर ट्रेडर्स',
    sub: '100% ऑफलाइन • स्थानीय डेटा',
    billed: 'कुल बिल',
    received: 'प्राप्त भुगतान',
    due: 'बकाया राशि',
    rate: 'वसूली दर',
    alert: '2 इनवॉइस अतिदेय (₹14,200)',
    client: 'राजेश एंटरप्राइजेज',
    invNum: '#INV-2026-089'
  },
  te: {
    biz: 'శ్రీ వేంకటేశ్వర ట్రేడర్స్',
    sub: '100% ఆఫ్‌లైన్ • స్థానిక డేటా',
    billed: 'మొత్తం బిల్లు',
    received: 'అందుకున్నది',
    due: 'బకాయి మొత్తం',
    rate: 'వసూలు శాతం',
    alert: '2 ఇన్‌వాయిస్‌లు గడువు ముగిసినవి',
    client: 'రాజేష్ ఎంటర్‌ప్రైజెస్',
    invNum: '#INV-2026-089'
  }
};

/* Concise SVG Icons */
function Icon({ name }) {
  const icons = {
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
    offline: <path d="M1 1l22 22m-5.3-5.3A10.9 10.9 0 0 0 23 12a11 11 0 0 0-3.2-7.8M8.5 8.5A6 6 0 0 0 6 12c0 2.2 1.2 4.1 3 5.2m5.2.2a5.9 5.9 0 0 0 1.8-4.4c0-.7-.1-1.3-.4-1.9M12 2a11 11 0 0 0-6.8 2.4" />,
    qr: <path d="M3 3h6v6H3zm12 0h6v6h-6zm-12 12h6v6H3zm12 0h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm3-6h3v3h-3z" />,
    translate: <path d="m5 8 6 6m-6 0 6-6M2 5h12M7 2v3m7 6 4 9 4-9m-7 6h6" />,
    lock: <path d="M5 11h14v10H5zm3 0V7a4 4 0 0 1 8 0v4" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zm4 6h8m-8 4h8m-8 4h5" />,
    bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 0 1-3.46 0" />,
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
    check: <path d="M20 6L9 17l-5-5" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />
  };

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ width: '1em', height: '1em' }}
    >
      {icons[name] || icons.arrow}
    </svg>
  );
}

/* ==========================================================================
   Header & Mobile Navigation (Clean, No Arrows, Smooth Drawer)
   ========================================================================== */
function Header({ currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Download', path: '/download' },
    { label: 'Help & FAQ', path: '/help' },
    { label: 'About', path: '/about' }
  ];

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="site-header">
      <div className="wrap nav-bar">
        {/* Brand */}
        <a 
          href="/" 
          className="brand" 
          onClick={(e) => handleLinkClick(e, '/')}
          aria-label="OneBill Home"
        >
          <img src="/assets/onebill-logo.png" alt="OneBill" className="brand-logo" />
          <span className="brand-title">OneBill</span>
          <span className="brand-tag">Android</span>
        </a>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, item.path)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action & Mobile Menu Toggle */}
        <div className="header-right">
          <a 
            href="/download" 
            className="header-download-btn"
            onClick={(e) => handleLinkClick(e, '/download')}
          >
            <Icon name="download" />
            <span>Get App</span>
          </a>

          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (No arrows, clean layout) */}
      {menuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}></div>
          <div className="mobile-menu-drawer">
            {navLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`mobile-menu-link ${currentPath === item.path ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, item.path)}
              >
                {item.label}
              </a>
            ))}
            <div className="mobile-menu-cta">
              <a 
                href="/download" 
                className="btn btn-primary btn-block"
                onClick={(e) => handleLinkClick(e, '/download')}
              >
                <Icon name="download" />
                <span>Download Android APK</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/* ==========================================================================
   Home Hero & Interactive Mobile App Card
   ========================================================================== */
function HomeView({ onNavigate }) {
  const [lang, setLang] = useState('en');
  const t = APP_TRANSLATIONS[lang];

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-pill">
            <span className="hero-pill-dot"></span>
            <span>Offline-First Android App</span>
          </div>

          <h1>
            Simple Billing & Khata.
            <br />
            <span>Built for Modern Business.</span>
          </h1>

          <p className="hero-desc">
            Fast invoices with instant UPI QR codes, customer dues ledger, and 100% offline reliability. 
            Native in English, हिन्दी & తెలుగు.
          </p>

          <div className="hero-actions">
            <a 
              href="/download" 
              className="btn btn-primary btn-block"
              onClick={(e) => { e.preventDefault(); onNavigate('/download'); }}
            >
              <Icon name="download" />
              <span>Download APK</span>
            </a>
            <a 
              href="/features" 
              className="btn btn-secondary btn-block"
              onClick={(e) => { e.preventDefault(); onNavigate('/features'); }}
            >
              <span>Explore Features</span>
            </a>
          </div>

          <div className="hero-badges-row">
            <span className="hero-badge-tag">
              <Icon name="offline" /> 100% Offline
            </span>
            <span className="hero-badge-tag">
              <Icon name="qr" /> UPI QR Bills
            </span>
            <span className="hero-badge-tag">
              <Icon name="lock" /> PIN & Biometrics
            </span>
          </div>

          {/* App Card Preview (Compact Mobile Screen with 3 Languages) */}
          <div className="app-card-preview">
            <div className="preview-top-bar">
              <div className="preview-top-biz">
                <div className="preview-avatar">OB</div>
                <div className="preview-biz-name">
                  <h4>{t.biz}</h4>
                  <span>{t.sub}</span>
                </div>
              </div>

              {/* 3-Language Switcher */}
              <div className="preview-lang-switch">
                <button 
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang('en')}
                >
                  EN
                </button>
                <button 
                  className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                  onClick={() => setLang('hi')}
                >
                  हिन्दी
                </button>
                <button 
                  className={`lang-btn ${lang === 'te' ? 'active' : ''}`}
                  onClick={() => setLang('te')}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            <div className="preview-body">
              {/* Stat Chips */}
              <div className="stat-chips-grid">
                <div className="stat-chip billed">
                  <span>{t.billed}</span>
                  <strong>₹1,48,500</strong>
                </div>
                <div className="stat-chip received">
                  <span>{t.received}</span>
                  <strong>₹1,12,000</strong>
                </div>
                <div className="stat-chip due">
                  <span>{t.due}</span>
                  <strong>₹36,500</strong>
                </div>
                <div className="stat-chip rate">
                  <span>{t.rate}</span>
                  <strong>75.4%</strong>
                </div>
              </div>

              {/* Alert Strip */}
              <div className="preview-alert-strip">
                <span>⚠️ {t.alert}</span>
                <span style={{ textDecoration: 'underline' }}>Review</span>
              </div>

              {/* Sample Invoice */}
              <div className="preview-inv-row">
                <div className="inv-row-meta">
                  <b>{t.client}</b>
                  <small>{t.invNum} • Due Today</small>
                </div>
                <div className="inv-row-total">
                  <b>₹14,500</b>
                  <br />
                  <span className="badge-paid">PAID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Highlights (Mobile Optimized) */}
      <section className="wrap" style={{ paddingBottom: '30px' }}>
        <div className="section-title-wrap">
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">Everything Needed for Daily Billing</h2>
          <p className="section-subtitle">No complicated accounting jargon. Built specifically for retail, wholesale, and services.</p>
        </div>

        <FeaturesList />

        {/* 3 Regional Languages Card */}
        <div className="lang-card-compact">
          <span className="section-label">Native Languages</span>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0E1715' }}>Manage Business in Your Mother Tongue</h3>
          <p style={{ fontSize: '13px', color: '#5E726C', marginTop: '4px' }}>
            OneBill comes completely localized across every screen, dialog, and report.
          </p>

          <div className="lang-chips">
            <div className="lang-chip-box">
              <b>English</b>
              <small>Default</small>
            </div>
            <div className="lang-chip-box">
              <b>हिन्दी (Hindi)</b>
              <small>राष्ट्रव्यापी</small>
            </div>
            <div className="lang-chip-box">
              <b>తెలుగు (Telugu)</b>
              <small>ప్రాంతీయ</small>
            </div>
          </div>
        </div>

        {/* Quick Download CTA */}
        <div style={{ textAlign: 'center', margin: '20px 0 40px' }}>
          <a 
            href="/download" 
            className="btn btn-primary btn-block"
            onClick={(e) => { e.preventDefault(); onNavigate('/download'); }}
          >
            <Icon name="download" />
            <span>Get OneBill for Android</span>
          </a>
        </div>
      </section>
    </>
  );
}

/* ==========================================================================
   Features List Component (Concise, Visual)
   ========================================================================== */
function FeaturesList() {
  const features = [
    {
      icon: 'offline',
      title: '100% Offline-First SQLite',
      desc: 'Creates bills, records payments, and checks customer dues without internet. Never freezes during connectivity drops.'
    },
    {
      icon: 'qr',
      title: 'Instant UPI QR on Bills',
      desc: 'Prints your dynamic UPI payment QR code on PDF bills. Customers scan and pay directly via GPay, PhonePe, or Paytm.'
    },
    {
      icon: 'receipt',
      title: 'Customer Ledger (Khata)',
      desc: 'Tracks invoice totals, recorded payments, and outstanding dues with 1-tap WhatsApp PDF bill sharing.'
    },
    {
      icon: 'translate',
      title: 'English, हिन्दी & తెలుగు',
      desc: 'Strict 3-language system built for regional Indian trade. Switch anytime with a single tap.'
    },
    {
      icon: 'lock',
      title: 'App Lock & Biometrics',
      desc: 'Keep sales numbers and customer balances private with secure 4-6 digit PIN and fingerprint authentication.'
    },
    {
      icon: 'bell',
      title: 'Due Date Reminders',
      desc: 'Automatic notifications before invoices are due and follow-ups for overdue payments with Quiet Hours support.'
    },
    {
      icon: 'cloud',
      title: 'Automatic Cloud Backup',
      desc: 'Syncs safely with Supabase when connected so your business data is never lost if your phone changes.'
    }
  ];

  return (
    <div className="features-list">
      {features.map((item) => (
        <div key={item.title} className="feature-item-card">
          <div className="feature-item-icon">
            <Icon name={item.icon} />
          </div>
          <div className="feature-item-content">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   Download View (/download)
   ========================================================================== */
function DownloadView() {
  const hasLiveLink = Boolean(RELEASE.downloadUrl);

  return (
    <div className="wrap" style={{ padding: '24px 20px 40px' }}>
      <div className="section-title-wrap">
        <span className="section-label">Android Release</span>
        <h1 className="section-title">Download OneBill</h1>
        <p className="section-subtitle">Official Android APK distribution for mobile devices.</p>
      </div>

      <div className="download-card-mobile">
        <div className="download-status-badge">
          <span>⚡ {RELEASE.status}</span>
        </div>

        <h2>OneBill for Android</h2>
        <p>
          Direct installation package. Lightweight, offline-ready, and built for fast daily billing.
        </p>

        <div className="download-meta-table">
          <div className="meta-cell">
            <small>Package</small>
            <b>{RELEASE.packageName}</b>
          </div>
          <div className="meta-cell">
            <small>Version</small>
            <b>v{RELEASE.version} (Build {RELEASE.buildNumber})</b>
          </div>
          <div className="meta-cell">
            <small>Android</small>
            <b>{RELEASE.minAndroid}</b>
          </div>
          <div className="meta-cell">
            <small>APK Size</small>
            <b>{RELEASE.fileSize}</b>
          </div>
        </div>

        {hasLiveLink ? (
          <a href={RELEASE.downloadUrl} className="btn btn-primary btn-block" download>
            <Icon name="download" />
            <span>Download APK ({RELEASE.fileSize})</span>
          </a>
        ) : (
          <div>
            <div 
              className="btn btn-secondary btn-block" 
              style={{ opacity: 0.85, cursor: 'default', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'transparent' }}
            >
              <span>APK Packaging in Progress</span>
            </div>
            <p style={{ fontSize: '12px', color: '#88AFA6', marginTop: '12px', textAlign: 'center' }}>
              The APK build is being packaged and will be linked here shortly.
            </p>
          </div>
        )}
      </div>

      {/* 3-Step Quick Install Guide */}
      <div className="install-guide-card">
        <h3>How to Install the APK</h3>
        <div className="guide-steps-list">
          <div className="guide-step">
            <div className="guide-step-num">1</div>
            <div className="guide-step-text">
              <b>Download the APK</b>
              <p>Tap download above to save the file to your Android phone.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="guide-step-num">2</div>
            <div className="guide-step-text">
              <b>Allow Installation</b>
              <p>When prompted by Android, enable "Allow from this source" for your browser.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="guide-step-num">3</div>
            <div className="guide-step-text">
              <b>Open & Start Billing</b>
              <p>Tap "Install" then "Open". Select your language and manage your bills!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Help & FAQ View (/help)
   ========================================================================== */
function HelpView() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Does OneBill work without internet?',
      a: 'Yes. OneBill is built 100% offline-first with an on-device SQLite database. You can create bills, add customers, and record payments completely offline. Data syncs to the cloud when you connect.'
    },
    {
      q: 'How do customers pay using the UPI QR Code?',
      a: 'Add your UPI ID in Business settings. When you create an invoice, OneBill automatically embeds a scannable UPI QR code on the bill. Customers scan with Google Pay, PhonePe, or Paytm to pay directly.'
    },
    {
      q: 'Which languages are supported?',
      a: 'OneBill natively supports English, Hindi (हिन्दी), and Telugu (తెలుగు). You can switch your preferred language anytime in the app settings with one tap.'
    },
    {
      q: 'Can I lock the app with a PIN or fingerprint?',
      a: 'Yes. Enable App Lock inside OneBill to protect your billing numbers with a 4–6 digit PIN and optional biometric fingerprint/face authentication.'
    },
    {
      q: 'How does customer due tracking (Khata) work?',
      a: 'Each customer profile tracks total billed amount, total received, and balance due. Recording a payment automatically decreases the outstanding balance in real time.'
    },
    {
      q: 'What if I accidentally delete an invoice?',
      a: 'OneBill includes a built-in Recycle Bin. Soft-deleted invoices, customers, and expenses can be restored instantly with one tap.'
    }
  ];

  return (
    <div className="wrap" style={{ padding: '24px 20px 40px' }}>
      <div className="section-title-wrap">
        <span className="section-label">Help Center</span>
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-subtitle">Quick answers about OneBill offline billing and UPI payments.</p>
      </div>

      <div className="faq-stack">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.q} className={`faq-card ${isOpen ? 'open' : ''}`}>
              <button 
                className="faq-btn" 
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              >
                <span>{faq.q}</span>
                <span>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <div className="faq-text">{faq.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   About & Privacy Views
   ========================================================================== */
function AboutView() {
  return (
    <div className="wrap" style={{ padding: '24px 20px 40px' }}>
      <div className="section-title-wrap">
        <span className="section-label">About OneBill</span>
        <h1 className="section-title">Built for Real Trade</h1>
        <p className="section-subtitle">Simple, reliable billing without monthly complexity.</p>
      </div>

      <div className="content-sheet">
        <h2>Our Focus</h2>
        <p>
          OneBill is an independent, offline-first Android application designed to help merchants, 
          wholesalers, and small businesses manage invoices, track customer dues, and collect payments via UPI 
          without cumbersome accounting overhead.
        </p>

        <h2>Offline Data Ownership</h2>
        <p>
          Your records stay on your phone. OneBill does not sell your customer lists or track your margins. 
          When cloud sync is enabled, records back up securely to your private database account.
        </p>

        <h2>Language Inclusivity</h2>
        <p>
          We believe small business tools should speak regional mother tongues. OneBill is fully native in 
          English, Hindi, and Telugu.
        </p>
      </div>
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="wrap" style={{ padding: '24px 20px 40px' }}>
      <div className="section-title-wrap">
        <span className="section-label">Legal</span>
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-subtitle">Clear and transparent information about your data.</p>
      </div>

      <div className="content-sheet">
        <h2>1. Local Storage First</h2>
        <p>
          OneBill stores customer information, line items, and financial records in a local SQLite database 
          directly on your Android device. The app operates fully without sending your data to any servers.
        </p>

        <h2>2. Optional Cloud Synchronization</h2>
        <p>
          When you sign in and enable cloud backup, data synchronizes with Supabase using encrypted TLS connections. 
          We never share or sell your business records to advertisers.
        </p>

        <h2>3. App Security</h2>
        <p>
          App Lock credentials and tokens are secured via Android Keystore and biometric security APIs on your phone.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   Footer
   ========================================================================== */
function Footer({ onNavigate }) {
  const handleNav = (e, path) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <img src="/assets/onebill-logo.png" alt="OneBill" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <b style={{ fontSize: '17px', color: '#FFFFFF' }}>OneBill</b>
          <span style={{ fontSize: '11px', color: '#5EEAD4', marginLeft: '4px' }}>Android</span>
        </div>

        <p className="footer-desc">
          Simple offline billing and customer khata for modern businesses. Native in English, हिन्दी & తెలుగు.
        </p>

        <div className="footer-nav-row">
          <a href="/" onClick={(e) => handleNav(e, '/')}>Home</a>
          <a href="/features" onClick={(e) => handleNav(e, '/features')}>Features</a>
          <a href="/download" onClick={(e) => handleNav(e, '/download')}>Download</a>
          <a href="/help" onClick={(e) => handleNav(e, '/help')}>Help & FAQ</a>
          <a href="/about" onClick={(e) => handleNav(e, '/about')}>About</a>
          <a href="/privacy" onClick={(e) => handleNav(e, '/privacy')}>Privacy</a>
        </div>

        <div className="footer-bottom-copy">
          © 2026 OneBill (com.onebill.app). All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   Main Application with Smooth SPA Navigation
   ========================================================================== */
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/$/, '') || '/');

  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path.replace(/\/$/, '') || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const titles = {
      '/': 'OneBill — Offline Billing & Khata App for Android',
      '/features': 'Features — OneBill Android Billing',
      '/download': 'Download APK — OneBill Android App',
      '/help': 'Help & FAQ — OneBill',
      '/about': 'About OneBill',
      '/privacy': 'Privacy Policy — OneBill'
    };
    document.title = titles[currentPath] || 'OneBill — Android Billing App';
  }, [currentPath]);

  let CurrentView = <HomeView onNavigate={navigate} />;
  if (currentPath === '/features') {
    CurrentView = (
      <div className="wrap" style={{ padding: '24px 20px 40px' }}>
        <div className="section-title-wrap">
          <span className="section-label">All Features</span>
          <h1 className="section-title">Built for Your Workflow</h1>
          <p className="section-subtitle">Everything you need for everyday billing and customer khata.</p>
        </div>
        <FeaturesList />
      </div>
    );
  } else if (currentPath === '/download') {
    CurrentView = <DownloadView />;
  } else if (currentPath === '/help') {
    CurrentView = <HelpView />;
  } else if (currentPath === '/about') {
    CurrentView = <AboutView />;
  } else if (currentPath === '/privacy') {
    CurrentView = <PrivacyView />;
  }

  return (
    <>
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main id="app-main">
        {CurrentView}
      </main>
      <Footer onNavigate={navigate} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
