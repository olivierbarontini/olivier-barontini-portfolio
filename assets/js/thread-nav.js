/*
 * thread-nav.js — le fil de navigation.
 *
 *  - Remplit le fil d'or selon l'avancée dans la page (--progress, 0 → 1).
 *  - Marque le nœud de la scène affichée (aria-current="true").
 *  - Sur mobile, ouvre/ferme le panneau : Échap ferme, le focus revient
 *    au bouton, un clic sur un lien ferme le panneau.
 */
(function () {
  var nav = document.getElementById('thread');
  var toggle = document.querySelector('.thread-toggle');
  var progressBar = document.querySelector('.thread-progress');
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('.thread-list a[href^="#"]'));
  var root = document.documentElement;

  /* ---------- Progression ---------- */
  var ticking = false;
  function updateProgress() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    nav.style.setProperty('--progress', p.toFixed(4));
    if (progressBar) progressBar.style.setProperty('--progress', p.toFixed(4));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Scène active ---------- */
  if ('IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    // Une scène est « active » quand elle traverse le milieu de l'écran.
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ---------- Panneau mobile ---------- */
  if (!toggle) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    var label = toggle.querySelector('.thread-toggle-label');
    if (label) label.textContent = open ? 'Fermer' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && nav.classList.contains('is-open')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Si l'écran repasse en mode « fil vertical » avec le panneau ouvert,
  // on le referme. Même requête que dans thread.css.
  window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').addEventListener('change', function (mq) {
    if (mq.matches) setOpen(false);
  });
})();
