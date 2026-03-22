document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
  initSmoothScroll();
  initCursor();
  initThreeHero();
  initGrain();
  initModal();
  initAnimations(); // starts loader, then calls initPageAnimations on complete
});
