function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: target },
          {
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              const v = this.targets()[0].val;
              el.textContent = prefix + (Number.isInteger(target) ? Math.round(v) : v.toFixed(1)) + suffix;
            }
          }
        );
      }
    });
  });
}
