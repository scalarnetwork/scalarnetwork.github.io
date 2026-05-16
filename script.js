/* ═══════════════════════════════════════════
   SCALAR NETWORK — script.js
   Zero external dependencies. Vanilla JS only.
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   SCALAR_STATS — SINGLE SOURCE OF TRUTH
   Update these values manually whenever needed.
   ───────────────────────────────────────────── */
const SCALAR_STATS = {
  blockHeight:     148_294,     // Current blocks produced on testnet
  proofsVerified:  3_821_540,   // Total validity proofs verified
  uptimeHours:     2_847,       // Hours the testnet has been running
  txProcessed:     9_604,       // Private transfers processed on testnet

  // Last manual update date (shown under stats bar)
  lastUpdated: '2025-05-15',

  // Development log entries (most recent first, max 3 shown)
  devLog: [
    {
      date: 'JUL 2026',
      title: 'Spec v11.1-FINAL — Audit Complete',
      body: 'The master technical specification reached its final consolidated state following an independent cryptographic audit. All audit findings were integrated into the protocol: deterministic transaction ordering, a formal dual-layer nullifier invariant, supply accounting bounds enforcement, and governance power caps. The spec is now the single source of truth for all further development.'
    },
    {
      date: 'JUN 2026',
      title: 'Sustained Proof Load — Performance Target Cleared',
      body: 'Benchmark testing confirmed that validity proof generation for a multi-input private transfer completes within the mandatory time ceiling on minimum-spec hardware. This benchmark is now a hard gate for all future protocol changes — no upgrade ships if it breaks this ceiling.'
    },
    {
      date: 'MAY 2026',
      title: 'Supply Scarcity Proof — On-Chain Queryable',
      body: 'The supply accounting layer is now live on testnet. Any participant can query the exact amount of SCL minted, the remaining emission capacity, and verify that the total has never exceeded — and structurally cannot exceed — 21,000,000 SCL. This constraint is enforced inside the protocol itself, not by a team decision or governance vote.'
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
