import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/* ==========================================================================
   OneBill Centralized Release & App Configuration
   Real metadata derived directly from OneBill Flutter Android Application
   ========================================================================== */
const RELEASE = {
  version: '1.0.0',
  buildNumber: '8000',
  packageName: 'com.onebill.app',
  minAndroid: 'Android 7.0 (API 24+)',
  targetAndroid: 'Android 15 (API 35)',
  // Left blank per user instructions: "just leave the download apk bcz still i am doing the app so i will add that apk at last"
  downloadUrl: '', 
  arm64Url: '',
  armv7Url: '',
  universalUrl: '',
  githubRepo: 'https://github.com/asraf-it-hub/OneBill-DistributionChannel',
  fileSizeArm64: '~22 MB',
  fileSizeArmv7: '~19 MB',
  fileSizeUniversal: '~73 MB',
  status: 'v1.0.0 Build Finalizing',
  releaseNotes: [
    'Strict 3-Language System: English, Hindi (हिन्दी), Telugu (తెలుగు) across all 13 core screens.',
    '100% Offline-First architecture powered by local Drift SQLite database on device.',
    'Resilient cloud synchronization with Supabase using idempotent mutation queues.',
    'Instant UPI Payment QR Code generated directly on customer invoices for Scan & Pay.',
    'Full invoice breakdown: Line items, Subtotal, Discount, Interest, Grand Total, and Balance Due.',
    'Single-tap PDF invoice generation and WhatsApp sharing (BusinessName_Customer_INV001.pdf).',
    'Customer ledger (Khata) with total billed, paid, and outstanding dues tracking.',
    'Income and Expense management with mandatory Amount & Category validation.',
    '5 Native Android notification channels with Quiet Hours and due date snooze alerts.',
    'Security App Lock with 4-6 digit PIN and Biometric fingerprint/face unlock.',
    'Built-in Recycle Bin allowing safe restoration of deleted invoices and customers.'
  ]
};

/* ==========================================================================
   Real Localization Data from OneBill Core
   ========================================================================== */
const DEMO_LOCALIZATIONS = {
  en: {
    langName: 'English',
    bizName: 'Sri Venkateswara Traders',
    tagline: 'Wholesale & Retail Billing',
    dashboard: 'Dashboard',
    billed: 'Billed',
    received: 'Received',
    outstanding: 'Outstanding',
    collectionRate: 'Collection Rate',
    overdueAlert: '2 invoices overdue (₹14,200 total)',
    reviewBtn: 'Review',
    recentInvoices: 'Recent Invoices',
    recordPayment: 'Record Payment',
    customer: 'Customer',
    amount: 'Amount',
    status: 'Status',
    invoices: 'Invoices',
    customers: 'Customers',
    offlineStatus: '100% Offline • Drift SQLite',
    inv1Client: 'Rajesh Enterprises',
    inv2Client: 'Kavitha General Stores',
    inv3Client: 'Sai Ganesh Provisions'
  },
  hi: {
    langName: 'हिन्दी (Hindi)',
    bizName: 'श्री वेंकटेश्वर ट्रेडर्स',
    tagline: 'थोक एवं खुदरा बिलिंग',
    dashboard: 'डैशबोर्ड',
    billed: 'कुल बिल',
    received: 'प्राप्त भुगतान',
    outstanding: 'बकाया राशि',
    collectionRate: 'वसूली दर',
    overdueAlert: '2 इनवॉइस अतिदेय हैं (कुल ₹14,200)',
    reviewBtn: 'देखें',
    recentInvoices: 'हाल के इनवॉइस',
    recordPayment: 'भुगतान दर्ज करें',
    customer: 'ग्राहक',
    amount: 'राशि',
    status: 'स्थिति',
    invoices: 'बिल / इनवॉइस',
    customers: 'ग्राहक सूची',
    offlineStatus: '100% ऑफलाइन • सुरक्षित डेटा',
    inv1Client: 'राजेश एंटरप्राइजेज',
    inv2Client: 'कविता जनरल स्टोर्स',
    inv3Client: 'साईं गणेश प्रोविजन्स'
  },
  te: {
    langName: 'తెలుగు (Telugu)',
    bizName: 'శ్రీ వేంకటేశ్వర ట్రేడర్స్',
    tagline: 'హోల్‌సేల్ & రిటైల్ బిల్లింగ్',
    dashboard: 'డ్యాష్‌బోర్డ్',
    billed: 'మొత్తం బిల్లు',
    received: 'అందుకున్న మొత్తం',
    outstanding: 'బకాయి మొత్తం',
    collectionRate: 'వసూలు శాతం',
    overdueAlert: '2 ఇన్‌వాయిస్‌లు గడువు ముగిసినవి (మొత్తం ₹14,200)',
    reviewBtn: 'సమీక్షించండి',
    recentInvoices: 'ఇటీవలి ఇన్‌వాయిస్‌లు',
    recordPayment: 'చెల్లింపు నమోదు',
    customer: 'కస్టమర్',
    amount: 'మొత్తం',
    status: 'స్థితి',
    invoices: 'ఇన్‌వాయిస్‌లు',
    customers: 'కస్టమర్లు',
    offlineStatus: '100% ఆఫ్‌లైన్ • స్థానిక డేటా',
    inv1Client: 'రాజేష్ ఎంటర్‌ప్రైజెస్',
    inv2Client: 'కవిత జనరల్ స్టోర్స్',
    inv3Client: 'సాయి గణేష్ ప్రొవిజన్స్'
  }
};

/* SVG Icons Library */
function SvgIcon({ name, className = '' }) {
  const icons = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
    bolt: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    offline: <path d="M1 1l22 22m-5.3-5.3A10.9 10.9 0 0 0 23 12a11 11 0 0 0-3.2-7.8M8.5 8.5A6 6 0 0 0 6 12c0 2.2 1.2 4.1 3 5.2m5.2.2a5.9 5.9 0 0 0 1.8-4.4c0-.7-.1-1.3-.4-1.9M12 2a11 11 0 0 0-6.8 2.4" />,
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />,
    qr: <path d="M3 3h6v6H3zm12 0h6v6h-6zm-12 12h6v6H3zm12 0h3v3h-3zm3 3h3v3h-3zm-3 3h3v3h-3zm3-6h3v3h-3z" />,
    translate: <path d="m5 8 6 6m-6 0 6-6M2 5h12M7 2v3m7 6 4 9 4-9m-7 6h6" />,
    lock: <path d="M5 11h14v10H5zm3 0V7a4 4 0 0 1 8 0v4" />,
    receipt: <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zm4 6h8m-8 4h8m-8 4h5" />,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
    bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 0 1-3.46 0" />,
    check: <path d="M20 6L9 17l-5-5" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    trash: <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    whatsapp: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  };

  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.arrow}
    </svg>
  );
}

/* ==========================================================================
   Header & Navigation
   ========================================================================== */
function Header({ currentPath }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Live Demo', path: '/#demo' },
    { label: 'Languages', path: '/#languages' },
    { label: 'Download', path: '/download' },
    { label: "What's New", path: '/whats-new' },
    { label: 'Help', path: '/help' },
    { label: 'About', path: '/about' }
  ];

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-inner">
          <span className="live-pulse-dot"></span>
          <span className="announcement-pill">v1.0.0 Release Preview</span>
          <span>OneBill Android — Offline-First Billing with Instant UPI QR & 3 Regional Languages</span>
        </div>
      </div>

      <header className="site-header">
        <div className="wrap nav-container">
          <a href="/" className="brand-link" aria-label="OneBill Home">
            <img src="/assets/onebill-logo.png" alt="OneBill Logo" className="brand-logo-img" />
            <div className="brand-name">
              <span className="brand-title">OneBill</span>
              <span className="brand-subtitle">Android App</span>
            </div>
          </a>

          <nav className="main-nav">
            {navLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href="/download" className="btn btn-primary btn-sm">
              <SvgIcon name="download" />
              <span>Get App</span>
            </a>
            <button 
              className="nav-toggle-btn" 
              onClick={() => setMobileOpen(!mobileOpen)} 
              aria-label="Toggle navigation"
            >
              <SvgIcon name={mobileOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-drawer">
            {navLinks.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`mobile-nav-item ${currentPath === item.path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{item.label}</span>
                <SvgIcon name="arrow" />
              </a>
            ))}
            <a 
              href="/download" 
              className="btn btn-primary btn-lg" 
              style={{ marginTop: '12px' }}
              onClick={() => setMobileOpen(false)}
            >
              <SvgIcon name="download" />
              <span>Download Android APK</span>
            </a>
          </div>
        )}
      </header>
    </>
  );
}

/* ==========================================================================
   Hero Visual: Live Phone Mockup with Dynamic 3-Language Toggle
   ========================================================================== */
function HeroAppMockup() {
  const [lang, setLang] = useState('en');
  const t = DEMO_LOCALIZATIONS[lang];

  return (
    <div className="hero-visual-wrapper">
      {/* Floating Card: Instant UPI QR */}
      <div className="hero-floating-card floating-card-qr">
        <div className="floating-icon-wrap">
          <SvgIcon name="qr" />
        </div>
        <div className="floating-card-text">
          <b>Instant UPI Scan & Pay</b>
          <small>Dynamic QR on every invoice</small>
        </div>
      </div>

      {/* Floating Card: 100% Offline SQLite */}
      <div className="hero-floating-card floating-card-offline">
        <div className="floating-icon-wrap">
          <SvgIcon name="offline" />
        </div>
        <div className="floating-card-text">
          <b>Zero Internet Required</b>
          <small>Instant local SQLite Drift engine</small>
        </div>
      </div>

      {/* Android Device Mockup */}
      <div className="hero-app-mockup">
        {/* Android Status Bar */}
        <div className="mockup-status-bar">
          <span>09:41</span>
          <div className="mockup-status-icons">
            <SvgIcon name="offline" style={{ width: 12, height: 12 }} />
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mockup Header */}
        <div className="mockup-header">
          <div className="mockup-biz-badge">
            <div className="mockup-biz-avatar">OB</div>
            <div className="mockup-biz-info">
              <h4>{t.bizName}</h4>
              <span>{t.offlineStatus}</span>
            </div>
          </div>

          {/* Interactive Language Switcher in App */}
          <div className="mockup-lang-toggle" title="Switch language preview">
            <button 
              className={`mockup-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button 
              className={`mockup-lang-btn ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिन्दी
            </button>
            <button 
              className={`mockup-lang-btn ${lang === 'te' ? 'active' : ''}`}
              onClick={() => setLang('te')}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Mockup Body Content */}
        <div className="mockup-body">
          {/* Dashboard Metrics */}
          <div className="mockup-metrics-grid">
            <div className="metric-card-mini billed">
              <span>{t.billed}</span>
              <strong>₹1,48,500</strong>
            </div>
            <div className="metric-card-mini received">
              <span>{t.received}</span>
              <strong>₹1,12,000</strong>
            </div>
            <div className="metric-card-mini outstanding">
              <span>{t.outstanding}</span>
              <strong>₹36,500</strong>
            </div>
            <div className="metric-card-mini rate">
              <span>{t.collectionRate}</span>
              <strong>75.4%</strong>
            </div>
          </div>

          {/* Overdue Alert Banner */}
          <div className="mockup-alert-banner">
            <span>
              <SvgIcon name="bell" style={{ width: 14, height: 14 }} />
              {t.overdueAlert}
            </span>
            <button>{t.reviewBtn}</button>
          </div>

          {/* Recent Invoices List */}
          <div className="mockup-invoices-list">
            <div className="mockup-invoices-header">
              <span>{t.recentInvoices}</span>
              <span style={{ color: '#5EEAD4' }}>+ {t.invoices}</span>
            </div>

            <div className="mockup-invoice-row">
              <div className="invoice-row-client">
                <b>{t.inv1Client}</b>
                <small>#INV-2026-089 • Due Today</small>
              </div>
              <div className="invoice-row-amount">
                <b>₹14,500</b>
                <div><span className="badge-status paid">PAID</span></div>
              </div>
            </div>

            <div className="mockup-invoice-row">
              <div className="invoice-row-client">
                <b>{t.inv2Client}</b>
                <small>#INV-2026-088 • ₹8,200 balance</small>
              </div>
              <div className="invoice-row-amount">
                <b>₹18,200</b>
                <div><span className="badge-status partial">PARTIAL</span></div>
              </div>
            </div>

            <div className="mockup-invoice-row">
              <div className="invoice-row-client">
                <b>{t.inv3Client}</b>
                <small>#INV-2026-087 • Overdue 3 days</small>
              </div>
              <div className="invoice-row-amount">
                <b>₹6,000</b>
                <div><span className="badge-status overdue">OVERDUE</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Interactive Live Invoice Simulator
   ========================================================================== */
function LiveInvoiceSimulator() {
  const [bizName, setBizName] = useState('Sri Venkateswara Traders');
  const [customerName, setCustomerName] = useState('Rajesh Enterprises');
  const [includeTax, setIncludeTax] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(5);
  const [items, setItems] = useState([
    { id: 1, name: 'Cotton Yarn Spools (Grade A)', qty: 10, rate: 450 },
    { id: 2, name: 'Wholesale Fabric Roll (Navy)', qty: 4, rate: 1250 },
    { id: 3, name: 'Special Packing & Handling', qty: 1, rate: 350 }
  ]);

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: nextId, name: 'New Inventory Item', qty: 1, rate: 500 }]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const taxAmount = useMemo(() => {
    return includeTax ? ((subtotal - discountAmount) * 0.05) : 0;
  }, [subtotal, discountAmount, includeTax]);

  const grandTotal = useMemo(() => {
    return Math.round(subtotal - discountAmount + taxAmount);
  }, [subtotal, discountAmount, taxAmount]);

  return (
    <section className="simulator-section" id="demo">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Interactive Simulator</span>
          <h2>See How <em>OneBill Invoicing</em> Works</h2>
          <p>
            Experience the real billing workflow. Adjust line items, test discounts, and preview the 
            generated bill sheet complete with the official UPI QR code and OneBill footer.
          </p>
        </div>

        <div className="simulator-box">
          {/* Controls Column */}
          <div className="simulator-controls">
            <h3>Invoice Builder</h3>
            <p>Edit fields below to see real-time recalculations on the invoice sheet.</p>

            <div className="sim-form-group">
              <label>Your Business Name</label>
              <input 
                type="text" 
                className="sim-input" 
                value={bizName} 
                onChange={(e) => setBizName(e.target.value)} 
              />
            </div>

            <div className="sim-form-group">
              <label>Billed Customer</label>
              <input 
                type="text" 
                className="sim-input" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
              />
            </div>

            <div className="sim-form-group">
              <label>Line Items (Item • Qty • Rate ₹)</label>
              <div className="sim-items-list">
                {items.map((item) => (
                  <div key={item.id} className="sim-item-row">
                    <input 
                      type="text" 
                      className="sim-input" 
                      value={item.name} 
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                      placeholder="Item name"
                    />
                    <input 
                      type="number" 
                      className="sim-input" 
                      value={item.qty} 
                      min="1"
                      onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} 
                      placeholder="Qty"
                    />
                    <input 
                      type="number" 
                      className="sim-input" 
                      value={item.rate} 
                      min="0"
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} 
                      placeholder="Rate ₹"
                    />
                    <button 
                      className="sim-item-remove" 
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                      disabled={items.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button className="sim-add-btn" onClick={addItem}>
                + Add Another Line Item
              </button>
            </div>

            <div className="sim-toggles-row">
              <div 
                className={`sim-toggle-pill ${includeTax ? 'active' : ''}`}
                onClick={() => setIncludeTax(!includeTax)}
              >
                <span>5% GST Tax</span>
                <b>{includeTax ? 'ON' : 'OFF'}</b>
              </div>
              <div 
                className={`sim-toggle-pill ${discountPercent > 0 ? 'active' : ''}`}
                onClick={() => setDiscountPercent(discountPercent === 0 ? 5 : 0)}
              >
                <span>5% Trade Discount</span>
                <b>{discountPercent > 0 ? 'ON' : 'OFF'}</b>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => alert('In OneBill on Android, this instantly renders a high-resolution branded PDF and opens the WhatsApp sharing intent!')}
              >
                <SvgIcon name="whatsapp" />
                <span>Share PDF via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="simulator-preview">
            <div className="invoice-preview-card">
              <div className="invoice-header-row">
                <div className="invoice-brand-badge">
                  <img src="/assets/onebill-logo.png" alt="Logo" />
                  <div className="invoice-brand-text">
                    <h4>{bizName || 'My Business'}</h4>
                    <span>GSTIN: 36ABCDE1234F1Z5</span>
                  </div>
                </div>
                <div className="invoice-meta">
                  <strong>#INV-2026-0042</strong>
                  <span>Date: 06 Oct 2026</span>
                </div>
              </div>

              <div className="invoice-billto">
                <small>Billed To</small>
                <b>{customerName || 'Customer Name'}</b>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name || 'Unnamed item'}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.rate}</td>
                      <td>₹{(item.qty * item.rate).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-calc-summary">
                <div className="calc-row">
                  <span>Subtotal:</span>
                  <b>₹{subtotal.toLocaleString('en-IN')}</b>
                </div>
                {discountPercent > 0 && (
                  <div className="calc-row">
                    <span>Discount ({discountPercent}%):</span>
                    <b style={{ color: '#059669' }}>-₹{discountAmount.toLocaleString('en-IN')}</b>
                  </div>
                )}
                {includeTax && (
                  <div className="calc-row">
                    <span>GST (5%):</span>
                    <b>+₹{taxAmount.toLocaleString('en-IN')}</b>
                  </div>
                )}
                <div className="calc-row grand-total">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dynamic Simulated UPI QR Box */}
              <div className="invoice-footer-upi">
                <div className="upi-info">
                  <h5>Instant Scan & Pay</h5>
                  <span>UPI ID: business@upi</span>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                    Google Pay • PhonePe • Paytm • BHIM
                  </div>
                </div>
                {/* SVG Simulated QR code */}
                <svg width="60" height="60" viewBox="0 0 100 100" fill="#126E5D">
                  <rect width="100" height="100" fill="#FFFFFF" rx="4" />
                  <rect x="10" y="10" width="28" height="28" rx="2" fill="#126E5D" />
                  <rect x="16" y="16" width="16" height="16" rx="1" fill="#FFFFFF" />
                  <rect x="20" y="20" width="8" height="8" rx="1" fill="#126E5D" />

                  <rect x="62" y="10" width="28" height="28" rx="2" fill="#126E5D" />
                  <rect x="68" y="16" width="16" height="16" rx="1" fill="#FFFFFF" />
                  <rect x="72" y="20" width="8" height="8" rx="1" fill="#126E5D" />

                  <rect x="10" y="62" width="28" height="28" rx="2" fill="#126E5D" />
                  <rect x="16" y="68" width="16" height="16" rx="1" fill="#FFFFFF" />
                  <rect x="20" y="72" width="8" height="8" rx="1" fill="#126E5D" />

                  <rect x="44" y="15" width="8" height="8" fill="#126E5D" />
                  <rect x="44" y="32" width="12" height="6" fill="#126E5D" />
                  <rect x="58" y="44" width="8" height="14" fill="#126E5D" />
                  <rect x="44" y="65" width="16" height="8" fill="#126E5D" />
                  <rect x="70" y="70" width="18" height="18" fill="#126E5D" />
                </svg>
              </div>

              <div className="invoice-powered-by">
                Powered by <b>OneBill</b> • Thank you for your business.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Core Features Bento Grid
   ========================================================================== */
function FeaturesBento() {
  const features = [
    {
      icon: 'offline',
      title: '100% Offline-First Architecture',
      desc: 'Built on a high-speed local Drift SQLite engine. Create bills, register customer dues, and manage stock with zero delay—even in basements or rural areas without internet connectivity.',
      tags: ['Drift SQLite', 'Zero Lag', 'Local Storage'],
      span2: true
    },
    {
      icon: 'cloud',
      title: 'Idempotent Supabase Cloud Sync',
      desc: 'Whenever your connection returns, mutations synchronize smoothly in the background. Deterministic transaction receipts prevent duplicate records.',
      tags: ['PostgreSQL RPC', 'Background Queue', 'Auto-Retry']
    },
    {
      icon: 'translate',
      title: 'Strict 3-Language System',
      desc: 'Complete native support for English, Hindi (हिन्दी), and Telugu (తెలుగు). Every button, report, invoice status, and dialog speaks your language.',
      tags: ['English', 'हिन्दी', 'తెలుగు', 'Zero Friction']
    },
    {
      icon: 'qr',
      title: 'Instant UPI Payment QR Codes',
      desc: 'Link your UPI ID or custom QR image. Invoices automatically generate dynamic scan-and-pay codes so customers settle dues directly via PhonePe, GPay, or Paytm.',
      tags: ['UPI 2.0', 'Direct Settlement', 'QR on Invoices']
    },
    {
      icon: 'receipt',
      title: 'Linear Action Bill Sheet & PDF Engine',
      desc: 'Clear vertical action workflow: Record payment, preview PDF, share via WhatsApp, edit, or void. Clean line-item totals with discount and interest calculations.',
      tags: ['PDF Generation', 'WhatsApp Share', 'Itemized Breakdown']
    },
    {
      icon: 'bell',
      title: '5 Native Android Notification Channels',
      desc: 'Smart reminders 7 days and 1 day before due dates, and post-due alerts. Features Quiet Hours protection and 1-tap "Remind me later" snooze.',
      tags: ['Due Reminders', 'Quiet Hours', 'Native Channels']
    },
    {
      icon: 'lock',
      title: 'Bank-Grade App Lock & Biometrics',
      desc: 'Protect sensitive business financials and customer records with a secure 4–6 digit PIN and optional fingerprint/face biometric authentication.',
      tags: ['Biometric Unlock', 'PIN Security', 'Secure Storage']
    },
    {
      icon: 'trash',
      title: 'Safety Recycle Bin & Audit Log',
      desc: 'Accidentally deleted a customer or invoice? Restore records instantly from the Recycle Bin. Complete timeline tracking for all synced actions.',
      tags: ['Instant Restore', 'Audit Trail', 'Safe Delete']
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Engineered for Indian Businesses</span>
          <h2>Everything You Need. <em>Nothing You Don't.</em></h2>
          <p>
            No bloated accounting menus or complex chart of accounts. OneBill delivers fast, 
            dependable billing and khata management designed specifically for store owners and distributors.
          </p>
        </div>

        <div className="bento-grid">
          {features.map((item, idx) => (
            <div 
              key={item.title} 
              className={`bento-card ${item.span2 ? 'span-2' : ''} ${idx === 0 ? 'dark-card' : ''}`}
            >
              <div className="bento-icon">
                <SvgIcon name={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="bento-tags">
                {item.tags.map(t => <span key={t} className="bento-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   3-Language Regional Section
   ========================================================================== */
function LanguageShowcase() {
  const [selectedLang, setSelectedLang] = useState('en');

  const terms = [
    { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డ్యాష్‌బోర్డ్' },
    { en: 'Invoices & Billing', hi: 'बिल और इनवॉइस', te: 'ఇన్‌వాయిస్‌లు & బిల్లింగ్' },
    { en: 'Customers Ledger (Khata)', hi: 'ग्राहक सूची (खाता)', te: 'కస్టమర్ల లెడ్జర్ (ఖాతా)' },
    { en: 'Record Payment', hi: 'भुगतान दर्ज करें', te: 'చెల్లింపు నమోదు చేయండి' },
    { en: 'Outstanding Due', hi: 'बकाया राशि', te: 'బకాయి మొత్తం' },
    { en: 'Overdue Invoices', hi: 'अतिदेय इनवॉइस', te: 'గడువు ముగిసినవి' },
    { en: 'Income & Expenses', hi: 'आय और व्यावसायिक व्यय', te: 'ఆదాయం మరియు ఖర్చులు' },
    { en: 'App Lock & PIN', hi: 'ऐप लॉक और पिन', te: 'యాప్ లాక్ & పిన్' }
  ];

  return (
    <section className="languages-section" id="languages">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Regional Language Support</span>
          <h2>Your Business in <em>Your Mother Tongue</em></h2>
          <p>
            Language should never be an obstacle to business growth. OneBill features complete, 
            verified translations across all 13 core screens in English, Hindi, and Telugu.
          </p>
        </div>

        <div className="lang-interactive-card">
          <div className="lang-selector-bar">
            <button 
              className={`lang-tab-btn ${selectedLang === 'en' ? 'active' : ''}`}
              onClick={() => setSelectedLang('en')}
            >
              <span>English</span>
              <small>Default</small>
            </button>
            <button 
              className={`lang-tab-btn ${selectedLang === 'hi' ? 'active' : ''}`}
              onClick={() => setSelectedLang('hi')}
            >
              <span>हिन्दी (Hindi)</span>
              <small>राष्ट्रव्यापी</small>
            </button>
            <button 
              className={`lang-tab-btn ${selectedLang === 'te' ? 'active' : ''}`}
              onClick={() => setSelectedLang('te')}
            >
              <span>తెలుగు (Telugu)</span>
              <small>తెలుగు రాష్ట్రాలు</small>
            </button>
          </div>

          <div className="lang-comparison-grid">
            <div className={`lang-card-box ${selectedLang === 'en' ? 'highlight' : ''}`}>
              <h4>English Terminology</h4>
              <div className="lang-list">
                {terms.map(t => (
                  <div key={t.en} className="lang-list-item">
                    <span>Feature:</span>
                    <b>{t.en}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lang-card-box ${selectedLang === 'hi' ? 'highlight' : ''}`}>
              <h4>हिन्दी अनुवाद (Hindi)</h4>
              <div className="lang-list">
                {terms.map(t => (
                  <div key={t.en} className="lang-list-item">
                    <span>अनुभाग:</span>
                    <b>{t.hi}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lang-card-box ${selectedLang === 'te' ? 'highlight' : ''}`}>
              <h4>తెలుగు అనువాదం (Telugu)</h4>
              <div className="lang-list">
                {terms.map(t => (
                  <div key={t.en} className="lang-list-item">
                    <span>విభాగం:</span>
                    <b>{t.te}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Comparison Section: OneBill vs Traditional Ledger vs Complex ERPs
   ========================================================================== */
function ComparisonSection() {
  const rows = [
    {
      feature: 'Works 100% Offline (No Internet)',
      onebill: 'Yes (Instant Drift SQLite)',
      paper: 'Yes (Pen & paper risk)',
      erp: 'No (Fails on poor 4G/5G)'
    },
    {
      feature: 'Instant UPI Payment QR on Bills',
      onebill: 'Yes (Auto-generated)',
      paper: 'No',
      erp: 'Requires costly plugins'
    },
    {
      feature: 'Regional Languages (Hindi & Telugu)',
      onebill: 'Yes (Native 3-language switch)',
      paper: 'Manual handwriting only',
      erp: 'Usually English-only'
    },
    {
      feature: 'Automatic Overdue Reminders',
      onebill: 'Yes (5 Android channels)',
      paper: 'No (Easy to forget dues)',
      erp: 'Complex SMS gateways'
    },
    {
      feature: 'Customer Ledger (Khata) Balance',
      onebill: '1-Tap Real-time tracking',
      paper: 'Prone to calculation errors',
      erp: 'Requires accounting training'
    },
    {
      feature: 'Cloud Sync & Multi-Device Backup',
      onebill: 'Yes (Encrypted Supabase sync)',
      paper: 'No (Lost if book is damaged)',
      erp: 'Heavy monthly subscription'
    },
    {
      feature: 'App Lock & Biometric Protection',
      onebill: 'Yes (Fingerprint / PIN)',
      paper: 'Zero privacy',
      erp: 'Complex user roles'
    }
  ];

  return (
    <section className="comparison-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Why OneBill</span>
          <h2>The Smart Way to <em>Manage Your Billing</em></h2>
          <p>
            See how OneBill compares against traditional paper notebooks and cumbersome enterprise software.
          </p>
        </div>

        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th className="brand-col">OneBill Android</th>
                <th>Paper Books / Khata Diary</th>
                <th>Heavy ERP Software</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature}>
                  <td><b>{row.feature}</b></td>
                  <td className="brand-col">
                    <span className="check-yes">
                      <SvgIcon name="check" style={{ width: 16, height: 16 }} />
                      {row.onebill}
                    </span>
                  </td>
                  <td><span className="check-no">{row.paper}</span></td>
                  <td><span className="check-no">{row.erp}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Download Hub Page (/download)
   Handles user's requirement: "just leave the download apk bcz still i am doing the app so i will add that apk at last"
   ========================================================================== */
function DownloadPage() {
  const hasLiveLink = Boolean(RELEASE.downloadUrl);

  return (
    <div className="download-section">
      <div className="wrap">
        {/* Main Hero Card */}
        <div className="download-hero-card">
          <div className="download-layout">
            <div>
              <div className="download-badge-release">
                <span className="live-pulse-dot"></span>
                <span>{RELEASE.status}</span>
              </div>
              <h2>Get OneBill for Android</h2>
              <p>
                Manage your everyday billing, customer khata ledger, and payments on any Android smartphone. 
                Built for performance, offline reliability, and fast UPI payment collection.
              </p>

              <div className="download-specs-grid">
                <div className="spec-item">
                  <small>Package Name</small>
                  <b>{RELEASE.packageName}</b>
                </div>
                <div className="spec-item">
                  <small>Version & Build</small>
                  <b>v{RELEASE.version} (Build {RELEASE.buildNumber})</b>
                </div>
                <div className="spec-item">
                  <small>Android Compatibility</small>
                  <b>{RELEASE.minAndroid} to {RELEASE.targetAndroid}</b>
                </div>
                <div className="spec-item">
                  <small>Optimized APK Size</small>
                  <b>{RELEASE.fileSizeArm64} (Split ABI)</b>
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="download-action-box">
              <h4>Download Official APK</h4>
              
              {hasLiveLink ? (
                <>
                  <a href={RELEASE.downloadUrl} className="btn btn-primary btn-lg" download>
                    <SvgIcon name="download" />
                    <span>Download APK ({RELEASE.fileSizeArm64})</span>
                  </a>
                  <p style={{ marginTop: '14px' }}>Verified cryptographic build for Android.</p>
                </>
              ) : (
                <>
                  <div className="download-status-indicator">
                    <span>⚡ APK Release Build in Progress</span>
                  </div>
                  <p>
                    The official v1.0.0 APK binary is currently being finalized. 
                    Once published, the direct download link will become active here.
                  </p>
                  <a 
                    href={RELEASE.githubRepo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary btn-lg"
                  >
                    <span>View GitHub Distribution Channel</span>
                    <SvgIcon name="arrow" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Split ABI Architecture Cards */}
        <div className="section-head left" style={{ marginBottom: '24px' }}>
          <span className="eyebrow">Optimized Binary Architecture</span>
          <h2>Split-Per-ABI Android Binaries</h2>
          <p>
            Unlike heavy monolithic APKs, OneBill is compiled with split architectures to save device storage 
            and guarantee lightning-fast installation.
          </p>
        </div>

        <div className="abi-grid">
          <div className="abi-card recommended">
            <div className="abi-header">
              <span className="abi-badge">Recommended</span>
              <SvgIcon name="bolt" style={{ width: 18, height: 18, color: '#126E5D' }} />
            </div>
            <h4>ARM 64-bit (arm64-v8a)</h4>
            <p>Optimized for 95%+ of modern Android phones (Samsung, Xiaomi, Vivo, Realme, OnePlus, Motorola).</p>
            <dl>
              <dt>File Size:</dt>
              <dd>{RELEASE.fileSizeArm64}</dd>
            </dl>
            {hasLiveLink && RELEASE.arm64Url ? (
              <a href={RELEASE.arm64Url} className="btn btn-primary btn-sm">Download ARM64</a>
            ) : (
              <span className="btn btn-secondary btn-sm btn-disabled">Release Pending</span>
            )}
          </div>

          <div className="abi-card">
            <div className="abi-header">
              <span className="abi-badge" style={{ background: '#475569' }}>Legacy 32-bit</span>
            </div>
            <h4>ARM 32-bit (armeabi-v7a)</h4>
            <p>Designed for older or budget Android smartphones to ensure maximum compatibility.</p>
            <dl>
              <dt>File Size:</dt>
              <dd>{RELEASE.fileSizeArmv7}</dd>
            </dl>
            {hasLiveLink && RELEASE.armv7Url ? (
              <a href={RELEASE.armv7Url} className="btn btn-primary btn-sm">Download ARMv7</a>
            ) : (
              <span className="btn btn-secondary btn-sm btn-disabled">Release Pending</span>
            )}
          </div>

          <div className="abi-card">
            <div className="abi-header">
              <span className="abi-badge" style={{ background: '#475569' }}>Universal</span>
            </div>
            <h4>Universal APK</h4>
            <p>Single comprehensive package containing all ABI binaries for emulators and any device architecture.</p>
            <dl>
              <dt>File Size:</dt>
              <dd>{RELEASE.fileSizeUniversal}</dd>
            </dl>
            {hasLiveLink && RELEASE.universalUrl ? (
              <a href={RELEASE.universalUrl} className="btn btn-primary btn-sm">Download Universal</a>
            ) : (
              <span className="btn btn-secondary btn-sm btn-disabled">Release Pending</span>
            )}
          </div>
        </div>

        {/* 4-Step Installation Walkthrough */}
        <div className="install-steps-box">
          <h3>Installing the OneBill APK in 4 Easy Steps</h3>
          <div className="steps-list">
            <div className="step-card">
              <div className="step-number">1</div>
              <h5>Download APK</h5>
              <p>Tap the download button above to save the official OneBill APK file to your device.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h5>Open Download</h5>
              <p>Pull down your notification shade or open your phone's "Downloads" folder and tap the APK.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h5>Allow Unknown Apps</h5>
              <p>If prompted by Android security, toggle "Allow from this source" for your browser or Files app.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h5>Launch & Setup</h5>
              <p>Tap "Install" then "Open". Select English, Hindi, or Telugu and start billing immediately!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Help Center & FAQ (/help)
   ========================================================================== */
function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'offline',
      question: 'Does OneBill require an internet connection to create bills?',
      answer: 'No! OneBill is built 100% offline-first using a local SQLite (Drift) database. You can add customers, draft invoices, record payments, and adjust stock without internet. When you reconnect to Wi-Fi or mobile data, your data synchronizes automatically with Supabase.'
    },
    {
      category: 'upi',
      question: 'How do customers pay using the UPI QR Code on the bill?',
      answer: 'In the Business Profile settings, enter your UPI ID (e.g. yourname@upi) or upload your custom payment QR image. When you generate an invoice, OneBill automatically embeds a scannable UPI QR code on the PDF bill. Customers can scan it with GPay, PhonePe, Paytm, or BHIM to pay instantly.'
    },
    {
      category: 'languages',
      question: 'Which languages are supported, and how do I switch?',
      answer: 'OneBill natively supports English, Hindi (हिन्दी), and Telugu (తెలుగు). You can switch your preferred language at any time from the app Settings page with one tap.'
    },
    {
      category: 'security',
      question: 'Can someone else access my financial numbers if they hold my phone?',
      answer: 'No. You can enable App Lock inside OneBill with a secure 4–6 digit PIN and optional biometric fingerprint/face authentication. Every time you leave the app, it locks automatically.'
    },
    {
      category: 'khata',
      question: 'How does customer due tracking (Khata) work?',
      answer: 'Each customer profile tracks total billed amount, total received payments, and current balance due. When an invoice is created, it links to that customer. Recording a payment automatically decreases the outstanding balance in real time.'
    },
    {
      category: 'backup',
      question: 'What happens if I accidentally delete an invoice or customer?',
      answer: 'OneBill has a built-in Recycle Bin. Soft-deleted invoices, customers, and expenses can be restored with a single tap so you never lose critical records.'
    },
    {
      category: 'notifications',
      question: 'How do overdue payment notifications work?',
      answer: 'OneBill schedules smart Android notifications 7 days before, 1 day before, and on the invoice due date. If an invoice remains unpaid, post-due reminders fire after 1, 3, and 7 days. Once full payment is recorded, notifications cancel automatically.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="help-section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Help Center</span>
          <h2>Frequently Asked Questions</h2>
          <p>Find clear answers on offline storage, UPI integration, regional languages, and security.</p>
        </div>

        {/* Category Filter Pills */}
        <div className="faq-categories-bar">
          <button 
            className={`faq-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Questions
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'offline' ? 'active' : ''}`}
            onClick={() => setActiveCategory('offline')}
          >
            Offline & Sync
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'upi' ? 'active' : ''}`}
            onClick={() => setActiveCategory('upi')}
          >
            UPI & Payments
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'languages' ? 'active' : ''}`}
            onClick={() => setActiveCategory('languages')}
          >
            Languages
          </button>
          <button 
            className={`faq-cat-btn ${activeCategory === 'security' ? 'active' : ''}`}
            onClick={() => setActiveCategory('security')}
          >
            Security & Backup
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="faq-accordion-list">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question-btn" 
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{isOpen ? '✕' : '+'}</span>
                </button>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   What's New & Release Changelog (/whats-new)
   ========================================================================== */
function WhatsNewPage() {
  return (
    <div className="wrap" style={{ paddingTop: '80px' }}>
      <div className="section-head">
        <span className="eyebrow">Changelog & Roadmap</span>
        <h2>What's New in OneBill</h2>
        <p>Track releases, architectural improvements, and upcoming features.</p>
      </div>

      <div className="changelog-timeline">
        {/* Release v1.0.0 Card */}
        <div className="changelog-card">
          <div className="changelog-card-header">
            <div className="changelog-version">
              <h3>Version {RELEASE.version}</h3>
              <span>Build {RELEASE.buildNumber} • Initial Public Release</span>
            </div>
            <span className="changelog-badge">Latest Release</span>
          </div>

          <ul className="changelog-list">
            {RELEASE.releaseNotes.map((note) => (
              <li key={note}>
                <span className="changelog-bullet"></span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Roadmap Card */}
        <div className="changelog-card" style={{ borderStyle: 'dashed' }}>
          <div className="changelog-card-header">
            <div className="changelog-version">
              <h3>Upcoming Roadmap (v1.1)</h3>
              <span style={{ color: '#F59E0B' }}>Under Active Engineering</span>
            </div>
            <span className="changelog-badge" style={{ background: '#FEF3C7', color: '#D97706' }}>
              Planned
            </span>
          </div>

          <ul className="changelog-list">
            <li>
              <span className="changelog-bullet" style={{ background: '#F59E0B' }}></span>
              <span><strong>Bluetooth Thermal Receipt Printing:</strong> Direct 58mm and 80mm ESC/POS counter printing for retail shops.</span>
            </li>
            <li>
              <span className="changelog-bullet" style={{ background: '#F59E0B' }}></span>
              <span><strong>Bulk CSV / Excel Inventory Import:</strong> Upload and update thousands of catalog items from spreadsheets.</span>
            </li>
            <li>
              <span className="changelog-bullet" style={{ background: '#F59E0B' }}></span>
              <span><strong>WhatsApp Message Templates:</strong> 1-tap pre-formatted payment reminder messages with deep UPI payment links.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   About Page (/about)
   ========================================================================== */
function AboutPage() {
  return (
    <div className="wrap" style={{ paddingTop: '80px' }}>
      <div className="section-head">
        <span className="eyebrow">About OneBill</span>
        <h2>Built for Everyday Business</h2>
        <p>Simple, reliable, and respectful of your business data.</p>
      </div>

      <div className="card-sheet">
        <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '14px', color: '#0F1A17' }}>
          Our Mission
        </h3>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#566B65', marginBottom: '24px' }}>
          Most billing applications on the market are either too complex (requiring accounting certificates to operate) 
          or dependent on uninterrupted internet access that constantly fails in basement shops and remote warehouses. 
          OneBill was built from the ground up to solve this: an offline-first, blazing fast Android app that lets any shopkeeper, 
          trader, or service professional create professional bills, record UPI collections, and track customer dues with zero friction.
        </p>

        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '14px', color: '#0F1A17' }}>
          Core Engineering Principles
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div style={{ padding: '20px', background: '#F7FAF9', borderRadius: '12px', border: '1px solid #E1EBE7' }}>
            <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: '#126E5D' }}>Offline Sovereignty</h5>
            <p style={{ fontSize: '13px', color: '#566B65' }}>Your business data lives directly on your device. The app never hangs waiting for a network handshake.</p>
          </div>
          <div style={{ padding: '20px', background: '#F7FAF9', borderRadius: '12px', border: '1px solid #E1EBE7' }}>
            <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: '#126E5D' }}>Linguistic Inclusion</h5>
            <p style={{ fontSize: '13px', color: '#566B65' }}>Commercial software should speak the language of local trade. Full native English, Hindi, and Telugu support.</p>
          </div>
          <div style={{ padding: '20px', background: '#F7FAF9', borderRadius: '12px', border: '1px solid #E1EBE7' }}>
            <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: '#126E5D' }}>Data Privacy</h5>
            <p style={{ fontSize: '13px', color: '#566B65' }}>We never sell your customer records or monetize your business ledger. Your financial data is strictly yours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Privacy Policy & Terms of Service (/privacy & /terms)
   ========================================================================== */
function LegalPage({ kind }) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="wrap" style={{ paddingTop: '80px' }}>
      <div className="section-head">
        <span className="eyebrow">Legal & Compliance</span>
        <h2>{title}</h2>
        <p>Clear, transparent policies regarding your data storage, encryption, and rights.</p>
      </div>

      <div className="card-sheet legal-content">
        {isPrivacy ? (
          <>
            <h2>1. Offline Data Storage</h2>
            <p>
              OneBill operates on an offline-first architecture. When you enter customer information, line items, 
              invoices, and expenses, this data is saved to a local SQLite database directly on your Android device. 
              You can use the app indefinitely without sharing data across the network.
            </p>

            <h2>2. Cloud Synchronization & Encryption</h2>
            <p>
              When you opt-in to cloud backup using your authenticated account, supported business records synchronize 
              securely with Supabase cloud infrastructure over encrypted TLS connections. Sync transactions use 
              deterministic receipts to prevent duplicate entries and ensure data integrity.
            </p>

            <h2>3. Information We Collect</h2>
            <p>
              We only store the data you explicitly input into the application to facilitate your billing workflows 
              (such as customer contact numbers, item rates, invoice quantities, and business profile GSTIN/UPI). 
              We do NOT sell, lease, or monetize your customer lists or transactional data to third-party ad networks.
            </p>

            <h2>4. Security & App Lock</h2>
            <p>
              OneBill provides an App Lock mechanism secured by a 4–6 digit PIN or device biometrics (fingerprint/face). 
              Sensitive credentials and cryptographic tokens are held in Android Keystore / Flutter Secure Storage.
            </p>

            <h2>5. Business Deletion</h2>
            <p>
              You maintain full ownership of your data. Deleting a business in OneBill permanently deletes its local database 
              records, customer lists, and corresponding cloud synchronization snapshots.
            </p>
          </>
        ) : (
          <>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or utilizing the OneBill Android application, you agree to these Terms of Service. 
              OneBill is intended for lawful business billing, invoice generation, and financial record-keeping.
            </p>

            <h2>2. Accuracy of Financial Records</h2>
            <p>
              You are responsible for ensuring that all tax percentages (e.g. GST), invoice totals, UPI payment IDs, 
              and customer contact details entered into the application comply with local commercial and tax regulations.
            </p>

            <h2>3. Service Availability</h2>
            <p>
              While OneBill is engineered for offline dependability, cloud synchronization features rely on your 
              active internet connection and cloud infrastructure availability. We recommend regular backups.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              All branding, logos, software source code, and design assets associated with OneBill are protected by intellectual 
              property laws. You may not decompile or distribute unauthorized modified clones of the application.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Contact Page (/contact)
   ========================================================================== */
function ContactPage() {
  return (
    <div className="wrap" style={{ paddingTop: '80px' }}>
      <div className="section-head">
        <span className="eyebrow">Get in Touch</span>
        <h2>Contact OneBill Support</h2>
        <p>Have questions, feedback, or need assistance? We're here to help.</p>
      </div>

      <div className="card-sheet">
        <div className="contact-grid">
          <div className="contact-card-item">
            <h4>Distribution Channel</h4>
            <p>Follow official releases, updates, and report issues directly on GitHub.</p>
            <a 
              href={RELEASE.githubRepo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary btn-sm"
            >
              <span>GitHub Repository</span>
              <SvgIcon name="arrow" />
            </a>
          </div>

          <div className="contact-card-item">
            <h4>Developer & Email Support</h4>
            <p>For inquiries, custom enterprise requirements, or technical support.</p>
            <a href="mailto:support@onebill.app" className="btn btn-secondary btn-sm">
              <span>support@onebill.app</span>
              <SvgIcon name="arrow" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Home Page View
   ========================================================================== */
function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-mesh-glow"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="live-pulse-dot" style={{ width: 6, height: 6 }}></span>
              Offline-First Android Billing
            </span>

            <h1 className="hero-title">
              Effortless Billing & Khata.
              <em>Built for Real Business.</em>
            </h1>

            <p className="hero-lead">
              The high-speed Android billing app with instant UPI payment QR codes, customer khata ledger, 
              3 regional languages (English, हिन्दी, తెలుగు), and zero internet dependency.
            </p>

            <div className="hero-cta-group">
              <a href="/download" className="btn btn-primary btn-lg">
                <SvgIcon name="download" />
                <span>Download APK (v1.0.0 Ready)</span>
              </a>
              <a href="#demo" className="btn btn-secondary btn-lg">
                <span>Try Live Bill Simulator</span>
                <SvgIcon name="arrow" />
              </a>
            </div>

            <div className="hero-features-chips">
              <div className="feature-chip">
                <SvgIcon name="offline" />
                <span>100% Offline SQLite</span>
              </div>
              <div className="feature-chip">
                <SvgIcon name="qr" />
                <span>Instant UPI QR Bills</span>
              </div>
              <div className="feature-chip">
                <SvgIcon name="translate" />
                <span>English • हिन्दी • తెలుగు</span>
              </div>
              <div className="feature-chip">
                <SvgIcon name="lock" />
                <span>PIN & Biometric Lock</span>
              </div>
            </div>
          </div>

          {/* Interactive Phone Frame */}
          <HeroAppMockup />
        </div>
      </section>

      {/* Live Interactive Invoice Simulator */}
      <LiveInvoiceSimulator />

      {/* Core Features Bento Grid */}
      <FeaturesBento />

      {/* 3-Language Regional Showcase */}
      <LanguageShowcase />

      {/* Comparison Table */}
      <ComparisonSection />

      {/* Call to Action Banner */}
      <div className="wrap">
        <div className="cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to Simplify Your Daily Billing?</h2>
            <p>
              Experience faster checkout counters, automatic UPI payments, and dependable offline record keeping. 
              Download OneBill for Android.
            </p>
          </div>
          <a href="/download" className="btn btn-secondary btn-lg" style={{ background: '#FFFFFF', color: '#126E5D' }}>
            <SvgIcon name="download" />
            <span>Get OneBill for Android</span>
          </a>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   Footer
   ========================================================================== */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="brand-link" style={{ color: '#FFFFFF' }}>
              <img src="/assets/onebill-logo.png" alt="OneBill Logo" className="brand-logo-img" />
              <div className="brand-name">
                <span className="brand-title" style={{ color: '#FFFFFF' }}>OneBill</span>
                <span className="brand-subtitle" style={{ color: '#5EEAD4' }}>Android App</span>
              </div>
            </a>
            <p>
              Simple, dependable, offline-first billing and customer ledger app for modern Indian businesses.
            </p>
          </div>

          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/#demo">Live Invoice Demo</a></li>
              <li><a href="/#languages">3 Regional Languages</a></li>
              <li><a href="/download">Download APK</a></li>
              <li><a href="/whats-new">What's New (v1.0.0)</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="/help">Help Center & FAQ</a></li>
              <li><a href="/about">About OneBill</a></li>
              <li><a href="/contact">Contact Support</a></li>
              <li><a href={RELEASE.githubRepo} target="_blank" rel="noopener noreferrer">GitHub Releases</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy#offline">Offline Data Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 OneBill (com.onebill.app). All rights reserved.</span>
          <span>Engineered with Flutter, Drift SQLite & Supabase Sync.</span>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   Main Application Router & Shell
   ========================================================================== */
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/$/, '') || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const titles = {
      '/': 'OneBill — Smart Offline-First Billing & Khata App for Android',
      '/features': 'Features — OneBill Android Billing App',
      '/download': 'Download APK — OneBill Android Billing App',
      '/whats-new': "What's New & Changelog — OneBill",
      '/help': 'Help Center & FAQ — OneBill',
      '/about': 'About OneBill — Offline-First Invoicing for Business',
      '/privacy': 'Privacy Policy — OneBill',
      '/terms': 'Terms of Service — OneBill',
      '/contact': 'Contact & Support — OneBill'
    };
    document.title = titles[currentPath] || 'OneBill — Simple Billing';
  }, [currentPath]);

  // Page switcher
  let PageComponent = <HomePage />;
  if (currentPath === '/features') PageComponent = <><FeaturesBento /><ComparisonSection /></>;
  else if (currentPath === '/download') PageComponent = <DownloadPage />;
  else if (currentPath === '/whats-new') PageComponent = <WhatsNewPage />;
  else if (currentPath === '/help') PageComponent = <HelpPage />;
  else if (currentPath === '/about') PageComponent = <AboutPage />;
  else if (currentPath === '/privacy') PageComponent = <LegalPage kind="privacy" />;
  else if (currentPath === '/terms') PageComponent = <LegalPage kind="terms" />;
  else if (currentPath === '/contact') PageComponent = <ContactPage />;

  return (
    <>
      <Header currentPath={currentPath} />
      <main id="main-content">
        {PageComponent}
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
