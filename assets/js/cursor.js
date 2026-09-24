/*
 * cursor.js — remplace le curseur par un point de lumière.
 *
 * Conditions (toutes nécessaires) : une souris, le survol disponible,
 * et le mouvement autorisé (.has-motion). Sinon, rien ne change.
 *  - Le point suit la souris avec une légère souplesse.
 *  - Sur un lien ou un bouton, un anneau apparaît autour du point.
 *  - Sur un élément marqué data-cursor="…", l'anneau s'agrandit et affiche
 *    ce mot (ex. « Voir » sur les réalisations).
 *  - Dans un champ de saisie, le point s'efface pour laisser le curseur texte.
 *  - Quand la souris sort de la fenêtre, le point disparaît.
 */
(function () {
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches || !document.documentElement.classList.contains('has-motion')) return;

  var el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span><span class="cursor-text"></span>';
  var textEl = el.querySelector('.cursor-text');
  document.body.appendChild(el);
  document.documentElement.classList.add('has-cursor');

  var target = { x: -100, y: -100 };
  var pos = { x: -100, y: -100 };
  var rafId = null;
  var CLICKABLE = 'a, button, label, [role="button"], summary';
  var TEXT = 'input, textarea, select';

  function frame() {
    pos.x += (target.x - pos.x) * 0.35;
    pos.y += (target.y - pos.y) * 0.35;
    el.style.setProperty('--cx', pos.x.toFixed(1) + 'px');
    el.style.setProperty('--cy', pos.y.toFixed(1) + 'px');
    // On s'arrête dès que le point a rejoint la souris : aucun calcul à vide.
    if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
    }
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    target.x = e.clientX; target.y = e.clientY;
    el.classList.remove('is-out');
    var t = e.target;
    el.classList.toggle('is-text', !!(t.closest && t.closest(TEXT)));
    el.classList.toggle('is-link', !!(t.closest && t.closest(CLICKABLE)) && !(t.closest && t.closest(TEXT)));
    // Libellé dans l'anneau pour les éléments marqués data-cursor (« Voir »).
    var labeled = t.closest && t.closest('[data-cursor]');
    var label = labeled ? labeled.getAttribute('data-cursor') : '';
    if (textEl.textContent !== label) textEl.textContent = label;
    el.classList.toggle('is-labeled', !!label);
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }, { passive: true });

  document.addEventListener('pointerdown', function () { el.classList.add('is-down'); });
  document.addEventListener('pointerup', function () { el.classList.remove('is-down'); });
  document.documentElement.addEventListener('mouseleave', function () { el.classList.add('is-out'); });
})();
