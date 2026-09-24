/*
 * hero-reveal.js — le halo qui révèle l'image en couleurs.
 *
 * Comportements :
 *  1. Le pointeur (souris ou doigt) déplace le halo.
 *  2. Sans interaction pendant 2,5 s, le halo repart seul, en boucle,
 *     le long de la ligne du fil — il s'arrête dès que la personne bouge.
 *  3. Au chargement, le halo s'ouvre doucement : le seul moment
 *     « orchestré » de la page. L'ouverture est réglée en SECONDES
 *     (OPEN_DELAY, OPEN_DURATION) et non par image affichée : elle a la
 *     même durée sur un écran à 60 Hz et sur un écran à 144 Hz, où elle
 *     était jusqu'ici plus de deux fois plus rapide.
 *  4. Mouvement réduit : le script ne fait rien, l'image reste entière.
 *     Animations en pause (bouton) : image entière, reprise possible.
 *  5. Économie : l'animation s'arrête quand le Hero n'est plus visible
 *     ou quand l'onglet est en arrière-plan.
 *
 * L'effet est décoratif : titre, texte et navigation n'en dépendent jamais.
 */
(function () {
  var hero = document.querySelector('.hero');
  var lit = hero && hero.querySelector('.hero-lit img');
  if (!hero || !lit) return;
  var root = document.documentElement;
  // Mouvement réduit demandé par le système : rien ne s'anime, jamais.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function motionOn() { return root.classList.contains('has-motion'); }

  var IDLE_DELAY = 2500;     // ms avant que le halo reparte seul
  var FOLLOW_TAU = 320;      // ms : souplesse du suivi (plus grand = plus lent)
  var OPEN_DELAY = 900;      // ms : la nuit reste seule un instant
  var OPEN_DURATION = 4200;  // ms : durée de l'ouverture du halo

  // Courbe sinusoïdale : départ et arrivée très progressifs, sans pic de
  // vitesse au milieu. La lumière « naît » : son rayon s'ouvre ET son
  // intensité monte en même temps (--a, opacité de l'image en couleurs),
  // si bien qu'on ne voit jamais un cercle net qui s'agrandit.
  function easeInOut(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

  var target = { x: 0.5, y: 0.6 };
  var pos = { x: 0.5, y: 0.6 };
  var radius = 0;           // rayon courant, en px
  var lastInput = -Infinity;
  var visible = true;
  var rafId = null;
  var start = performance.now();
  var last = start;


  // Rayon cible : plus large sur petit écran, où le doigt masque la vue.
  function targetRadius() {
    var base = Math.min(window.innerWidth, window.innerHeight);
    return window.innerWidth < 900 ? base * 0.72 : base * 0.56;
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
    if (!motionOn()) return;
    if (!visible || document.hidden) { last = now; return; }
    var dt = Math.min(100, now - last);   // borne : retour d'onglet sans saut
    last = now;
    var k = 1 - Math.exp(-dt / FOLLOW_TAU);

    if (now - lastInput > IDLE_DELAY) {
      var p = idlePath(now - start);
      target.x = p.x; target.y = p.y;
    }
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    var open = Math.min(1, Math.max(0, (now - start - OPEN_DELAY) / OPEN_DURATION));
    var e = easeInOut(open);
    radius = targetRadius() * (0.35 + 0.65 * e);
    lit.style.setProperty('--a', Math.min(1, e * 1.15).toFixed(3));

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

  // Démarrage, et bouton pause (motion-toggle.js) : en pause, l'image
  // s'affiche entière ; à la reprise, la lumière renaît depuis la nuit.
  function activate() {
    hero.classList.add('is-live');
    start = last = performance.now();
    lastInput = -Infinity;
    run();
  }
  function deactivate() { hero.classList.remove('is-live'); }
  document.addEventListener('motionchange', function () { if (motionOn()) activate(); else deactivate(); });
  if (motionOn()) activate();
})();
