/* Ab Initio India – shared interactions (header, mobile menu, tabs, filter, carousel, motion). */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Header: more opaque once the page scrolls */
  var header = document.querySelector('[data-header]');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Full-screen glass mobile menu (dialog with focus trap) */
  var openBtn = document.querySelector('[data-menu-open]');
  var menu = document.getElementById('mobileMenu');
  if (openBtn && menu) {
    var closeBtn = menu.querySelector('[data-menu-close]');
    var lastFocus = null;
    var openMenu = function () {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      closeBtn.focus();
    };
    var closeMenu = function (restore) {
      menu.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      setTimeout(function () { menu.hidden = true; }, reduce ? 0 : 260);
      if (restore !== false) (lastFocus || openBtn).focus();
    };
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', function () { closeMenu(); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.slice.call(menu.querySelectorAll('a[href], button'));
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { closeMenu(false); }); });
    window.matchMedia('(min-width: 992px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) closeMenu(false); });
  }

  /* Tabs (WAI-ARIA tabs pattern, automatic activation) */
  document.querySelectorAll('[data-tabs]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
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

  /* Category filter (insights) */
  document.querySelectorAll('[data-filter]').forEach(function (bar) {
    var grid = document.querySelector(bar.getAttribute('data-filter'));
    var status = document.querySelector('[data-filter-status]');
    var buttons = Array.prototype.slice.call(bar.querySelectorAll('button'));
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat'), n = 0;
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        grid.querySelectorAll('[data-cats]').forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-cats').split('|').indexOf(cat) > -1;
          item.hidden = !show; if (show) n++;
        });
        if (status) status.textContent = n + (n === 1 ? ' article' : ' articles') + (cat === 'all' ? '' : ' in ' + b.getAttribute('data-label'));
      });
    });
  });

  /* Scroll-snap carousels with previous / next buttons */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-track]');
    var prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
    if (!track || !prev || !next) return;
    function step() { var it = track.querySelector('li'); return it ? it.getBoundingClientRect().width + 24 : track.clientWidth; }
    function update() {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update); update();
  });

  /* Gentle tilt on hover (transform only) */
  if (!reduce && finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* Motion
     - hero entrance: CSS keyframes on .anim (runs from first paint, see style.css)
     - section reveals: one IntersectionObserver toggling .is-in (CSS transition on transform/opacity)
     - parallax + stacking cards: GSAP ScrollTrigger, loaded after the page is idle and only where used */
  if (reduce) return;
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var showAll = function () { reveals.forEach(function (el) { el.classList.add('is-in'); }); document.documentElement.classList.add('reveal-done'); };
  setTimeout(showAll, 1500);  // safety net: nothing can stay hidden
  // anything already on screen shows immediately (read all positions first, then write, to avoid layout thrashing)
  var vh = window.innerHeight;
  var inView = reveals.map(function (el) { var r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; });
  reveals.forEach(function (el, i) { if (inView[i]) el.classList.add('is-in'); });
  reveals = reveals.filter(function (el, i) { return !inView[i]; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('is-in'); }); }

  if (!document.querySelector('[data-parallax], [data-stack]')) return;
  var base = (document.currentScript || document.querySelector('script[src$="assets/js/main.js"]')).src.replace(/js\/main\.js.*$/, 'vendor/');
  function load(src, cb) { var s = document.createElement('script'); s.src = base + src; s.onload = cb; document.head.appendChild(s); }
  function startScroll() {
    load('gsap.min.js', function () { load('ScrollTrigger.min.js', function () {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.matchMedia({
        '(min-width: 992px)': function () {
          gsap.utils.toArray('[data-parallax]').forEach(function (el) {
            var amt = parseFloat(el.getAttribute('data-parallax')) || 8;
            gsap.to(el, { yPercent: -amt, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true } });
          });
          var cards = gsap.utils.toArray('[data-stack] > *');
          cards.forEach(function (card, i) {
            var nextCard = cards[i + 1];
            if (!nextCard) return;
            gsap.to(card, { scale: 0.94, opacity: 0.55, ease: 'none', scrollTrigger: { trigger: nextCard, start: 'top 85%', end: 'top 25%', scrub: true } });
          });
        }
      });
    }); });
  }
  var idle = window.requestIdleCallback || function (f) { setTimeout(f, 200); };
  if (document.readyState === 'complete') idle(startScroll); else window.addEventListener('load', function () { idle(startScroll); });
})();
