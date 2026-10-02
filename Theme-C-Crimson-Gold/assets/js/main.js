/* Ab Initio India – Theme C interactions.
   Header, mobile menu, tabs, carousel, reveals, counters, profile toggles, insights filter/search/load-more,
   lightbox, share, form validation. GSAP is only loaded on desktop pages that use parallax. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* Header: more opaque once the page scrolls */
  var header = $('[data-header]');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Full-screen glass mobile menu (dialog with focus trap) */
  var openBtn = $('[data-menu-open]'), menu = doc.getElementById('mobileMenu');
  if (openBtn && menu) {
    var closeBtn = $('[data-menu-close]', menu), lastFocus = null;
    var openMenu = function () {
      lastFocus = doc.activeElement; menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      openBtn.setAttribute('aria-expanded', 'true'); doc.body.classList.add('menu-open'); closeBtn.focus();
    };
    var closeMenu = function (restore) {
      menu.classList.remove('is-open'); openBtn.setAttribute('aria-expanded', 'false'); doc.body.classList.remove('menu-open');
      setTimeout(function () { menu.hidden = true; }, reduce ? 0 : 240);
      if (restore !== false) (lastFocus || openBtn).focus();
    };
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button', menu), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
    window.matchMedia('(min-width: 992px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) closeMenu(false); });
  }

  /* Tabs (WAI-ARIA tabs pattern, automatic activation) */
  $$('[data-tabs]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab, panel = doc.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* Scroll-snap carousel with previous / next buttons */
  $$('[data-carousel]').forEach(function (rootEl) {
    var track = $('[data-track]', rootEl), prev = $('[data-prev]', rootEl), next = $('[data-next]', rootEl);
    if (!track || !prev || !next) return;
    var step = function () { var it = $('li', track); return it ? it.getBoundingClientRect().width + 24 : track.clientWidth; };
    var update = function () {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    requestAnimationFrame(update);
  });

  /* "Read full profile" toggles */
  $$('[data-expand]').forEach(function (btn) {
    var target = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      target.classList.toggle('is-open', open);
      btn.querySelector('span').textContent = open ? 'Show less' : 'Read full profile';
    });
  });

  /* Insights: category chips + search + load more (9 at a time) */
  var grid = $('[data-insights]');
  if (grid) {
    var items = $$('[data-cats]', grid), more = $('[data-more]'), status = $('[data-status]'), search = $('[data-search]');
    var featured = $('[data-featured]'), empty = $('[data-empty]'), chips = $$('[data-cat]');
    var PAGE = 9, shown = PAGE, cat = 'all', q = '';
    var render = function () {
      var matches = items.filter(function (it) {
        var okCat = cat === 'all' || it.getAttribute('data-cats').split('|').indexOf(cat) > -1;
        var okQ = !q || it.getAttribute('data-text').indexOf(q) > -1;
        return okCat && okQ;
      });
      items.forEach(function (it) { it.hidden = true; });
      matches.slice(0, shown).forEach(function (it) { it.hidden = false; });
      if (more) more.hidden = matches.length <= shown;
      if (featured) featured.hidden = cat !== 'all' || !!q;
      if (empty) empty.hidden = matches.length > 0;
      if (status) status.textContent = matches.length + (matches.length === 1 ? ' article' : ' articles') +
        (cat !== 'all' ? ' in ' + cat : '') + (q ? ' matching “' + search.value.trim() + '”' : '') +
        (matches.length > shown ? ', showing ' + shown : '');
    };
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        cat = b.getAttribute('data-cat'); shown = PAGE; render();
      });
    });
    if (search) {
      var t; search.addEventListener('input', function () {
        clearTimeout(t); t = setTimeout(function () { q = search.value.trim().toLowerCase(); shown = PAGE; render(); }, 150);
      });
      search.closest('form').addEventListener('submit', function (e) { e.preventDefault(); });
    }
    if (more) more.addEventListener('click', function () {
      var firstNew = items.filter(function (it) { return it.hidden; })[0];
      shown += PAGE; render();
      var link = firstNew && !firstNew.hidden && $('h3 a', firstNew); if (link) link.focus();
    });
    root.classList.add('insights-js'); render();
  }

  /* Lightbox for article images (native <dialog>: focus moves in, Esc closes, focus returns) */
  var box = doc.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    var boxImg = $('img', box), opener = null;
    $$('[data-lightbox]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn; boxImg.src = btn.getAttribute('data-lightbox'); boxImg.alt = btn.getAttribute('data-alt') || '';
        box.showModal();
      });
    });
    $$('[data-lightbox-close]', box).forEach(function (b) { b.addEventListener('click', function () { box.close(); }); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('close', function () { if (opener) opener.focus(); });
  } else {
    $$('[data-lightbox]').forEach(function (btn) {  // no <dialog> support: open the image in a new tab
      btn.addEventListener('click', function () { window.open(btn.getAttribute('data-lightbox'), '_blank', 'noopener'); });
    });
  }

  /* Share row: real page URL in share links, copy-link button */
  $$('[data-share]').forEach(function (a) {
    var u = encodeURIComponent(location.href), t = encodeURIComponent(doc.title);
    if (a.getAttribute('data-share') === 'linkedin') a.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + u;
    if (a.getAttribute('data-share') === 'whatsapp') a.href = 'https://wa.me/?text=' + t + '%20' + u;
  });
  $$('[data-copy]').forEach(function (b) {
    var msg = doc.getElementById(b.getAttribute('aria-describedby') || '');
    b.addEventListener('click', function () {
      var done = function () { if (msg) { msg.textContent = 'Link copied'; setTimeout(function () { msg.textContent = ''; }, 2500); } };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () { if (msg) msg.textContent = location.href; });
      else if (msg) msg.textContent = location.href;
    });
  });

  /* Enquiry form: inline validation messages */
  $$('form[data-validate]').forEach(function (form) {
    var fields = $$('input:not([type=hidden]):not([name=_honey]), textarea', form);
    var message = function (f) {
      if (f.validity.valueMissing) return 'Please enter your ' + (f.getAttribute('data-label') || 'details') + '.';
      if (f.validity.typeMismatch && f.type === 'email') return 'Please enter a valid email address, for example name@company.com.';
      if (f.validity.patternMismatch) return 'Please enter a valid phone number.';
      return '';
    };
    var check = function (f) {
      var err = doc.getElementById(f.id + '-error'), m = message(f);
      f.setAttribute('aria-invalid', m ? 'true' : 'false');
      if (err) { err.textContent = m; err.hidden = !m; }
      return !m;
    };
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) check(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); }
      else { var b = $('[type=submit]', form); if (b) { b.disabled = true; b.querySelector('span').textContent = 'Sending…'; } }
    });
  });

  /* Reveals: visible by default; hidden state only under html.motion; in-view items at once; 1.5 s safety net */
  if (reduce) return;
  var reveals = $$('[data-reveal]');
  setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-in'); }); root.classList.add('reveal-done'); }, 1500);
  var vh = window.innerHeight;
  var inView = reveals.map(function (el) { var r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; });
  reveals.forEach(function (el, i) { if (inView[i]) el.classList.add('is-in'); });
  var later = reveals.filter(function (el, i) { return !inView[i]; });

  /* Counters: animate once in view (final values are already in the markup) */
  var counters = $$('[data-count]');
  var runCounter = function (el) {
    var end = parseFloat(el.getAttribute('data-count')), start = null, dur = 1400;
    var stepFn = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased);
      if (p < 1) requestAnimationFrame(stepFn);
    };
    el.textContent = '0'; requestAnimationFrame(stepFn);
  };

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    later.forEach(function (el) { io.observe(el); });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else { later.forEach(function (el) { el.classList.add('is-in'); }); }

  /* Parallax: desktop only, GSAP loaded after the page is idle and only when needed */
  if (!$('[data-parallax]') || !window.matchMedia('(min-width: 992px)').matches) return;
  var base = (doc.currentScript || $('script[src$="assets/js/main.js"]')).src.replace(/js\/main\.js.*$/, 'vendor/');
  var load = function (src, cb) { var s = doc.createElement('script'); s.src = base + src; s.onload = cb; doc.head.appendChild(s); };
  var start = function () {
    load('gsap.min.js', function () { load('ScrollTrigger.min.js', function () {
      gsap.registerPlugin(ScrollTrigger);
      $$('[data-parallax]').forEach(function (el) {
        var amt = parseFloat(el.getAttribute('data-parallax')) || 8;
        gsap.to(el, { yPercent: -amt, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true } });
      });
    }); });
  };
  var idle = window.requestIdleCallback || function (f) { setTimeout(f, 200); };
  if (doc.readyState === 'complete') idle(start); else window.addEventListener('load', function () { idle(start); });
})();
