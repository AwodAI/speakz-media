document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero reveal
  gsap.from('.cs-tags .cs-tag',   { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out', delay: 0.3 });
  gsap.from('.cs-title',          { y: 60, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.5 });
  gsap.from('.cs-scroll-hint',    { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.9 });

  // Generic reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
    );
  });

  // Result counters
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => gsap.fromTo({ val: 0 }, { val: target }, {
        duration: 1.5, ease: 'power2.out',
        onUpdate: function() {
          el.textContent = prefix + Math.round(this.targets()[0].val) + suffix;
        }
      })
    });
  });

  // Before/After drag slider
  const slider = document.querySelector('.cs-slider-wrap');
  if (slider) {
    const after  = slider.querySelector('.cs-after');
    const handle = slider.querySelector('.cs-drag-handle');
    let dragging = false;

    function setPos(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      if (after)  after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
      if (handle) handle.style.left    = pct + '%';
    }

    slider.addEventListener('mousedown',  (e) => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove',  (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup',    ()  => { dragging = false; });

    // Touch
    slider.addEventListener('touchstart', (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove',  (e) => { if (dragging) setPos(e.touches[0].clientX); },   { passive: true });
    window.addEventListener('touchend',   ()  => { dragging = false; });
  }

  // Header scroll
  window.addEventListener('scroll', () => {
    document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile nav
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Modal
  if (typeof initModal === 'function') initModal();
});
