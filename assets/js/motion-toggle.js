/*
 * motion-toggle.js — le bouton « Mettre les animations en pause ».
 *
 * Critère WCAG 2.2.2 : un mouvement automatique de plus de 5 s (le halo du
 * Hero, la lumière des réalisations) doit pouvoir être arrêté.
 *  - Pause : retire .has-motion de <html> (le CSS affiche alors tout,
 *    immobile et en couleurs) et prévient les scripts par l'événement
 *    « motionchange ».
 *  - Reprise : remet .has-motion et prévient les scripts.
 *  - Le choix est mémorisé dans ce navigateur (lu par motion-flag.js).
 * Mouvement réduit demandé par le système : le bouton est masqué (CSS).
 */
(function () {
  var buttons = document.querySelectorAll('.motion-toggle');
  if (!buttons.length) return;
  var root = document.documentElement;

  function sync() {
    var paused = !root.classList.contains('has-motion');
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(paused));
      b.setAttribute('aria-label', paused ? 'Relancer les animations' : 'Mettre les animations en pause');
      b.title = b.getAttribute('aria-label');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var pause = root.classList.contains('has-motion');
      root.classList.toggle('has-motion', !pause);
      try { localStorage.setItem('ob-motion', pause ? 'paused' : 'on'); } catch (e) {}
      document.dispatchEvent(new CustomEvent('motionchange'));
      sync();
    });
  });
  sync();
})();
