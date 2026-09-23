/*
 * method-steps.js — les étapes de la méthode, une à la fois.
 *
 * Active le mode « enchaîné » (.is-sequenced, voir method.css) seulement
 * sur grand écran et si le mouvement est autorisé. L'étape affichée est
 * calculée à partir de la position de scroll dans la section : c'est le
 * scroll natif qui fait avancer, on ne le bloque ni ne le détourne jamais.
 */
(function () {
  var section = document.querySelector('.method');
  if (!section) return;
  var steps = section.querySelectorAll('.step');
  var meter = section.querySelectorAll('.step-meter button');
  var desktop = window.matchMedia('(min-width: 900px)');
  var motion = document.documentElement.classList.contains('has-motion');
  var ticking = false;

  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    var p = travel > 0 ? Math.min(0.9999, Math.max(0, -rect.top / travel)) : 0;
    var current = Math.floor(p * steps.length);

    steps.forEach(function (s, i) { s.classList.toggle('is-current', i === current); });
    meter.forEach(function (m, i) {
      m.classList.toggle('is-done', i <= current);
      if (i === current) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function setMode() {
    var on = motion && desktop.matches;
    section.classList.toggle('is-sequenced', on);
    window.removeEventListener('scroll', onScroll);
    if (on) {
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    }
  }

  // Clic sur un segment : on fait défiler la page jusqu'au milieu de la
  // portion de piste de cette étape (scroll normal, rien n'est bloqué).
  meter.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      var travel = section.offsetHeight - window.innerHeight;
      var y = section.offsetTop + travel * ((i + 0.5) / steps.length);
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  desktop.addEventListener('change', setMode);
  setMode();
})();
