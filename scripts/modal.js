function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.querySelector('.modal-close');
  const form     = document.getElementById('contact-form');
  const success  = document.querySelector('.modal-success');

  function openModal(pkg = '') {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (pkg) {
      const sel = form.querySelector('[name="budget"]');
      if (sel) sel.value = pkg;
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // All CTA buttons
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.modal);
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Form submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Wird gesendet…';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          if (success) success.style.display = 'block';
        } else {
          btn.textContent = 'Fehler – bitte erneut versuchen';
          btn.disabled = false;
        }
      } catch {
        btn.textContent = 'Fehler – bitte erneut versuchen';
        btn.disabled = false;
      }
    });
  }

  // Newsletter stub
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      nlForm.querySelector('.newsletter-input').value = '';
      const suc = nlForm.nextElementSibling;
      if (suc) { suc.style.display = 'block'; }
    });
  }
}
