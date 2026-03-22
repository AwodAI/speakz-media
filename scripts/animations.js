function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // ── Loader ───────────────────────────────────────
  const loaderS = document.querySelector('.loader-s');
  const loaderM = document.querySelector('.loader-m');
  const loader  = document.getElementById('loader');

  gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0, duration: 0.4,
        onComplete: () => {
          loader.style.display = 'none';
          document.body.classList.remove('loading');
          initPageAnimations();
        }
      });
    }
  })
  .to([loaderS, loaderM], { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 })
  .to('.loader-letters', { scale: 1.05, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }, '+=0.1')
  .to('.loader-letters', { filter: 'drop-shadow(0 0 30px #00F5D4)', duration: 0.2 }, '-=0.2');
}

function initPageAnimations() {

  // ── Typing animation ─────────────────────────────
  const typingEl = document.querySelector('.hero-typing');
  if (typingEl) {
    const texts = ['Websites', 'Landingpages', 'Web Apps', 'Online-Shops'];
    let idx = 0, charIdx = 0, deleting = false;
    function type() {
      const t = texts[idx];
      if (!deleting) {
        typingEl.textContent = t.slice(0, ++charIdx);
        if (charIdx === t.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        typingEl.textContent = t.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 800);
  }

  // ── Hero text reveal ─────────────────────────────
  gsap.from('.hero-headline .line-1', { y: 60, opacity: 0, duration: 1,   ease: 'expo.out', delay: 0.1 });
  gsap.from('.hero-headline .line-2', { y: 60, opacity: 0, duration: 1,   ease: 'expo.out', delay: 0.25 });
  gsap.from('.hero-sub',              { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.45 });
  gsap.from('.hero-ctas',             { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.6 });
  gsap.from('.hero-scroll',           { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', delay: 0.8 });

  // ── Hero scroll-hijack (GSAP pin — no CSS spacer needed) ──
  if (window.innerWidth > 768) {
    const heroContent = document.querySelector('.hero-content');

    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: '+=150%',
      pin: true,
      anticipatePin: 1,
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        if (window._heroExplode) window._heroExplode(p);
        if (heroContent) {
          gsap.set(heroContent, { opacity: Math.max(0, 1 - p * 2.5), y: -p * 30 });
        }
      }
    });
  }

  // ── Stat bar counters ────────────────────────────
  initCounters();

  // ── Manifesto word reveal ────────────────────────
  const manifesto = document.querySelector('.manifesto-headline');
  if (manifesto) {
    if (window.SplitType) {
      const split = new SplitType(manifesto, { types: 'words' });
      split.words.forEach(w => w.classList.add('word'));
      const words = manifesto.querySelectorAll('.word');

      // Set initial state explicitly so GSAP scrub works in both directions
      gsap.set(words, {
        color: '#c8c0b4',
        opacity: 0.35,
        filter: 'blur(4px)'
      });

      gsap.to(words, {
        color: '#0A0A0A',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: manifesto,
          start: 'top 65%',
          end: 'bottom 45%',
          scrub: 1.2
        }
      });
    } else {
      ScrollTrigger.create({
        trigger: manifesto, start: 'top 70%',
        onEnter: () => gsap.to(manifesto, { color: '#0A0A0A', opacity: 1, duration: 0.8 })
      });
    }
  }

  // ── Services horizontal scroll (pure GSAP pin) ───
  const servicesInner = document.querySelector('.services-sticky');
  const servicesTrack = document.querySelector('.services-track');
  const progressFill  = document.querySelector('.services-progress-fill');

  if (servicesTrack && servicesInner && window.innerWidth > 768) {
    // Calculate how far the track needs to scroll
    const getScrollDistance = () =>
      servicesTrack.scrollWidth - servicesInner.offsetWidth + parseFloat(getComputedStyle(servicesTrack).paddingLeft || 0) * 2;

    ScrollTrigger.create({
      trigger: '#services',
      start: 'top top',
      end: () => '+=' + (getScrollDistance() * 1.3),
      pin: servicesInner,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const dist = getScrollDistance();
        gsap.set(servicesTrack, { x: -dist * self.progress });
        if (progressFill) progressFill.style.width = (self.progress * 100) + '%';
      }
    });
  }

  // ── Portfolio: Before/After mousemove ────────────
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const afterImg = card.querySelector('.ba-after-img');
    const divider  = card.querySelector('.ba-divider');
    let rect = null;

    // Cache rect on enter — much cheaper than recalculating every mousemove
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      if (afterImg) afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
      if (divider)  divider.style.left = pct + '%';
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      if (afterImg) afterImg.style.clipPath = 'inset(0 0 0 50%)';
      if (divider)  divider.style.left = '50%';
    });
  });

  // ── Process steps ────────────────────────────────
  const steps = document.querySelectorAll('.process-step');
  const processList = document.querySelector('.process-list');
  if (steps.length && processList) {
    let clickedStep = null;

    const activateStep = (step) => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    };

    // Determine active step purely from scroll position
    const updateFromScroll = () => {
      if (clickedStep) return;
      const threshold = window.innerHeight * 0.6;
      let active = steps[0];
      steps.forEach(step => {
        if (step.getBoundingClientRect().top < threshold) active = step;
      });
      activateStep(active);
    };

    // Initial state
    activateStep(steps[0]);

    // Click: toggle — clicking active step releases scroll control
    steps.forEach(step => {
      step.addEventListener('click', () => {
        if (clickedStep === step) {
          clickedStep = null;
          updateFromScroll();
        } else {
          clickedStep = step;
          activateStep(step);
        }
      });
    });

    // Smooth scroll-driven updates in both directions
    window.addEventListener('scroll', updateFromScroll, { passive: true });
  }

  // ── Testimonial carousel ─────────────────────────
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.testimonial-dot');
  let current = 0;

  function showSlide(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  if (slides.length > 1) setInterval(() => showSlide((current + 1) % slides.length), 5000);
  showSlide(0);

  // ── Reveal animations (generic) ──────────────────
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // ── Header scroll state ──────────────────────────
  window.addEventListener('scroll', () => {
    document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── Mobile hamburger ─────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Service accordion ────────────────────────────
  document.querySelectorAll('.service-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const accordion = btn.nextElementSibling;
      if (!accordion) return;
      const isOpen = accordion.classList.toggle('open');
      btn.textContent = isOpen ? 'Weniger ↑' : 'Mehr erfahren →';
    });
  });
}
