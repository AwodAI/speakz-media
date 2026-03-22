function initCursor() {
  if (window.innerWidth <= 768) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  // Ring follows with lerp
  function trackRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(trackRing);
  }
  trackRing();

  // Portfolio card hover — morph to VIEW
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => gsap.set([dot, ring], { opacity: 0 }));
  document.addEventListener('mouseenter', () => gsap.set([dot, ring], { opacity: 1 }));
}
