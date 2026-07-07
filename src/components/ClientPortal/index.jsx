'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styling.scss';
import Plasma from '../Plasma/Plasma';

// ─────────────────────────────────────────────
// VALID ACCESS CODES  →  each maps to a client
// ─────────────────────────────────────────────
const CLIENTS = {
  'MELGO-2025': {
    name: 'Ahmed Benali',
    id: 'CLT-00142',
    agent: 'Sofiane K.',
    avatar: 'AB',
    phone: '+213 555 12 34 56',
    trips: [
      {
        id: 'TRP-8821',
        destination: 'Paris, France',
        flag: '🇫🇷',
        type: 'Family Vacation',
        status: 'upcoming',
        statusLabel: 'Confirmed',
        departDate: '2025-08-15',
        returnDate: '2025-08-25',
        travelers: 3,
        nights: 10,
        totalPrice: '420 000 DZD',
        progress: 85,
        image: 'paris',
        color: '#2563eb',
        flights: [
          { flightNo: 'AH 2041', airline: 'Air Algérie', from: 'ALG', to: 'CDG', dep: '07:30', arr: '11:15', date: '15 Aug 2025', class: 'Economy', status: 'Confirmed' },
          { flightNo: 'AH 2042', airline: 'Air Algérie', from: 'CDG', to: 'ALG', dep: '13:45', arr: '17:30', date: '25 Aug 2025', class: 'Economy', status: 'Confirmed' },
        ],
        hotels: [
          { name: 'Hotel du Louvre', city: 'Paris', stars: 4, checkIn: '15 Aug 2025', checkOut: '25 Aug 2025', nights: 10, roomType: 'Deluxe Double', status: 'Confirmed', confirmNo: 'HTL-44821' },
        ],
        visa: { type: 'Schengen Visa', country: 'France', status: 'approved', expiry: '2025-10-31', number: 'FR-2025-441' },
        documents: ['passport_copy.pdf', 'visa_france.pdf', 'hotel_voucher_paris.pdf', 'flight_tickets.pdf'],
      },
    ],
  },
  'MELGO-7788': {
    name: 'Yasmine Touati',
    id: 'CLT-00287',
    agent: 'Karima M.',
    avatar: 'YT',
    phone: '+213 550 98 76 54',
    trips: [
      {
        id: 'TRP-9903',
        destination: 'Istanbul, Turkey',
        flag: '🇹🇷',
        type: 'Honeymoon',
        status: 'upcoming',
        statusLabel: 'In Progress',
        departDate: '2025-07-20',
        returnDate: '2025-07-27',
        travelers: 2,
        nights: 7,
        totalPrice: '260 000 DZD',
        progress: 60,
        image: 'istanbul',
        color: '#ef4444',
        flights: [
          { flightNo: 'TK 0619', airline: 'Turkish Airlines', from: 'ALG', to: 'IST', dep: '06:00', arr: '10:40', date: '20 Jul 2025', class: 'Business', status: 'Confirmed' },
          { flightNo: 'TK 0620', airline: 'Turkish Airlines', from: 'IST', to: 'ALG', dep: '14:00', arr: '18:30', date: '27 Jul 2025', class: 'Business', status: 'Confirmed' },
        ],
        hotels: [
          { name: 'Budo Hotel Istanbul', city: 'Istanbul', stars: 5, checkIn: '20 Jul 2025', checkOut: '27 Jul 2025', nights: 7, roomType: 'Honeymoon Suite', status: 'Confirmed', confirmNo: 'HTL-77453' },
        ],
        visa: { type: 'e-Visa Turkey', country: 'Turkey', status: 'approved', expiry: '2025-09-01', number: 'TR-EVISA-99312' },
        documents: ['passport_copy.pdf', 'eVisa_turkey.pdf', 'hotel_budo.pdf', 'flight_turkish.pdf'],
      },
      {
        id: 'TRP-6610',
        destination: 'Dubai, UAE',
        flag: '🇦🇪',
        type: 'Business + Leisure',
        status: 'past',
        statusLabel: 'Completed',
        departDate: '2025-03-10',
        returnDate: '2025-03-17',
        travelers: 1,
        nights: 7,
        totalPrice: '195 000 DZD',
        progress: 100,
        image: 'dubai',
        color: '#10b981',
        flights: [
          { flightNo: 'EK 749', airline: 'Emirates', from: 'ALG', to: 'DXB', dep: '22:00', arr: '07:30', date: '10 Mar 2025', class: 'Economy', status: 'Completed' },
          { flightNo: 'EK 750', airline: 'Emirates', from: 'DXB', to: 'ALG', dep: '09:00', arr: '12:50', date: '17 Mar 2025', class: 'Economy', status: 'Completed' },
        ],
        hotels: [
          { name: 'JW Marriott Marquis', city: 'Dubai', stars: 5, checkIn: '10 Mar 2025', checkOut: '17 Mar 2025', nights: 7, roomType: 'King Deluxe', status: 'Completed', confirmNo: 'HTL-22190' },
        ],
        visa: { type: 'UAE Visa on Arrival', country: 'UAE', status: 'approved', expiry: '2025-04-10', number: 'UAE-VOA-33190' },
        documents: ['passport_copy.pdf', 'hotel_marriott.pdf', 'flight_emirates.pdf'],
      },
    ],
  },
};

// ─────────────────────────────
// SMALL ATOMS
// ─────────────────────────────
const StatusBadge = ({ status, label }) => (
  <span className={`cp-badge cp-badge--${status}`}>{label}</span>
);

const StarRating = ({ count }) => (
  <span className="cp-stars">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>
);

// ─────────────────────────────
// STAT CARD
// ─────────────────────────────
const StatCard = ({ icon, label, value, sub }) => (
  <div className="cp-stat-card">
    <div className="cp-stat-icon">{icon}</div>
    <div className="cp-stat-body">
      <div className="cp-stat-value">{value}</div>
      <div className="cp-stat-label">{label}</div>
      {sub && <div className="cp-stat-sub">{sub}</div>}
    </div>
  </div>
);

// ─────────────────────────────
// TRIP CARD
// ─────────────────────────────
const TripCard = ({ trip, onClick }) => (
  <motion.div
    className={`cp-trip-card ${trip.status === 'past' ? 'cp-trip-card--past' : ''}`}
    whileHover={{ y: -4 }}
    onClick={() => onClick(trip)}
    style={{ '--accent': trip.color }}
  >
    <div className="cp-trip-header">
      <div className="cp-trip-flag">{trip.flag}</div>
      <div className="cp-trip-meta">
        <div className="cp-trip-dest">{trip.destination}</div>
        <div className="cp-trip-type">{trip.type}</div>
      </div>
      <StatusBadge status={trip.status === 'past' ? 'completed' : 'confirmed'} label={trip.statusLabel} />
    </div>
    <div className="cp-trip-dates">
      <div className="cp-trip-date-block">
        <span className="cp-trip-date-label">Depart</span>
        <span className="cp-trip-date-val">{new Date(trip.departDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
      <div className="cp-trip-arrow">→</div>
      <div className="cp-trip-date-block">
        <span className="cp-trip-date-label">Return</span>
        <span className="cp-trip-date-val">{new Date(trip.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
    <div className="cp-trip-progress-row">
      <div className="cp-trip-progress-label">
        <span>Preparation</span>
        <span>{trip.progress}%</span>
      </div>
      <div className="cp-trip-progress-track">
        <motion.div
          className="cp-trip-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${trip.progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ background: trip.color }}
        />
      </div>
    </div>
    <div className="cp-trip-footer">
      <span className="cp-trip-info">✈ {trip.flights.length} flights &nbsp;·&nbsp; 🏨 {trip.hotels.length} hotel &nbsp;·&nbsp; 👥 {trip.travelers} pax</span>
      <span className="cp-trip-price">{trip.totalPrice}</span>
    </div>
  </motion.div>
);

// ─────────────────────────────
// TRIP DETAIL DRAWER
// ─────────────────────────────
const TripDetail = ({ trip, onClose }) => {
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🗺️' },
    { id: 'flights', label: 'Flights', icon: '✈️' },
    { id: 'hotels', label: 'Hotels', icon: '🏨' },
    { id: 'visa', label: 'Visa', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📁' },
  ];

  return (
    <motion.div
      className="cp-drawer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="cp-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ '--accent': trip.color }}
      >
        {/* Drawer Header */}
        <div className="cp-drawer-header">
          <div className="cp-drawer-title-row">
            <span className="cp-drawer-flag">{trip.flag}</span>
            <div>
              <div className="cp-drawer-dest">{trip.destination}</div>
              <div className="cp-drawer-id">{trip.id} · {trip.type}</div>
            </div>
            <StatusBadge status={trip.status === 'past' ? 'completed' : 'confirmed'} label={trip.statusLabel} />
          </div>
          <button className="cp-drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="cp-drawer-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`cp-drawer-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="cp-drawer-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >

              {tab === 'overview' && (
                <div className="cp-overview">
                  <div className="cp-overview-grid">
                    <div className="cp-overview-item"><span>Duration</span><strong>{trip.nights} nights</strong></div>
                    <div className="cp-overview-item"><span>Travelers</span><strong>{trip.travelers} person{trip.travelers > 1 ? 's' : ''}</strong></div>
                    <div className="cp-overview-item"><span>Departure</span><strong>{new Date(trip.departDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
                    <div className="cp-overview-item"><span>Return</span><strong>{new Date(trip.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
                    <div className="cp-overview-item"><span>Total Cost</span><strong className="cp-accent">{trip.totalPrice}</strong></div>
                    <div className="cp-overview-item"><span>Preparation</span><strong>{trip.progress}%</strong></div>
                  </div>
                  <div className="cp-checklist">
                    <div className="cp-checklist-title">Trip Checklist</div>
                    {[
                      { label: 'Flight tickets booked', done: true },
                      { label: 'Hotel reservation confirmed', done: true },
                      { label: 'Visa obtained', done: trip.visa?.status === 'approved' },
                      { label: 'Travel insurance', done: trip.progress >= 90 },
                      { label: 'Documents uploaded', done: trip.documents.length >= 3 },
                    ].map((item, i) => (
                      <div key={i} className={`cp-checklist-item ${item.done ? 'done' : ''}`}>
                        <span className="cp-check-icon">{item.done ? '✓' : '○'}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'flights' && (
                <div className="cp-flights-list">
                  {trip.flights.map((f, i) => (
                    <div key={i} className="cp-flight-item">
                      <div className="cp-flight-top">
                        <span className="cp-flight-airline">{f.airline}</span>
                        <span className="cp-flight-no">{f.flightNo}</span>
                        <StatusBadge status={f.status === 'Confirmed' ? 'confirmed' : 'completed'} label={f.status} />
                      </div>
                      <div className="cp-flight-route">
                        <div className="cp-flight-point">
                          <div className="cp-flight-time">{f.dep}</div>
                          <div className="cp-flight-code">{f.from}</div>
                        </div>
                        <div className="cp-flight-line-wrap">
                          <div className="cp-flight-date-center">{f.date}</div>
                          <div className="cp-flight-line"><div className="cp-flight-dot" /><div className="cp-flight-dashes" /><span className="cp-flight-plane">✈</span></div>
                          <div className="cp-flight-class">{f.class}</div>
                        </div>
                        <div className="cp-flight-point cp-flight-point--right">
                          <div className="cp-flight-time">{f.arr}</div>
                          <div className="cp-flight-code">{f.to}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'hotels' && (
                <div className="cp-hotels-list">
                  {trip.hotels.map((h, i) => (
                    <div key={i} className="cp-hotel-item">
                      <div className="cp-hotel-top">
                        <div>
                          <div className="cp-hotel-name">{h.name}</div>
                          <div className="cp-hotel-city">📍 {h.city}</div>
                          <StarRating count={h.stars} />
                        </div>
                        <StatusBadge status={h.status === 'Confirmed' ? 'confirmed' : 'completed'} label={h.status} />
                      </div>
                      <div className="cp-hotel-grid">
                        <div className="cp-hotel-field"><span>Check-in</span><strong>{h.checkIn}</strong></div>
                        <div className="cp-hotel-field"><span>Check-out</span><strong>{h.checkOut}</strong></div>
                        <div className="cp-hotel-field"><span>Duration</span><strong>{h.nights} nights</strong></div>
                        <div className="cp-hotel-field"><span>Room</span><strong>{h.roomType}</strong></div>
                        <div className="cp-hotel-field"><span>Confirmation</span><strong className="cp-accent">{h.confirmNo}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'visa' && (
                <div className="cp-visa-section">
                  {trip.visa ? (
                    <div className="cp-visa-card">
                      <div className="cp-visa-watermark">VISA</div>
                      <div className="cp-visa-body">
                        <div className="cp-visa-top-row">
                          <div>
                            <div className="cp-visa-type">{trip.visa.type}</div>
                            <div className="cp-visa-country">{trip.visa.country}</div>
                          </div>
                          <StatusBadge status="confirmed" label="Approved ✓" />
                        </div>
                        <div className="cp-visa-fields">
                          <div className="cp-visa-field"><span>Visa Number</span><strong>{trip.visa.number}</strong></div>
                          <div className="cp-visa-field"><span>Valid Until</span><strong>{new Date(trip.visa.expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
                        </div>
                        <div className="cp-visa-stamp">
                          <div className="cp-visa-stamp-inner">✓ ISSUED</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="cp-visa-pending">
                      <div style={{ fontSize: '40px', marginBottom: 12 }}>📋</div>
                      <p>Visa application in progress. Your agent will notify you once approved.</p>
                    </div>
                  )}
                </div>
              )}

              {tab === 'documents' && (
                <div className="cp-docs-list">
                  <div className="cp-docs-note">📌 All documents are securely stored and managed by your agent.</div>
                  {trip.documents.map((doc, i) => {
                    const ext = doc.split('.').pop().toUpperCase();
                    const icons = { PDF: '📄', JPG: '🖼️', PNG: '🖼️' };
                    return (
                      <div key={i} className="cp-doc-item">
                        <div className="cp-doc-icon">{icons[ext] || '📄'}</div>
                        <div className="cp-doc-info">
                          <div className="cp-doc-name">{doc.replace(/_/g, ' ').replace('.pdf', '').replace('.jpg', '')}</div>
                          <div className="cp-doc-ext">{ext} File</div>
                        </div>
                        <div className="cp-doc-status">✓ Stored</div>
                      </div>
                    );
                  })}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    const client = CLIENTS[code.trim().toUpperCase()];
    if (client) {
      onLogin(client);
    } else {
      setError('Invalid access code. Please contact your travel agent.');
      setLoading(false);
    }
  };

  return (
    <div className="cp-login-wrap">
      <div className="cp-plasma-bg">
        <Plasma color="#ef4444" speed={0.5} direction="forward" scale={1.5} opacity={0.8} mouseInteractive={false} />
      </div>

      <motion.div
        className="cp-login-card"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Logo */}
        <div className="cp-login-logo">
          <span className="cp-logo-mel">Mel</span>
          <span className="cp-logo-go">Go</span>
        </div>
        <div className="cp-login-title">Client Portal</div>
        <div className="cp-login-sub">Enter your personal access code to view your travel dashboard</div>

        <form className="cp-login-form" onSubmit={handleSubmit}>
          <div className="cp-code-label">Access Code</div>
          <input
            ref={inputRef}
            className={`cp-code-input ${error ? 'cp-code-input--error' : ''}`}
            type="text"
            placeholder="e.g. MELGO-2025"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                className="cp-login-error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <button className={`cp-login-btn ${loading ? 'loading' : ''}`} type="submit" disabled={loading || !code.trim()}>
            {loading ? <span className="cp-spinner" /> : 'Access My Dashboard'}
          </button>
        </form>

        <div className="cp-login-tip">
          💬 Don't have a code? Contact us to receive yours.
        </div>

        {/* Demo hint */}
        <div className="cp-demo-hint">
          <div className="cp-demo-label">Demo Codes</div>
          <div className="cp-demo-codes">
            <span onClick={() => setCode('MELGO-2025')}>MELGO-2025</span>
            <span onClick={() => setCode('MELGO-7788')}>MELGO-7788</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────
const Dashboard = ({ client, onLogout }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const upcomingTrips = client.trips.filter(t => t.status === 'upcoming');
  const pastTrips = client.trips.filter(t => t.status === 'past');

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'trips', icon: '🗺️', label: 'My Trips' },
    { id: 'support', icon: '💬', label: 'Support' },
  ];

  return (
    <div className="cp-dashboard">
      {/* Sidebar */}
      <aside className="cp-sidebar">
        <div className="cp-sidebar-logo">
          <span className="cp-logo-mel">Mel</span><span className="cp-logo-go">Go</span>
        </div>

        <div className="cp-sidebar-profile">
          <div className="cp-avatar">{client.avatar}</div>
          <div className="cp-sidebar-name">{client.name}</div>
          <div className="cp-sidebar-id">{client.id}</div>
        </div>

        <nav className="cp-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`cp-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="cp-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="cp-logout-btn" onClick={onLogout}>
          <span>↩</span> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="cp-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="cp-main-inner"
          >

            {/* ── DASHBOARD ── */}
            {activeSection === 'dashboard' && (
              <>
                <div className="cp-page-header">
                  <div>
                    <h1 className="cp-page-title">Welcome back, <span className="cp-accent">{client.name.split(' ')[0]}</span> 👋</h1>
                    <p className="cp-page-sub">Here's an overview of your travel portfolio</p>
                  </div>
                  <div className="cp-agent-badge">
                    <span>Your Agent</span>
                    <strong>{client.agent}</strong>
                  </div>
                </div>

                {/* Stats */}
                <div className="cp-stats-grid">
                  <StatCard icon="✈️" label="Total Trips" value={client.trips.length} sub="All time" />
                  <StatCard icon="⏳" label="Upcoming" value={upcomingTrips.length} sub={upcomingTrips[0] ? `Next: ${upcomingTrips[0].destination}` : 'None'} />
                  <StatCard icon="✅" label="Completed" value={pastTrips.length} sub="Successfully traveled" />
                  <StatCard icon="🌍" label="Countries" value={client.trips.length} sub="Visited & planned" />
                </div>

                {/* Upcoming trips */}
                {upcomingTrips.length > 0 && (
                  <section className="cp-section">
                    <div className="cp-section-title">Upcoming Trips</div>
                    <div className="cp-trips-grid">
                      {upcomingTrips.map(trip => (
                        <TripCard key={trip.id} trip={trip} onClick={setSelectedTrip} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Quick Actions */}
                <section className="cp-section">
                  <div className="cp-section-title">Quick Actions</div>
                  <div className="cp-actions-grid">
                    {[
                      { icon: '📞', label: 'Call Agent', sub: 'Speak with your agent directly', action: () => {} },
                      { icon: '📄', label: 'Request Document', sub: 'Get a copy of any file', action: () => {} },
                      { icon: '🗓️', label: 'Plan New Trip', sub: 'Start a new travel request', action: () => {} },
                      { icon: '💬', label: 'Send Message', sub: 'Contact our support team', action: () => setActiveSection('support') },
                    ].map((a, i) => (
                      <motion.button key={i} className="cp-action-card" whileHover={{ y: -4 }} onClick={a.action}>
                        <div className="cp-action-icon">{a.icon}</div>
                        <div className="cp-action-label">{a.label}</div>
                        <div className="cp-action-sub">{a.sub}</div>
                      </motion.button>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ── TRIPS ── */}
            {activeSection === 'trips' && (
              <>
                <div className="cp-page-header">
                  <div>
                    <h1 className="cp-page-title">My Trips</h1>
                    <p className="cp-page-sub">All your travel bookings in one place</p>
                  </div>
                </div>

                {upcomingTrips.length > 0 && (
                  <section className="cp-section">
                    <div className="cp-section-title">Upcoming ✈️</div>
                    <div className="cp-trips-grid">
                      {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} onClick={setSelectedTrip} />)}
                    </div>
                  </section>
                )}
                {pastTrips.length > 0 && (
                  <section className="cp-section">
                    <div className="cp-section-title">Past Trips 🏁</div>
                    <div className="cp-trips-grid">
                      {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} onClick={setSelectedTrip} />)}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ── SUPPORT ── */}
            {activeSection === 'support' && (
              <>
                <div className="cp-page-header">
                  <div>
                    <h1 className="cp-page-title">Support</h1>
                    <p className="cp-page-sub">We're here to help with your travel needs</p>
                  </div>
                </div>
                <div className="cp-support-grid">
                  <div className="cp-support-card">
                    <div className="cp-support-icon">👤</div>
                    <div className="cp-support-title">Your Dedicated Agent</div>
                    <div className="cp-support-agent">{client.agent}</div>
                    <div className="cp-support-info">{client.phone}</div>
                    <button className="cp-support-btn">📞 Call Now</button>
                  </div>
                  <div className="cp-support-card">
                    <div className="cp-support-icon">🏢</div>
                    <div className="cp-support-title">Melgo Travel Office</div>
                    <div className="cp-support-info">Mon–Sat: 08:00–18:00</div>
                    <div className="cp-support-info">+213 (0) 770 00 00 00</div>
                    <button className="cp-support-btn">📧 Send Email</button>
                  </div>
                  <div className="cp-support-card cp-support-card--wide">
                    <div className="cp-support-icon">💬</div>
                    <div className="cp-support-title">Leave a Message</div>
                    <textarea className="cp-support-textarea" placeholder="Describe your question or request..." rows={4} />
                    <button className="cp-support-btn cp-support-btn--send">Send Message</button>
                  </div>
                </div>
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Trip Detail Drawer */}
      <AnimatePresence>
        {selectedTrip && (
          <TripDetail trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────
// ROOT EXPORT
// ─────────────────────────────
export default function ClientPortal() {
  const [client, setClient] = useState(null);

  return (
    <div className="cp-root">
      <AnimatePresence mode="wait">
        {!client ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginScreen onLogin={setClient} />
          </motion.div>
        ) : (
          <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard client={client} onLogout={() => setClient(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
