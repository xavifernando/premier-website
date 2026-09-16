(function () {
  'use strict';

  // Active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .nav-sheet a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });

  // Header scroll
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
    var top = document.querySelector('.back-to-top');
    if (top) top.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var sheet = document.getElementById('mobile-menu');
  if (toggle && sheet) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      sheet.setAttribute('aria-hidden', String(open));
      document.body.style.overflow = open ? '' : 'hidden';
    });
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        sheet.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal
  var els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Counters
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = performance.now();
        function tick(now) {
          var t = Math.min((now - start) / 1400, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  // Form mock submit
  var form = document.querySelector('.quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var orig = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = 'Enquiry sent ✓';
        btn.style.background = 'var(--success)';
        form.reset();
        setTimeout(function () {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 2200);
      }, 800);
    });
  }
})();
