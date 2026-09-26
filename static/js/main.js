/**
 * Digital Life Archive — Main Interactive Engine
 * Pure Vanilla JavaScript — Zero external libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNavigation();
  initGalleryLightbox();
  initReadingProgressBar();
  initAmbientAudio();
  initFlashDismissal();
});

/* ==========================================================================
   THEME TOGGLE (Archival Paper vs. Reading Room)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Restore saved theme
  const savedTheme = localStorage.getItem('archive-theme') || 'light';
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    updateThemeButtonIcon(true);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('archive-theme', 'light');
        updateThemeButtonIcon(false);
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('archive-theme', 'dark');
        updateThemeButtonIcon(true);
      }
    });
  }

  function updateThemeButtonIcon(isDark) {
    if (!toggleBtn) return;
    const textEl = toggleBtn.querySelector('.theme-btn-text');
    if (textEl) {
      textEl.textContent = isDark ? 'Parchment' : 'Reading Room';
    }
  }
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');

  if (!openBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   PHOTO GALLERY & LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('gallery-lightbox-modal');
  if (!modal) return;

  const lightboxImg = modal.querySelector('.lightbox-image');
  const lightboxTitle = modal.querySelector('.lightbox-title');
  const lightboxDesc = modal.querySelector('.lightbox-desc');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');

  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const fullSrc = item.getAttribute('data-full-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || '';
    const caption = item.getAttribute('data-caption') || '';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = caption;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-container')) {
      closeModal();
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

/* ==========================================================================
   READING PROGRESS BAR
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   ATMOSPHERIC AMBIENT AUDIO (Pure Web Audio API — No external assets)
   ========================================================================== */
function initAmbientAudio() {
  const audioBtn = document.getElementById('ambient-audio-toggle');
  if (!audioBtn) return;

  let audioCtx = null;
  let oscillator1 = null;
  let oscillator2 = null;
  let gainNode = null;
  let isPlaying = false;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  });

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();

      // Create warm low-frequency harmonics (110Hz A2 + 165Hz E3)
      oscillator1 = audioCtx.createOscillator();
      oscillator2 = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(110, audioCtx.currentTime); // A2

      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(164.81, audioCtx.currentTime); // E3

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 2.5); // Soft whisper level

      oscillator1.connect(filter);
      oscillator2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator1.start();
      oscillator2.start();

      isPlaying = true;
      audioBtn.classList.add('playing');
      const text = audioBtn.querySelector('.audio-btn-text');
      if (text) text.textContent = 'Silence Tone';
    } catch (e) {
      console.warn('Web Audio not allowed or failed:', e);
    }
  }

  function stopAmbientSound() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
      setTimeout(() => {
        if (oscillator1) oscillator1.stop();
        if (oscillator2) oscillator2.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        audioBtn.classList.remove('playing');
        const text = audioBtn.querySelector('.audio-btn-text');
        if (text) text.textContent = 'Reading Ambiance';
      }, 1000);
    }
  }
}

/* ==========================================================================
   FLASH MESSAGE DISMISSAL
   ========================================================================== */
function initFlashDismissal() {
  document.querySelectorAll('.flash-alert').forEach(alert => {
    const close = alert.querySelector('.alert-close');
    if (close) {
      close.addEventListener('click', () => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 250);
      });
    }
  });
}
