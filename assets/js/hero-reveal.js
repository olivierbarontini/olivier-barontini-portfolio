/*
 * hero-reveal.js — le halo qui révèle l'image en couleurs.
 *
 * Comportements :
 *  1. Le pointeur (souris ou doigt) déplace le halo.
 *  2. Sans interaction pendant 2,5 s, le halo repart seul, en boucle,
 *     le long de la ligne du fil — il s'arrête dès que la personne bouge.
 *  3. Au chargement, le halo s'ouvre doucement : le seul moment
 *     « orchestré » de la page.
 *  4. Mouvement réduit : le script ne fait rien, l'image reste entière.
 *  5. Économie : l'animation s'arrête quand le Hero n'est plus visible
 *     ou quand l'onglet est en arrière-plan.
 *
 * L'effet est décoratif : titre, texte et navigation n'en dépendent jamais.
 */
(function () {
  var hero = document.querySelector('.hero');
  var lit = hero && hero.querySelector('.hero-lit img');
  if (!hero || !lit) return;
  if (!document.documentElement.classList.contains('has-motion')) return;

  var IDLE_DELAY = 2500;   // ms avant que le halo reparte seul
  var FOLLOW = 0.08;       // souplesse du suivi (plus petit = plus lent)

  var target = { x: 0.5, y: 0.6 };
  var pos = { x: 0.5, y: 0.6 };
  var radius = 0;           // rayon courant, en px
  var lastInput = -Infinity;
  var visible = true;
  var rafId = null;
  var start = performance.now();

  hero.classList.add('is-live');

  // Rayon cible : plus large sur petit écran, où le doigt masque la vue.
  function targetRadius() {
    var base = Math.min(window.innerWidth, window.innerHeight);
    return window.innerWidth < 900 ? base * 0.62 : base * 0.46;
  }

  // Coordonnées relatives à l'image (et non au Hero) : sur mobile,
  // l'image n'occupe que le bas du Hero.
  function onPointer(e) {
    var rect = lit.getBoundingClientRect();
    target.x = (e.clientX - rect.left) / rect.width;
    target.y = (e.clientY - rect.top) / rect.height;
    lastInput = performance.now();
  }

  // Trajet automatique : une boucle lente, en forme de huit allongé,
  // centrée sur la bande où court le fil dans l'image.
  // Hauteur du fil dans le cadre : 0,6 par défaut, autre valeur sur mobile
  // (variable CSS --halo-y posée dans hero.css).
  function haloY() {
    var v = parseFloat(getComputedStyle(lit).getPropertyValue('--halo-y'));
    return isNaN(v) ? 0.6 : v;
  }
  function idlePath(t) {
    var s = t / 5200;
    return { x: 0.5 + Math.sin(s) * 0.36, y: haloY() + Math.sin(s * 2) * 0.07 };
  }

  function frame(now) {
    rafId = null;
    if (!visible || document.hidden) return;

    if (now - lastInput > IDLE_DELAY) {
      var p = idlePath(now - start);
      target.x = p.x; target.y = p.y;
    }
    pos.x += (target.x - pos.x) * FOLLOW;
    pos.y += (target.y - pos.y) * FOLLOW;
    radius += (targetRadius() - radius) * 0.03;   // ouverture progressive

    lit.style.setProperty('--x', (pos.x * 100).toFixed(2) + '%');
    lit.style.setProperty('--y', (pos.y * 100).toFixed(2) + '%');
    lit.style.setProperty('--r', radius.toFixed(1) + 'px');

    rafId = requestAnimationFrame(frame);
  }

  function run() { if (rafId === null) rafId = requestAnimationFrame(frame); }

  hero.addEventListener('pointermove', onPointer, { passive: true });
  hero.addEventListener('pointerdown', onPointer, { passive: true });

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) run();
  }).observe(hero);

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) run();
  });

  run();
})();
