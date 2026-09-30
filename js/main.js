(function () {
  'use strict';

  /* ===================================================================
     CONFIG — fill these in before launch.
     =================================================================== */
  // TODO: replace with the real Cal.com / Calendly booking link.
  var BOOKING_URL = '#';

  /* ===================================================================
     Tracking helper — fires GA4 / Meta Pixel events if those scripts
     are present. Safe no-op if tracking isn't installed yet.
     =================================================================== */
  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', eventName, params || {});
      }
    } catch (err) {
      /* tracking must never break the page */
    }
  }

  /* ===================================================================
     Mark JS as running. Reveal-on-scroll only activates once this class
     is present (see css/style.css) — if this script fails to load or
     run, every section stays fully visible by default.
     =================================================================== */
  document.documentElement.classList.add('js-ready');

  /* ===================================================================
     Audit / booking CTA buttons
     =================================================================== */
  var auditButtons = document.querySelectorAll('[data-audit-cta]');
  auditButtons.forEach(function (btn) {
    if (BOOKING_URL && BOOKING_URL !== '#') {
      btn.setAttribute('href', BOOKING_URL);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
    }
    btn.addEventListener('click', function (e) {
      var location = btn.getAttribute('data-audit-location') || 'unknown';
      track('audit_click', { location: location });
      if (!BOOKING_URL || BOOKING_URL === '#') {
        // Booking link isn't set up yet — don't send visitors to a dead "#".
        e.preventDefault();
      }
    });
  });

  /* ===================================================================
     Email link tracking
     =================================================================== */
  document.querySelectorAll('[data-email-link], a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      track('email_click', { href: link.getAttribute('href') });
    });
  });

  /* ===================================================================
     Mobile nav (hamburger)
     =================================================================== */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  function closeMenu() {
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    navMobile.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.contains('is-open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    navMobile.querySelectorAll('[data-close-menu]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* ===================================================================
     Active nav link on scroll (IntersectionObserver, not scroll math)
     =================================================================== */
  var navLinks = document.querySelectorAll('[data-nav-link]');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#' && id.length > 1) {
      var target = document.querySelector(id);
      if (target) { sections.push(target); }
    }
  });

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', match);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ===================================================================
     Scroll reveal
     =================================================================== */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ===================================================================
     FAQ accordion — one open at a time, works with mouse + keyboard.
     <details>/<summary> already gives native keyboard support; this
     just enforces the "only one open" rule for browsers that don't yet
     support the shared `name` attribute on <details>.
     =================================================================== */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        track('faq_open', { question: item.querySelector('summary').textContent.trim() });
        faqItems.forEach(function (other) {
          if (other !== item) { other.removeAttribute('open'); }
        });
      }
    });
  });

}());
