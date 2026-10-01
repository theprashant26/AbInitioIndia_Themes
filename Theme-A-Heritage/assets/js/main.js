(function () {
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Close mobile menu after tapping a link
  document.querySelectorAll('#mainNav .nav-link:not(.dropdown-toggle), #mainNav .dropdown-item, #mainNav .btn').forEach(function (a) {
    a.addEventListener('click', function () {
      var nav = document.getElementById('mainNav');
      if (nav && nav.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  });

  // One orchestrated hero entrance; skipped when the visitor prefers reduced motion
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && !reduce) {
    gsap.from('.anim', { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 });
  }
})();
