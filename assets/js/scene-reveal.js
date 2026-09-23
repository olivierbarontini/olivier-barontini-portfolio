/*
 * scene-reveal.js — révèle chaque scène quand elle arrive à l'écran.
 * Ajoute .is-in (une seule fois) ; le CSS se charge du reste (scenes.css).
 * N'a d'effet que si .has-motion est présent (voir motion-flag.js).
 */
(function () {
  var scenes = document.querySelectorAll('[data-reveal]');
  if (!scenes.length) return;

  // Navigateur trop ancien : on montre tout, sans animation.
  if (!('IntersectionObserver' in window)) {
    scenes.forEach(function (s) { s.classList.add('is-in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  scenes.forEach(function (s) { observer.observe(s); });
})();
