import React, { useState, useEffect, useRef } from 'react';
import {
  initialProfile,
  initialFamily,
  initialEducation,
  initialTimeline,
  initialMemories,
  initialAchievements,
  initialExperiences,
  initialSkills,
  initialGallery,
  initialFutureGoals,
  ContactMessageData
} from './data/archiveData';

export type PageId =
  | 'home'
  | 'story'
  | 'childhood'
  | 'family'
  | 'education'
  | 'timeline'
  | 'gallery'
  | 'memories'
  | 'achievements'
  | 'professional'
  | 'growth'
  | 'future'
  | 'contact';

export default function App() {
  // Page / Route State
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAmbiancePlaying, setIsAmbiancePlaying] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Data Collections
  const [profile] = useState(initialProfile);
  const [familyMembers] = useState(initialFamily);
  const [educationStages] = useState(initialEducation);
  const [timelineEvents] = useState(initialTimeline);
  const [memories] = useState(initialMemories);
  const [achievements] = useState(initialAchievements);
  const [experiences] = useState(initialExperiences);
  const [skills] = useState(initialSkills);
  const [galleryImages] = useState(initialGallery);
  const [futureGoals] = useState(initialFutureGoals);

  // Timeline & Gallery Filters
  const [timelineFilter, setTimelineFilter] = useState('All');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [achievementFilter, setAchievementFilter] = useState('All');

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [savedMessages, setSavedMessages] = useState<ContactMessageData[]>(() => {
    try {
      const stored = localStorage.getItem('archive_messages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Health Modal State
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Web Audio Context Reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages: PageId[] = [
        'home', 'story', 'childhood', 'family', 'education',
        'timeline', 'gallery', 'memories', 'achievements',
        'professional', 'growth', 'future', 'contact'
      ];
      if (validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('archive-theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkTheme) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('archive-theme', 'light');
      setIsDarkTheme(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('archive-theme', 'dark');
      setIsDarkTheme(true);
    }
  };

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = (window.scrollY / total) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate helper
  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ambient Audio (pure Web Audio API)
  const toggleAmbientAudio = () => {
    if (!isAmbiancePlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 warm room root

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 warm harmonic

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2.5);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        gainNodeRef.current = gain;
        setIsAmbiancePlaying(true);
      } catch (err) {
        console.warn('Web Audio error:', err);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
        setTimeout(() => {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          audioCtxRef.current?.close();
          setIsAmbiancePlaying(false);
        }, 800);
      }
    }
  };

  // Lightbox controls
  const filteredGallery = galleryFilter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category.toLowerCase() === galleryFilter.toLowerCase());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredGallery.length]);

  // Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please complete all required fields.');
      return;
    }
    if (!contactForm.email.includes('@') || !contactForm.email.includes('.')) {
      setContactError('Please enter a valid email address.');
      return;
    }

    const newMessage: ContactMessageData = {
      id: Date.now(),
      senderName: contactForm.name.trim(),
      senderEmail: contactForm.email.trim(),
      subject: contactForm.subject.trim() || 'General Archival Transmission',
      message: contactForm.message.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newMessage, ...savedMessages];
    setSavedMessages(updated);
    try {
      localStorage.setItem('archive_messages', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setContactSuccess(true);
    setContactError('');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // Filtered Timeline
  const filteredTimeline = timelineFilter === 'All'
    ? timelineEvents
    : timelineEvents.filter(ev => ev.category.toLowerCase() === timelineFilter.toLowerCase());

  // Filtered Achievements
  const filteredAchievements = achievementFilter === 'All'
    ? achievements
    : achievements.filter(ach => ach.category.toLowerCase() === achievementFilter.toLowerCase());

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Reading Progress Bar */}
      <div
        id="reading-progress-bar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          backgroundColor: 'var(--accent-terracotta)',
          zIndex: 999,
          width: `${readingProgress}%`,
          transition: 'width 0.1s linear'
        }}
      />

      {/* Header Contract */}
      <header className="site-header">
        <div className="archive-container header-inner">
          {/* Zone 1: Wordmark */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
            className="brand-wordmark"
            title="Return to Archive Frontispiece"
          >
            {profile.preferredName}{' '}
            <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.95em' }}>
              · Life Archive
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="desktop-nav" aria-label="Archive Chapters">
            <button
              onClick={() => navigateTo('home')}
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('story')}
              className={`nav-link ${currentPage === 'story' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              My Story
            </button>
            <button
              onClick={() => navigateTo('childhood')}
              className={`nav-link ${currentPage === 'childhood' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Childhood
            </button>
            <button
              onClick={() => navigateTo('education')}
              className={`nav-link ${currentPage === 'education' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Education
            </button>
            <button
              onClick={() => navigateTo('timeline')}
              className={`nav-link ${currentPage === 'timeline' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Timeline
            </button>
            <button
              onClick={() => navigateTo('gallery')}
              className={`nav-link ${currentPage === 'gallery' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Gallery
            </button>

            {/* Chapters Dropdown */}
            <div className="nav-dropdown" style={{ position: 'relative' }}>
              <span className="nav-link nav-dropdown-trigger">
                Chapters
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
              <div className="nav-dropdown-menu">
                <button onClick={() => navigateTo('family')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Family & Lineage
                </button>
                <button onClick={() => navigateTo('memories')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Memories & Reflections
                </button>
                <button onClick={() => navigateTo('achievements')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Achievements & Honors
                </button>
                <button onClick={() => navigateTo('professional')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Professional Journey
                </button>
                <button onClick={() => navigateTo('growth')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Personal Growth
                </button>
                <button onClick={() => navigateTo('future')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Future Goals
                </button>
                <button onClick={() => navigateTo('contact')} className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Contact & Letters
                </button>
              </div>
            </div>
          </nav>

          {/* Zone 3: Controls */}
          <div className="header-actions">
            {/* Ambient Audio Tone */}
            <button
              onClick={toggleAmbientAudio}
              className="action-btn-subtle"
              title="Toggle quiet atmospheric room tone for reading"
              aria-label="Toggle ambient tone"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>{isAmbiancePlaying ? 'Silence' : 'Ambiance'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="action-btn-subtle"
              title="Switch between Parchment and Reading Room modes"
              aria-label="Toggle theme"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span>{isDarkTheme ? 'Parchment' : 'Reading Room'}</span>
            </button>

            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="hamburger-btn"
              aria-label="Open Archive Navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-nav-header">
          <span style={{ fontFamily: 'var(--font-serif-display)', fontWeight: 700, color: 'var(--text-ink)', fontSize: '1.1rem' }}>
            Archive Folio
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lightbox-btn"
            style={{ color: 'var(--text-ink)', padding: '0.25rem' }}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="mobile-nav-links">
          {[
            { id: 'home', label: '00. Frontispiece & Overview' },
            { id: 'story', label: '01. My Story' },
            { id: 'childhood', label: '02. Childhood & Origins' },
            { id: 'family', label: '03. Family & Lineage' },
            { id: 'education', label: '04. Education Journey' },
            { id: 'timeline', label: '05. Life Timeline' },
            { id: 'gallery', label: '06. Photo Archive' },
            { id: 'memories', label: '07. Memories & Reflections' },
            { id: 'achievements', label: '08. Achievements' },
            { id: 'professional', label: '09. Professional Journey' },
            { id: 'growth', label: '10. Personal Growth' },
            { id: 'future', label: '11. Future Goals' },
            { id: 'contact', label: '12. Contact & Letters' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id as PageId)}
              className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <span>{item.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: '1 0 auto' }}>
        {/* =========================================================
            PAGE 1: HOME (Frontispiece & Overview)
            ========================================================= */}
        {currentPage === 'home' && (
          <div>
            <section className="hero-section">
              <div className="archive-container">
                <div className="hero-grid">
                  <div>
                    <span className="section-kicker">Volume I · Personal Autobiography</span>
                    <h1 className="editorial-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '1.25rem' }}>
                      {profile.fullName}
                    </h1>

                    <p className="editorial-subhead" style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
                      {profile.tagline}
                    </p>

                    <div className="metadata-line" style={{ marginBottom: '1.75rem' }}>
                      <span>Age: {profile.currentAge}</span>
                      <span className="meta-separator">·</span>
                      <span>Origins: {profile.birthPlace}</span>
                      <span className="meta-separator">·</span>
                      <span>Residence: {profile.currentResidence}</span>
                    </div>

                    <blockquote className="editorial-quote" style={{ margin: '1.75rem 0', fontSize: '1.15rem' }}>
                      {profile.heroQuote}
                      <span className="quote-author">— Custodian's Inscription</span>
                    </blockquote>

                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '580px' }}>
                      {profile.shortBio}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button onClick={() => navigateTo('story')} className="btn-primary">
                        <span>Begin My Story</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                      <button onClick={() => navigateTo('timeline')} className="btn-secondary">
                        <span>Explore Timeline</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="hero-portrait-frame">
                      <img
                        src={profile.profilePhoto}
                        alt={`Archival Portrait of ${profile.fullName}`}
                        className="hero-portrait-img"
                      />
                      <div className="hero-portrait-caption">
                        <strong>{profile.fullName}</strong> · [REAL PROFILE PHOTO]
                        <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Current Chapter: {profile.currentChapter}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sequential Life Horizons Track */}
                <div className="chapter-milestones">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      Sequential Life Horizons
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--accent-terracotta)' }}>
                      {profile.currentChapter}
                    </span>
                  </div>

                  <div className="chapter-milestone-track">
                    <button onClick={() => navigateTo('childhood')} className="milestone-step" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">I. Childhood</span>
                    </button>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 0.5rem 1rem' }} />

                    <button onClick={() => navigateTo('education')} className="milestone-step" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">II. Education</span>
                    </button>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 0.5rem 1rem' }} />

                    <button onClick={() => { setTimelineFilter('Challenge'); navigateTo('timeline'); }} className="milestone-step" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">III. Challenges</span>
                    </button>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 0.5rem 1rem' }} />

                    <button onClick={() => navigateTo('growth')} className="milestone-step" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">IV. Growth</span>
                    </button>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 0.5rem 1rem' }} />

                    <button onClick={() => navigateTo('professional')} className="milestone-step active" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">V. Present</span>
                    </button>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 0.5rem 1rem' }} />

                    <button onClick={() => navigateTo('future')} className="milestone-step" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <div className="milestone-node" />
                      <span className="milestone-label">VI. Future</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Chronological Anchors */}
            <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="archive-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="section-kicker">Chronological Anchors</span>
                    <h2 className="editorial-title" style={{ fontSize: '2rem' }}>Defining Thresholds</h2>
                  </div>
                  <button onClick={() => navigateTo('timeline')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    View Complete Timeline &rarr;
                  </button>
                </div>

                <div className="archive-grid-3">
                  {timelineEvents.filter(e => e.isFeatured).slice(0, 3).map((event) => (
                    <div key={event.id} className="archive-card">
                      {event.photoUrl && (
                        <div className="archive-card-image">
                          <img src={event.photoUrl} alt={event.title} loading="lazy" />
                        </div>
                      )}
                      <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{event.yearDate}</span>
                        <span className="meta-separator">·</span>
                        <span>{event.category}</span>
                        {event.location && (
                          <>
                            <span className="meta-separator">·</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-ink)' }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, flexGrow: 1 }}>
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Memories in Ink */}
            <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)' }}>
              <div className="archive-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="section-kicker">Sensory Reflections</span>
                    <h2 className="editorial-title" style={{ fontSize: '2rem' }}>Memories in Ink</h2>
                  </div>
                  <button onClick={() => navigateTo('memories')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    Read All Memoirs &rarr;
                  </button>
                </div>

                <div className="archive-grid-2">
                  {memories.slice(0, 2).map((mem) => (
                    <div key={mem.id} className="archive-card" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <div className="metadata-line" style={{ marginBottom: '0.75rem' }}>
                        <span>{mem.dateStr}</span>
                        <span className="meta-separator">·</span>
                        <span>{mem.location}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-ink)' }}>
                        {mem.title}
                      </h3>
                      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)', marginBottom: '1.25rem' }}>
                        {mem.story}
                      </p>
                      {mem.quote && (
                        <blockquote style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--accent-terracotta)', borderLeft: '2px solid var(--accent-terracotta)', paddingLeft: '1rem', marginTop: 'auto' }}>
                          {mem.quote}
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Visual Fragments Preview */}
            <section style={{ padding: '4rem 0' }}>
              <div className="archive-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="section-kicker">Photographic Plate Vault</span>
                    <h2 className="editorial-title" style={{ fontSize: '2rem' }}>Visual Fragments</h2>
                  </div>
                  <button onClick={() => navigateTo('gallery')} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                    Open Full Gallery &rarr;
                  </button>
                </div>

                <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  {galleryImages.slice(0, 4).map((img, idx) => (
                    <div
                      key={img.id}
                      className="gallery-item"
                      onClick={() => openLightbox(idx)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="gallery-thumbnail-wrap">
                        <img src={img.imageUrl} alt={img.title} className="gallery-thumbnail" loading="lazy" />
                      </div>
                      <div className="gallery-meta">
                        <div className="metadata-line" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>
                          <span>{img.category}</span>
                          <span className="meta-separator">·</span>
                          <span>{img.year}</span>
                        </div>
                        <h4 className="gallery-title" style={{ fontSize: '0.95rem' }}>{img.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            PAGE 2: MY STORY (Long-form Editorial Biography)
            ========================================================= */}
        {currentPage === 'story' && (
          <article style={{ padding: '4rem 0' }}>
            <div className="archive-container archive-container-narrow">
              <header style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Autobiographical Monograph</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', marginBottom: '1rem' }}>
                  The Shape of Days: A Personal Chronicle
                </h1>
                <p className="editorial-subhead" style={{ marginBottom: '1.5rem' }}>
                  From rural village silence and early chalkboard slates to high-order computational systems and enduring creative craft.
                </p>
                <div className="metadata-line">
                  <span>Written by {profile.fullName}</span>
                  <span className="meta-separator">/</span>
                  <span>Estimated Reading Time: 12 Minutes</span>
                  <span className="meta-separator">/</span>
                  <span>Cloudflare Archival Edition</span>
                </div>
                <hr className="hairline-divider" />
              </header>

              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '3rem', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ink)', display: 'block', marginBottom: '0.75rem' }}>
                  Chapters in This Monograph
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem', fontFamily: 'var(--font-sans-ui)', fontSize: '0.8125rem' }}>
                  {['01. Where My Story Began', '02. Childhood', '03. Family Environment', '04. Early Dreams', '05. Education', '06. Difficult Moments', '07. Important Decisions', '08. Personal Growth', '09. Current Chapter', '10. Future Vision'].map((ch, i) => (
                    <a key={i} href={`#chapter-${i + 1}`} className="footer-nav-link">{ch}</a>
                  ))}
                </div>
              </div>

              {/* Chapter 1 */}
              <section id="chapter-1" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 01</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Where My Story Began</h2>
                <p className="drop-cap" style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [WHERE MY STORY BEGAN: Every human consciousness awakens in a geography it did not choose. Mine began in {profile.birthPlace}, where stone pathways wound between family courtyards and the seasons dictated the rhythm of every breath. Before the arrival of constant digital screens and rapid urban transit, existence had a palpable weight: the chill of morning well-water, the smell of damp lime on stone walls, and the distant chiming of temple bells echoing across the riverbanks. It was here that my earliest perceptions of time, patience, and belonging took root.]
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--text-prose)' }}>
                  [ORIGINS CONTEXT: In this village landscape, memory was not stored on silicone chips; it was preserved in the spoken word. The elders spoke with cadence and unhurried pause. To grow up in such an environment meant learning how to listen before presuming to speak—a discipline that would quietly govern every intellectual pursuit that followed in later decades.]
                </p>
              </section>

              {/* Chapter 2 */}
              <section id="chapter-2" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 02</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Childhood & the Open Horizon</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [CHILDHOOD STORY: Childhood was punctuated by dirt roads, improvised toys fashioned from bicycle spokes and timber scraps, and endless afternoon wanderings through adjacent groves. We did not measure wealth by possessions, but by the freedom to run until our chests burned and the dinner call echoed through the dusk.]
                </p>
                <div style={{ margin: '2rem 0', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src="/images/village_home.jpg" alt="Village Home" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Figure 1.1 — The ancestral village homestead and surrounding pathways where early curiosity was forged.
                  </div>
                </div>
              </section>

              {/* Chapter 3 */}
              <section id="chapter-3" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 03</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>The Familial Hearth</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [FAMILY ENVIRONMENT: If childhood provided the scenery, family provided the moral compass. Our household was centered around values of quiet perseverance, unyielding honesty, and deep hospitality. My father demonstrated that daily manual work possesses its own dignified poetry, while my mother ensured that despite any financial lean seasons, books and education were treated as non-negotiable holy artifacts.]
                </p>
                <blockquote className="editorial-quote">
                  “A home is not fortified by the thickness of its doors, but by the quiet generosity of the hands that open them.”
                  <span className="quote-author">— Family Principle</span>
                </blockquote>
              </section>

              {/* Chapter 4 */}
              <section id="chapter-4" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 04</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Early Dreams & Discovery</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [EARLY DREAMS: At age ten, I discovered an old translation of world encyclopedias in a corner shelf of the town library. For the first time, maps opened up: the Andes, the canals of Venice, the orbits of planetary satellites, and the lives of inventors who altered the course of human capability. I realized that beyond the perimeter of our hills lay an enormous conversation of human civilization, and I desperately wanted to participate in it.]
                </p>
              </section>

              {/* Chapter 5 */}
              <section id="chapter-5" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 05</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>The Crucible of Education</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [REAL EDUCATION DETAILS: Formal schooling was an arena of intense intellectual awakening. Moving through primary grades with chalkboard slates to high school laboratories, and ultimately competing for entry into university lecture halls. Mathematics and systemic logic provided an exhilarating clarity: problems had exact boundaries, and every complexity could be broken down into elegant primitives.]
                </p>
                <div style={{ margin: '2rem 0', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src="/images/study_desk.jpg" alt="Study Desk" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                  <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Figure 1.2 — The study desk: thousands of hours dedicated to reading, calculation, and rigorous analysis.
                  </div>
                </div>
              </section>

              {/* Chapter 6 */}
              <section id="chapter-6" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 06</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Trials, Solitude & Overcoming Doubt</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [DIFFICULT MOMENTS: Leaving home for university brought acute dislocation: cultural culture-shock in the metropolis, periods of profound loneliness, and seasons where financial constraints created intense anxiety. In those solitary hours, what sustained me was remembering the sacrifices my parents made. Hardship ceased to be an obstacle and became a furnace that burned away entitlement, leaving behind resilient grit.]
                </p>
              </section>

              {/* Chapter 7 */}
              <section id="chapter-7" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 07</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Important Decisions</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [IMPORTANT DECISIONS: Choosing to pursue deep systems engineering over superficial commercial shortcuts; choosing to relocate to unfamiliar territory to learn under masterful mentors; and choosing to dedicate discretionary hours to writing and heritage preservation rather than mindless entertainment.]
                </p>
              </section>

              {/* Chapter 8 */}
              <section id="chapter-8" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 08</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>The Architecture of Personal Growth</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [PERSONAL GROWTH: Over the years, the measure of success shifted profoundly. In my early twenties, success looked like external acclaim, titles, and velocity. In maturity, success looks like calmness of mind, depth of intimate relationships, intellectual honesty, and the ability to mentor younger individuals without ego.]
                </p>
              </section>

              {/* Chapter 9 */}
              <section id="chapter-9" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 09</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>The Present: Synthesis & Stewardship</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  [CURRENT CHAPTER: Today, in {profile.currentChapter}, my life stands at the intersection of execution and reflection. I build software architectures that solve complex infrastructural challenges, while simultaneously writing this life archive so that what was learned along the journey is not lost to the currents of forgetfulness.]
                </p>
              </section>

              {/* Chapter 10 */}
              <section id="chapter-10" style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chapter 10</span>
                <h2 className="editorial-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Looking Toward the Horizon</h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                  [FUTURE VISION: The upcoming chapters are not about personal aggrandizement, but about enduring contribution. Supporting talented young students from rural origins, authoring lasting texts, stewarding ecological land, and cultivating a peaceful home filled with laughter and books.]
                </p>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => navigateTo('timeline')} className="btn-primary">
                    <span>Continue Reading into the Timeline</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </section>
            </div>
          </article>
        )}

        {/* =========================================================
            PAGE 3: CHILDHOOD
            ========================================================= */}
        {currentPage === 'childhood' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part I · Origins & Roots</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  The Village Years: Childhood & Memory
                </h1>
                <p className="editorial-subhead">
                  Formative impressions in {profile.birthPlace}, where stone walls, unhurried seasons, and familial wisdom shaped the earliest worldview.
                </p>
                <div className="metadata-line" style={{ marginTop: '1rem' }}>
                  <span>Birth Place: {profile.birthPlace}</span>
                  <span className="meta-separator">/</span>
                  <span>Era: Formative Decades</span>
                  <span className="meta-separator">/</span>
                  <span>Atmosphere: Agrarian Simplicity & Boundless Curiosity</span>
                </div>
              </header>

              <div style={{ marginBottom: '4rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ maxHeight: '480px', overflow: 'hidden' }}>
                  <img src="/images/village_home.jpg" alt="Childhood Village Home" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="eager" />
                </div>
                <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1rem', color: 'var(--text-ink)' }}>[ANCESTRAL VILLAGE COURTYARD]</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>[EARLY MEMORY PLACE: The threshold where generations gathered to shell peas, share folktales, and watch summer storms rolling over the hills.]</p>
                  </div>
                  <span className="tabular-nums" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-terracotta)' }}>Archival Plate 01</span>
                </div>
              </div>

              <div className="archive-grid-2" style={{ marginBottom: '4rem' }}>
                <div className="archive-card">
                  <span className="section-kicker">Awakening</span>
                  <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-ink)' }}>
                    Early Interests & Hands-on Curiosity
                  </h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)', marginBottom: '1rem' }}>
                    [EARLY INTERESTS: Disassembling grandfather's wind-up clocks, examining bicycle gear sprockets, sketching wildlife from the orchard, and reading astronomy pamphlets by candle-light.]
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Everything around us was tangible: dirt, timber, water, and mechanics. Learning meant physically experimenting and observing cause and effect without algorithmic filters.
                  </p>
                </div>

                <div className="archive-card">
                  <span className="section-kicker">Topography</span>
                  <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-ink)' }}>
                    Important Places of Remembrance
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <li style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.5rem' }}>
                      <strong>[THE BANYAN TREE COURTYARD]</strong> — Village meeting spot where elders settled community disputes and children played marble games.
                    </li>
                    <li style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.5rem' }}>
                      <strong>[THE RIVER CROSSING & STONE BRIDGE]</strong> — Daily threshold crossed to walk to primary school; place of summer swimming and reflection.
                    </li>
                    <li style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.5rem' }}>
                      <strong>[THE TOWN READING ROOM]</strong> — A single-room public library containing yellowed encyclopedias and classical literature.
                    </li>
                    <li>
                      <strong>[THE FAMILY ATTIC]</strong> — Quiet wooden sanctuary containing family trunks, vintage tools, and old correspondence.
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <span className="section-kicker">Narrative Plates</span>
                <h2 className="editorial-title" style={{ fontSize: '1.85rem', marginBottom: '2rem' }}>
                  Recorded Childhood Vignettes
                </h2>
                <div className="archive-grid-2">
                  {memories.slice(0, 2).map(mem => (
                    <div key={mem.id} className="archive-card" style={{ backgroundColor: 'var(--bg-surface-elevated)' }}>
                      <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                        <span>{mem.dateStr}</span>
                        <span className="meta-separator">·</span>
                        <span>{mem.location}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.2rem', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                        {mem.title}
                      </h3>
                      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)' }}>
                        {mem.story}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 4: FAMILY & LINEAGE
            ========================================================= */}
        {currentPage === 'family' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part II · The Living Lineage</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Family Archive & Ancestral Roots
                </h1>
                <p className="editorial-subhead">
                  A curated tribute to the parents, grandparents, siblings, and mentors who provided the moral scaffold upon which this life was erected.
                </p>
                <div className="metadata-line" style={{ marginTop: '1rem' }}>
                  <span>Lineage Records: {familyMembers.length} Members Documented</span>
                  <span className="meta-separator">/</span>
                  <span>Heritage Continuity: Village to Modern Era</span>
                </div>
              </header>

              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2rem', marginBottom: '3.5rem' }}>
                <blockquote className="editorial-quote" style={{ margin: 0, fontSize: '1.25rem' }}>
                  “We are each the sum of sacrifices we did not witness and prayers uttered before we drew our first breath.”
                  <span className="quote-author">— Dedication of the Lineage Monograph</span>
                </blockquote>
              </div>

              <div className="archive-grid-2">
                {familyMembers.map(member => (
                  <div key={member.id} className="archive-card">
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)', flexShrink: 0 }}>
                        <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      </div>
                      <div>
                        <div className="metadata-line" style={{ marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent-terracotta)' }}>{member.relationship}</span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', color: 'var(--text-ink)' }}>
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                        Biographical Profile
                      </span>
                      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)' }}>
                        {member.shortBio}
                      </p>
                    </div>

                    {member.importantMemories && (
                      <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                        <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-bronze)', display: 'block', marginBottom: '0.35rem' }}>
                          Cherished Shared Memories
                        </span>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {member.importantMemories}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 5: EDUCATION JOURNEY
            ========================================================= */}
        {currentPage === 'education' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part III · The Intellectual Ascent</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  The Education Journey
                </h1>
                <p className="editorial-subhead">
                  A chronological progression through academic institutions, libraries, and laboratories that transformed innate curiosity into disciplined mastery.
                </p>
              </header>

              {/* Education Stage Indicators */}
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflowX: 'auto', gap: '1rem' }}>
                  {educationStages.map((stage, i) => (
                    <React.Fragment key={stage.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent-terracotta-soft)', color: 'var(--accent-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>
                          0{i + 1}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-ink)', whiteSpace: 'nowrap' }}>{stage.stageName}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{stage.years}</div>
                        </div>
                      </div>
                      {i < educationStages.length - 1 && (
                        <div style={{ color: 'var(--border-subtle)', fontSize: '1.25rem' }}>&rarr;</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Education Stage Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {educationStages.map((stage) => (
                  <div key={stage.id} className="archive-card" style={{ padding: '2.25rem' }}>
                    <div className="archive-grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
                      <div>
                        <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{stage.years}</span>
                          <span className="meta-separator">·</span>
                          <span>{stage.location}</span>
                          <span className="meta-separator">·</span>
                          <span style={{ textTransform: 'uppercase' }}>{stage.stageName}</span>
                        </div>

                        <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.6rem', color: 'var(--text-ink)', marginBottom: '0.5rem' }}>
                          {stage.institution}
                        </h2>

                        <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-bronze)', marginBottom: '1.25rem' }}>
                          Field of Focus: {stage.fieldOfStudy}
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                            Intellectual Experience & Reflection
                          </span>
                          <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-prose)' }}>
                            {stage.experience}
                          </p>
                        </div>

                        {stage.achievements && (
                          <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '0.25rem' }}>
                              Honors & Academic Distinctions
                            </span>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-ink)' }}>
                              {stage.achievements}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)', aspectRatio: '4/3' }}>
                          <img src={stage.photoUrl} alt={stage.institution} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                        <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                          Archival Plate: {stage.stageName} Reference
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 6: LIFE TIMELINE
            ========================================================= */}
        {currentPage === 'timeline' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '2.5rem' }}>
                <span className="section-kicker">Chronological Cartography</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  The Complete Life Timeline
                </h1>
                <p className="editorial-subhead">
                  An interactive chronicle documenting pivotal milestones, relocations, intellectual leaps, and trials of character across each life chapter.
                </p>
              </header>

              {/* Timeline Filter Bar */}
              <div className="timeline-filter-bar">
                {['All', 'Childhood', 'Education', 'Family', 'Achievement', 'Challenge', 'Career', 'Personal Growth', 'Present'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTimelineFilter(cat)}
                    className={`filter-btn ${timelineFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Timeline Items */}
              <div className="timeline-container">
                <div className="timeline-spine" />
                {filteredTimeline.map(event => (
                  <div key={event.id} className="timeline-item">
                    <div className="timeline-marker" />
                    <div className="timeline-content-card">
                      <span className="timeline-year-tag tabular-nums">{event.yearDate}</span>
                      <div className="metadata-line" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-ink)' }}>{event.category}</span>
                        {event.location && (
                          <>
                            <span className="meta-separator">·</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>

                      <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.25rem', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                        {event.title}
                      </h3>

                      {event.photoUrl && (
                        <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '220px' }}>
                          <img src={event.photoUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                        </div>
                      )}

                      <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)' }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 7: GALLERY & LIGHTBOX
            ========================================================= */}
        {currentPage === 'gallery' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '2.5rem' }}>
                <span className="section-kicker">Visual Corpus</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Photographic Plates & Visual Archive
                </h1>
                <p className="editorial-subhead">
                  A preserved gallery of places, companions, family gatherings, work stations, and quiet landscapes. Click any plate to open the interactive lightbox.
                </p>
              </header>

              {/* Category Filter Bar */}
              <div className="timeline-filter-bar">
                {['All', 'Childhood', 'Family', 'Education', 'Friends', 'Events', 'Achievements', 'Travel', 'Present'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`filter-btn ${galleryFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <div className="gallery-grid">
                {filteredGallery.map((img, idx) => (
                  <div
                    key={img.id}
                    className="gallery-item"
                    onClick={() => openLightbox(idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="gallery-thumbnail-wrap">
                      <img src={img.imageUrl} alt={img.title} className="gallery-thumbnail" loading="lazy" />
                    </div>
                    <div className="gallery-meta">
                      <div className="metadata-line" style={{ marginBottom: '0.25rem', fontSize: '0.7rem' }}>
                        <span>{img.category}</span>
                        {img.year && (
                          <>
                            <span className="meta-separator">·</span>
                            <span className="tabular-nums">{img.year}</span>
                          </>
                        )}
                      </div>
                      <h3 className="gallery-title">{img.title}</h3>
                      <p className="gallery-caption">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 8: MEMORIES & REFLECTIONS
            ========================================================= */}
        {currentPage === 'memories' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container archive-container-narrow">
              <header style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part IV · Emotional Cartography</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Memories & Inward Reflections
                </h1>
                <p className="editorial-subhead">
                  Sensory recollections of specific mornings, crossroads, night watches, and conversations that permanently altered the internal compass.
                </p>
                <hr className="hairline-divider" />
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {memories.map((mem, i) => (
                  <article key={mem.id} className="archive-card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="metadata-line" style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{mem.dateStr}</span>
                      {mem.location && (
                        <>
                          <span className="meta-separator">·</span>
                          <span>{mem.location}</span>
                        </>
                      )}
                      <span className="meta-separator">·</span>
                      <span>Memoir Folio #0{i + 1}</span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.6rem', color: 'var(--text-ink)', marginBottom: '1.25rem' }}>
                      {mem.title}
                    </h2>

                    {mem.photoUrl && (
                      <div style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '380px', border: '1px solid var(--border-subtle)' }}>
                        <img src={mem.photoUrl} alt={mem.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                      </div>
                    )}

                    <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-prose)', marginBottom: '1.5rem' }}>
                      {mem.story}
                    </div>

                    {mem.quote && (
                      <blockquote className="editorial-quote" style={{ margin: '1.5rem 0 0.5rem 0' }}>
                        {mem.quote}
                      </blockquote>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 9: ACHIEVEMENTS
            ========================================================= */}
        {currentPage === 'achievements' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '2.5rem' }}>
                <span className="section-kicker">Chronicle Part V · Proven Competence</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Achievements, Honors & Milestones
                </h1>
                <p className="editorial-subhead">
                  A verified registry of academic distinctions, competitive honors, professional recognitions, and physical endurance milestones achieved over the years.
                </p>
              </header>

              <div className="timeline-filter-bar">
                {['All', 'Academic', 'Award', 'Competition', 'Professional', 'Milestone'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAchievementFilter(cat)}
                    className={`filter-btn ${achievementFilter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="archive-grid-3">
                {filteredAchievements.map((item, i) => (
                  <div key={item.id} className="archive-card">
                    {item.imageUrl && (
                      <div className="archive-card-image">
                        <img src={item.imageUrl} alt={item.title} loading="lazy" />
                      </div>
                    )}

                    <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{item.year}</span>
                      <span className="meta-separator">·</span>
                      <span>{item.category}</span>
                      {item.issuer && (
                        <>
                          <span className="meta-separator">·</span>
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.issuer}</span>
                        </>
                      )}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.2rem', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-prose)', flexGrow: 1 }}>
                      {item.description}
                    </p>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)', fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Conferred: {item.issuer || 'Archival Registry'}</span>
                      <span className="tabular-nums">#0{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 10: PROFESSIONAL JOURNEY & CRAFT
            ========================================================= */}
        {currentPage === 'professional' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part VI · Vocation & Labor</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Professional Journey & Acquired Craft
                </h1>
                <p className="editorial-subhead">
                  A reflective examination of vocational discipline, engineering stewardship, and practical problem-solving. Written not as a corporate resume, but as an integral chapter of life philosophy.
                </p>
              </header>

              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2rem 2.5rem', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Guiding Craft Doctrine</span>
                <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                  The Primacy of Durability Over Novelty
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-prose)', maxWidth: '800px' }}>
                  Real craft is not measured by the velocity with which systems are assembled, but by the quiet grace with which they withstand unforeseen shocks. In software engineering as in masonry, true elegance resides in invisible foundations: deterministic boundaries, clear contracts, and human empathy for those who must maintain the system a decade later.
                </p>
              </div>

              <div style={{ marginBottom: '4rem' }}>
                <span className="section-kicker">Vocational Chronology</span>
                <h2 className="editorial-title" style={{ fontSize: '1.85rem', marginBottom: '2rem' }}>
                  Epochs of Practice
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {experiences.map(exp => (
                    <div key={exp.id} className="archive-card" style={{ padding: '2.25rem' }}>
                      <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{exp.years}</span>
                        <span className="meta-separator">·</span>
                        <span>{exp.location}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '0.25rem' }}>
                        {exp.role}
                      </h3>
                      <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-bronze)', marginBottom: '1.25rem' }}>
                        {exp.organization}
                      </div>
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-prose)', marginBottom: '1.25rem' }}>
                        {exp.narrativeDescription}
                      </p>
                      {exp.keyLearnings && (
                        <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-terracotta)' }}>
                          <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '0.25rem' }}>
                            Enduring Takeaway
                          </span>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-prose)' }}>
                            {exp.keyLearnings}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="section-kicker">Synthesized Capabilities</span>
                <h2 className="editorial-title" style={{ fontSize: '1.85rem', marginBottom: '2rem' }}>
                  Disciplines, Craft & Knowledge Sets
                </h2>
                <div className="archive-grid-2">
                  {skills.map(skill => (
                    <div key={skill.id} className="archive-card" style={{ padding: '1.5rem' }}>
                      <div className="metadata-line" style={{ marginBottom: '0.35rem', fontSize: '0.75rem' }}>
                        <span>{skill.category}</span>
                        <span className="meta-separator">·</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-terracotta)' }}>{skill.proficiencyNote}</span>
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.15rem', color: 'var(--text-ink)', marginBottom: '0.5rem' }}>
                        {skill.name}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {skill.reflection}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 11: PERSONAL GROWTH
            ========================================================= */}
        {currentPage === 'growth' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container archive-container-narrow">
              <header style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part VII · The Inward Evolution</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Personal Growth & Metamorphosis
                </h1>
                <p className="editorial-subhead">
                  A philosophical mirror reflecting on youth, illusions dismantled by experience, intellectual transformation, and the conscious stewardship of character.
                </p>
                <hr className="hairline-divider" />
              </header>

              <div style={{ marginBottom: '3.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <img src="/images/growth_landscape.jpg" alt="Alpine Ridge at Dawn" style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'cover', display: 'block' }} loading="eager" />
                <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Figure 4.1 — Solitude on the highland ridge: The landscape of inward renewal.</span>
                  <span>Elevation 2,400m</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <article className="archive-card" style={{ padding: '2.25rem' }}>
                  <span className="section-kicker">Reflection 01</span>
                  <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    Who I Was: The Impetuous Dreamer
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-prose)', marginBottom: '1rem' }}>
                    [WHO I WAS: In early youth, I believed that knowledge was synonymous with speed and accumulation. I was impatient with ambiguity and hungry for validation. Every debate felt like a territory to conquer, and failure felt like an existential indictment rather than a generous instructor.]
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Beneath that early intensity lay a quiet fear that one might remain unseen or that humble village beginnings were something to outrun rather than cherish.
                  </p>
                </article>

                <article className="archive-card" style={{ padding: '2.25rem' }}>
                  <span className="section-kicker">Reflection 02</span>
                  <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    Who I Am: The Mindful Custodian
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-prose)', marginBottom: '1rem' }}>
                    [WHO I AM: Today, I inhabit a much quieter sanctuary. I cherish unhurried mornings, deep conversations with family, and the satisfaction of building enduring things. I have made peace with my limits, while continuing to stretch them with steady daily labor.]
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    I judge myself not by the applause of strangers on the internet, but by the steadiness with which I keep faith with those who love me.
                  </p>
                </article>

                <article className="archive-card" style={{ padding: '2.25rem' }}>
                  <span className="section-kicker">Reflection 03</span>
                  <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    What I Learned: Hard-Won Realities
                  </h2>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', lineHeight: 1.75 }}>
                    <li style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
                      <strong>[ON COMPLEXITY]:</strong> Any intelligent fool can make things bigger and more complex. It takes true courage and a touch of genius to move in the opposite direction.
                    </li>
                    <li style={{ borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
                      <strong>[ON TIME]:</strong> You do not lack time; you lack clarity of elimination. Saying 'no' to good opportunities is the only prerequisite to saying 'yes' to monumental ones.
                    </li>
                    <li>
                      <strong>[ON RELATIONSHIPS]:</strong> The richness of old age is directly proportional to how many old friends you have not betrayed.
                    </li>
                  </ul>
                </article>

                <article className="archive-card" style={{ padding: '2.25rem' }}>
                  <span className="section-kicker">Reflection 04</span>
                  <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    How I Changed: The Softening of Pride
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-prose)' }}>
                    [HOW I CHANGED: The sharp edges of youthful dogmatism were rounded by the abrasive friction of actual experience. I learned to apologize without caveat. I learned that listening to someone with whom you disagree is not surrender; it is the elementary etiquette of civilization.]
                  </p>
                </article>

                <article className="archive-card" style={{ padding: '2.25rem' }}>
                  <span className="section-kicker">Reflection 05</span>
                  <h2 className="editorial-title" style={{ fontSize: '1.5rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    Where I Am Going: Toward the Horizon
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-prose)', marginBottom: '1.5rem' }}>
                    [WHERE I AM GOING: Forward into the next decade with open eyes and unclenched hands. Building institutions that will outlive me, mentoring young minds who will surpass me, and preserving the oral histories of the village that gave me my first breath.]
                  </p>
                  <div>
                    <button onClick={() => navigateTo('future')} className="btn-primary">
                      <span>Inspect Future Goals & Visions</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 12: FUTURE GOALS & VISION
            ========================================================= */}
        {currentPage === 'future' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container">
              <header style={{ maxWidth: '760px', marginBottom: '3.5rem' }}>
                <span className="section-kicker">Chronicle Part VIII · The Unwritten Pages</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Future Vision & Aspirational Goals
                </h1>
                <p className="editorial-subhead">
                  A documented pledge of intentionality. These are not idle daydreams, but strategic horizons mapped across career, philanthropy, family legacy, and creative craft.
                </p>
              </header>

              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '2.25rem', marginBottom: '3.5rem' }}>
                <blockquote className="editorial-quote" style={{ margin: 0, fontSize: '1.3rem' }}>
                  “A goal without a moral foundation is merely ambition; an ambition tethered to service becomes a lasting heritage.”
                  <span className="quote-author">— Custodian's Long-Horizon Compass</span>
                </blockquote>
              </div>

              <div className="archive-grid-2">
                {futureGoals.map(goal => (
                  <div key={goal.id} className="archive-card" style={{ padding: '2rem' }}>
                    <div className="metadata-line" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--accent-terracotta)' }}>{goal.category}</span>
                      <span className="meta-separator">·</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-bronze)' }}>{goal.targetTimeline}</span>
                      <span className="meta-separator">·</span>
                      <span>{goal.status}</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                      {goal.title}
                    </h3>

                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)', marginBottom: '1.25rem' }}>
                      {goal.description}
                    </p>

                    {goal.whyItMatters && (
                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)' }}>
                        <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                          Why This Endeavor Matters
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                          {goal.whyItMatters}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            PAGE 13: CONTACT & ARCHIVAL GUESTBOOK
            ========================================================= */}
        {currentPage === 'contact' && (
          <section style={{ padding: '4rem 0' }}>
            <div className="archive-container archive-container-narrow">
              <header style={{ marginBottom: '3.5rem' }}>
                <span className="section-kicker">Epilogue & Inquiries</span>
                <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
                  Send a Transmission to the Archive
                </h1>
                <p className="editorial-subhead">
                  Whether you are an old acquaintance from the village, a fellow researcher, a collaborator, or a thoughtful traveler across the web, your message is welcomed and cataloged in the archive.
                </p>
                <div className="metadata-line" style={{ marginTop: '1rem' }}>
                  <span>Custodian: {profile.fullName}</span>
                  <span className="meta-separator">/</span>
                  <span>Direct Email: {profile.email}</span>
                  <span className="meta-separator">/</span>
                  <span>Location: {profile.currentResidence}</span>
                </div>
                <hr className="hairline-divider" />
              </header>

              {contactSuccess && (
                <div className="flash-alert success" role="alert" style={{ marginBottom: '2rem' }}>
                  <span>Your transmission has been preserved in the archive. Thank you for connecting.</span>
                  <button onClick={() => setContactSuccess(false)} className="lightbox-btn" style={{ color: 'inherit', padding: '0.25rem' }}>&times;</button>
                </div>
              )}

              {contactError && (
                <div className="flash-alert error" role="alert" style={{ marginBottom: '2rem' }}>
                  <span>{contactError}</span>
                  <button onClick={() => setContactError('')} className="lightbox-btn" style={{ color: 'inherit', padding: '0.25rem' }}>&times;</button>
                </div>
              )}

              <div className="archive-grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.4rem', color: 'var(--text-ink)', marginBottom: '1rem' }}>
                    Permanent Archival Coordinates
                  </h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-prose)', marginBottom: '1.5rem' }}>
                    Transmissions sent through this portal are preserved directly in client-side storage. You may also connect via external research and vocational networks below.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-terracotta)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Direct Dispatch</span>
                        <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-ink)' }}>{profile.email}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-terracotta)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Geographic Anchorage</span>
                        <div style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-ink)' }}>{profile.currentResidence}</div>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-sans-ui)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ink)', marginBottom: '0.75rem' }}>
                    External Profiles & Commons
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href={profile.socialGithub} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.85rem' }}>
                      GitHub Codebase
                    </a>
                    <a href={profile.socialLinkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.85rem' }}>
                      Professional Network
                    </a>
                    <a href={profile.socialTwitter} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.85rem' }}>
                      Public Dispatches
                    </a>
                  </div>
                </div>

                {/* Working Frontend Form */}
                <div className="archive-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.35rem', color: 'var(--text-ink)', marginBottom: '1.25rem' }}>
                    Inscribe a Message
                  </h3>

                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name / Identification *</label>
                      <input
                        type="text"
                        id="name"
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Eleanor Vance"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Return Electronic Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        className="form-input"
                        placeholder="name@domain.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">Subject / Purpose of Correspondence</label>
                      <input
                        type="text"
                        id="subject"
                        value={contactForm.subject}
                        onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="form-input"
                        placeholder="e.g. Village Memories Inquiry"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">Your Message or Transmission *</label>
                      <textarea
                        id="message"
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={5}
                        className="form-textarea"
                        placeholder="Write your letter, memory, or greeting here..."
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <span>Transmit into Archive</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" x2="11" y1="2" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>

              {/* Saved Messages Archive in Browser */}
              {savedMessages.length > 0 && (
                <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="section-kicker">Locally Preserved Transmissions</span>
                  <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.4rem', color: 'var(--text-ink)', marginBottom: '1.5rem' }}>
                    Archival Dispatch Register ({savedMessages.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {savedMessages.map((msg) => (
                      <div key={msg.id} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
                        <div className="metadata-line" style={{ marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-ink)' }}>{msg.senderName}</span>
                          <span className="meta-separator">·</span>
                          <span>{msg.senderEmail}</span>
                          <span className="meta-separator">·</span>
                          <span className="tabular-nums">{msg.createdAt}</span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.05rem', color: 'var(--accent-terracotta)', marginBottom: '0.35rem' }}>
                          {msg.subject}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-prose)', lineHeight: 1.6 }}>
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Universal Lightbox Modal */}
      {lightboxOpen && filteredGallery[lightboxIndex] && (
        <div
          className="lightbox-modal open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="lightbox-container">
            <button onClick={closeLightbox} className="lightbox-btn lightbox-close" aria-label="Close photo view">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <button onClick={prevLightbox} className="lightbox-btn lightbox-prev" aria-label="Previous photo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="lightbox-image-wrap">
              <img
                src={filteredGallery[lightboxIndex].imageUrl}
                alt={filteredGallery[lightboxIndex].title}
                className="lightbox-image"
              />
            </div>

            <button onClick={nextLightbox} className="lightbox-btn lightbox-next" aria-label="Next photo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            <div className="lightbox-caption-bar">
              <h4 className="lightbox-title">{filteredGallery[lightboxIndex].title}</h4>
              <p className="lightbox-desc">{filteredGallery[lightboxIndex].caption}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#A8A29A', fontFamily: 'var(--font-mono)' }}>
                {lightboxIndex + 1} of {filteredGallery.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Status Modal */}
      {showHealthModal && (
        <div
          className="lightbox-modal open"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          role="dialog"
          onClick={() => setShowHealthModal(false)}
        >
          <div
            className="archive-card"
            style={{ maxWidth: '520px', width: '90%', padding: '2rem', backgroundColor: 'var(--bg-surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.25rem', color: 'var(--text-ink)' }}>
                System & Cloudflare Health Status
              </h3>
              <button onClick={() => setShowHealthModal(false)} className="lightbox-btn" style={{ color: 'var(--text-ink)' }}>
                &times;
              </button>
            </div>
            <pre style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', border: '1px solid var(--border-subtle)' }}>
{JSON.stringify({
  status: "ok",
  app: "Digital Life Archive",
  runtime: "Cloudflare Workers / Pages Static Frontend",
  buildOutput: "dist/ (Vite Native)",
  database: "Self-contained Client Data Engine",
  records: {
    profiles: 1,
    timeline_events: timelineEvents.length,
    gallery_images: galleryImages.length,
    family_members: familyMembers.length,
    education_stages: educationStages.length,
    saved_transmissions: savedMessages.length
  },
  timestamp: new Date().toISOString()
}, null, 2)}
            </pre>
            <button
              onClick={() => setShowHealthModal(false)}
              className="btn-primary"
              style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
            >
              Close Status Inspection
            </button>
          </div>
        </div>
      )}

      {/* Curatorial Colophon Footer */}
      <footer className="site-footer">
        <div className="archive-container">
          <div className="footer-grid">
            <div>
              <span className="footer-col-title">About This Life Archive</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '440px' }}>
                A personal digital memoir structured as an interactive autobiography. Self-contained, lightweight, and engineered for high-velocity CDN caching and global delivery on Cloudflare Pages and Workers.
              </p>
              <div className="metadata-line">
                <span>Custodian: {profile.fullName}</span>
                <span className="meta-separator">/</span>
                <span>Origin: {profile.birthPlace}</span>
                <span className="meta-separator">/</span>
                <span>Build: Cloudflare Edition</span>
              </div>
            </div>

            <div>
              <span className="footer-col-title">Primary Chapters</span>
              <ul className="footer-nav-list">
                <li><button onClick={() => navigateTo('story')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>My Story (Long-form Biography)</button></li>
                <li><button onClick={() => navigateTo('childhood')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Childhood & Origins</button></li>
                <li><button onClick={() => navigateTo('family')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Family & Lineage</button></li>
                <li><button onClick={() => navigateTo('education')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Education Journey</button></li>
                <li><button onClick={() => navigateTo('timeline')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Complete Life Timeline</button></li>
                <li><button onClick={() => navigateTo('gallery')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Photo Archive & Albums</button></li>
              </ul>
            </div>

            <div>
              <span className="footer-col-title">Reflections & Inquiries</span>
              <ul className="footer-nav-list">
                <li><button onClick={() => navigateTo('memories')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Memories & Personal Stories</button></li>
                <li><button onClick={() => navigateTo('achievements')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Achievements & Milestones</button></li>
                <li><button onClick={() => navigateTo('professional')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Professional Craft</button></li>
                <li><button onClick={() => navigateTo('growth')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Personal Growth (Who I Was/Am)</button></li>
                <li><button onClick={() => navigateTo('future')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Future Vision & Goals</button></li>
                <li><button onClick={() => navigateTo('contact')} className="footer-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Send Transmission / Message</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} {profile.fullName}. Preserved for posterity. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowHealthModal(true)}
                className="footer-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
              >
                Health Status JSON
              </button>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="footer-nav-link" style={{ color: 'var(--text-faint)' }}>
                Robots.txt
              </a>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="footer-nav-link" style={{ color: 'var(--text-faint)' }}>
                Sitemap.xml
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="footer-nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-terracotta)' }}
              >
                Return to Top &uarr;
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
