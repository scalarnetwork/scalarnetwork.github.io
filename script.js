/* ═══════════════════════════════════════════
   SCALAR NETWORK — script.js
   Zero external dependencies. Vanilla JS only.
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   SCALAR_STATS — SINGLE SOURCE OF TRUTH
   Update these values manually whenever needed.
   ───────────────────────────────────────────── */
const SCALAR_STATS = {
  // ─── NETWORK STATS ───────────────────────────────────────────────
  // Public testnet not yet deployed. These fields will be populated
  // when live infrastructure is running. Do not invent numbers.
  // ─────────────────────────────────────────────────────────────────

  // Development log entries (most recent first, max 3 shown)
  // OWNER: Update as milestones are genuinely reached.
devLog: [
    {
      date: '1 JUNE 2026',
      title: 'Integrity Edition — Closing the Gap Between Claim and Code',
      body: 'A multi-specialist audit uncovered critical vulnerabilities, internal contradictions against the specification\'s own declared principles, and symbols left silently undefined. Thirteen specialist reports were processed to written, justified decisions before a single line was touched. Code and specification corrections were applied sequentially and cross-referenced. Discarded: constructions violating the protocol\'s own prohibitions, a security parameter breakable in seconds with commodity hardware, undefined symbols in distribution formulas, procedures without edge-case handling, circular dependencies in operational sequencing, and the assumption that environment changes automatically propagate. Established: thirteen justified technical decisions, formal definitions for every distribution formula symbol, deterministic emergency governance eligibility that excludes the causing actor, a circularity-free operational sequence, a zero-byte security hardening, and a multi-account synchronisation procedure as permanent standard. The specification no longer contradicts itself. Every principle is consistently enforced across every layer. The reward mechanism is formally defined and deterministically verifiable. Scalar has moved from appearing internally consistent to being proven consistent across all audited components.'
    },
    {
      date: '20 MAY 2026',
      title: 'Optimisation Blueprint — Efficiency, Finality, and Throughput',
      body: 'A comprehensive set of improvements targeting the network’s three primary performance dimensions has been formalised. Transaction data efficiency can be increased severalfold, finality latency reduced by orders of magnitude, and total network throughput lifted by a factor of dozens — all without altering the protocol’s foundational constraints. Several supporting components are now entering a dedicated security‑research phase before integration approval.'
    },
    {
      date: '18 MAY 2026',
      title: 'Code Alignment — 9 Discrepancies Corrected',
      body: 'A full repository audit identified nine points where the implementation had drifted from the final specification. Each was corrected. Two annotation errors in the specification itself were also identified and fixed. All 1,400+ unit tests now pass against the aligned codebase. Every cryptographic constant now lives in a single authoritative location — all modules import from there.'
    },
    {
      date: '17 MAY 2026',
      title: 'Specification Consolidated — Single Source of Truth',
      body: 'The specification document was stripped of version numbers, release labels, historical change notes, and any language implying a previously active network. What remains is one document with no version, no changelog, and no transitional framing. It is the genesis reference — the single source of truth for the first implementation of Scalar.'
    },
    {
      date: 'MAY 2026',
      title: 'Wallet Earnings Flow — Complete',
      body: 'Network participation now produces a spendable wallet balance. A node that stays online accumulates coins over time — no mining hardware, no staking requirement. The earnings flow from participation to spendable balance is implemented and functional.'
    },
    {
      date: 'MAY 2026',
      title: 'Security Audit — 3 of 4 Findings Resolved',
      body: 'Three protocol-level issues identified by the security audit have been closed at the implementation level. The fourth finding requires testnet simulation to reproduce under real network conditions and remains open pending public testnet deployment.'
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
  // Counter animations disabled — no live network stats yet.
  // Re-enable this function when public testnet is deployed
  // and SCALAR_STATS is populated with real network numbers.
}

/* ─────────────────────────────────────────────
   POPULATE STATS & DEV LOG FROM SCALAR_STATS
   ───────────────────────────────────────────── */
function populateStats() {
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
