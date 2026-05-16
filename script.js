/* ═══════════════════════════════════════════
   SCALAR NETWORK — script.js
   Zero external dependencies. Vanilla JS only.
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   SCALAR_STATS — SINGLE SOURCE OF TRUTH
   Update these values manually whenever needed.
   ───────────────────────────────────────────── */
const SCALAR_STATS = {
  blockHeight:     148_294,     // Current block height
  proofsVerified:  3_821_540,   // Total proofs verified
  uptimeHours:     2_847,       // Hours the testnet has been running
  txProcessed:     9_604,       // Transactions processed on testnet

  // Last manual update date (shown under stats bar)
  lastUpdated: '2025-05-15',

  // Development log entries (most recent first, max 3 shown)
  devLog: [
    {
      date: 'MAY 2025',
      title: 'Stress Test — 10k Concurrent Proofs',
      body: 'Ran a sustained load test generating 10,000 concurrent zero-knowledge proofs over a 6-hour window. Proof generation held steady with no degradation in verification time. Memory profile was clean throughout.'
    },
    {
      date: 'APR 2025',
      title: 'Block Propagation Latency Optimized',
      body: 'Reduced median block propagation time by 38% through a revised serialization pass. Network consensus is now reaching finality faster with the same security guarantees.'
    },
    {
      date: 'MAR 2025',
      title: 'Testnet Node Count Expanded',
      body: 'Expanded testnet infrastructure to additional independent nodes. This phase is about hardening real-world behaviour under distributed conditions before the genesis node specifications are finalized.'
    }
  ]
};

/* ─────────────────────────────────────────────
   COUNTER ANIMATION
   ───────────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start    = performance.now();
  const startVal = 0;

  function format(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return n.toLocaleString();
    return String(Math.floor(n));
  }

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + eased * (target - startVal));
    el.textContent = format(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = format(target);
  }

  requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────
   UPTIME COUNTER — running live
   ───────────────────────────────────────────── */
function startUptimeTick(el, baseHours) {
  let totalSeconds = baseHours * 3600;

  function format(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(5, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  el.textContent = format(totalSeconds);
  setInterval(() => {
    totalSeconds++;
    el.textContent = format(totalSeconds);
  }, 1000);
}

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — trigger counters
   ───────────────────────────────────────────── */
function initCounters() {
  const heroBlock = document.getElementById('hero-terminal');
  if (!heroBlock) return;

  const counterEls = {
    blockHeight:    document.getElementById('stat-block-height'),
    proofsVerified: document.getElementById('stat-proofs'),
    uptime:         document.getElementById('stat-uptime'),
    txProcessed:    document.getElementById('stat-tx'),
  };

  // Hero terminal counters
  const termBlock    = document.getElementById('term-block-height');
  const termProofs   = document.getElementById('term-proofs');
  const termUptime   = document.getElementById('term-uptime');

  let heroFired = false;

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !heroFired) {
      heroFired = true;
      if (termBlock)  animateCounter(termBlock, SCALAR_STATS.blockHeight, 2000);
      if (termProofs) animateCounter(termProofs, SCALAR_STATS.proofsVerified, 2200);
      if (termUptime) startUptimeTick(termUptime, SCALAR_STATS.uptimeHours);
    }
  }, { threshold: 0.3 });
  heroObserver.observe(heroBlock);

  // Stats bar counters
  let statsFired = false;
  const statsBar = document.getElementById('stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsFired) {
        statsFired = true;
        if (counterEls.blockHeight)    animateCounter(counterEls.blockHeight, SCALAR_STATS.blockHeight, 1600);
        if (counterEls.proofsVerified) animateCounter(counterEls.proofsVerified, SCALAR_STATS.proofsVerified, 1800);
        if (counterEls.txProcessed)    animateCounter(counterEls.txProcessed, SCALAR_STATS.txProcessed, 1400);
        if (counterEls.uptime)         animateCounter(counterEls.uptime, SCALAR_STATS.uptimeHours, 1200);
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }
}

/* ─────────────────────────────────────────────
   POPULATE STATS & DEV LOG FROM SCALAR_STATS
   ───────────────────────────────────────────── */
function populateStats() {
  // Stats note
  const noteEl = document.getElementById('stats-last-updated');
  if (noteEl) noteEl.textContent = SCALAR_STATS.lastUpdated;

  // Dev log
  const logContainer = document.getElementById('dev-log-container');
  if (logContainer) {
    logContainer.innerHTML = '';
    SCALAR_STATS.devLog.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <div class="log-date">${entry.date}</div>
        <h4>${entry.title}</h4>
        <p>${entry.body}</p>
      `;
      logContainer.appendChild(div);
    });
  }
}

/* ─────────────────────────────────────────────
   NAV — sticky + hamburger
   ───────────────────────────────────────────── */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav')) {
      mobileNav && mobileNav.classList.remove('open');
    }
  });
}

/* ─────────────────────────────────────────────
   FAQ ACCORDION
   ───────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ─────────────────────────────────────────────
   CLIPBOARD COPY
   ───────────────────────────────────────────── */
function initClipboard() {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      if (!text || text.includes('_HERE') || text.includes('PLACEHOLDER')) {
        // Show a "not set" message
        const orig = btn.innerHTML;
        btn.innerHTML = '⚠ Address not configured';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('copied');
        }, 2200);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });
}

/* ─────────────────────────────────────────────
   SMOOTH SCROLL
   ───────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   LIGHTBOX
   ───────────────────────────────────────────── */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');

  if (!lightbox) return;

  document.querySelectorAll('.screenshot-card[data-src]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      if (!src) return;
      lbImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* ─────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  populateStats();
  initNav();
  initFAQ();
  initClipboard();
  initSmoothScroll();
  initLightbox();
  initCounters();
});
