/*
 * lamp.js — met en lumière les captures des réalisations (voir lamp.css).
 *
 * Pour chaque lien-image marqué [data-lamp] :
 *  1. Hors écran : de nuit, rien ne bouge.
 *  2. À l'écran : une petite lumière naît sur le bord gauche (là d'où vient
 *     le fil du Hero) et se promène.
 *  3. Souris : la lumière suit le pointeur et PEINT l'image. Ce qui a été
 *     éclairé reste éclairé.
 *  4. Dès que DIFFUSE_AT de l'image est éclairée, la lumière se diffuse
 *     seule dans le reste.
 *  5. Sans geste pendant IDLE_REVEAL, ou au doigt : l'image s'éclaire seule.
 *  L'image n'est pas un lien : le lien « Lire le projet en détail » suffit,
 *  et un clic ne doit pas interrompre la lumière.
 *
 *  Douceur : tout est flou et progressif. Le pinceau est large et léger
 *  (plusieurs passages s'additionnent), la diffusion finale ne trace pas
 *  de bord net : c'est une lueur qui s'élargit ET un voile de lumière qui
 *  monte sur toute l'image en même temps.
 *
 * Durées en millisecondes, identiques sur tous les écrans.
 * Mouvement réduit : le script ne fait rien (images en couleurs).
 * Animations mises en pause (bouton, événement « motionchange ») : l'image
 * est éclairée d'un coup et le script s'arrête.
 */
(function () {
  var root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!root.classList.contains('has-motion')) return;
  if (!('IntersectionObserver' in window)) return;
  var frames = document.querySelectorAll('[data-lamp]');
  if (!frames.length) return;

  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var BIRTH_DELAY = 700;       // la capture finit de se dévoiler
  var BIRTH_DURATION = 1100;   // la petite lumière naît
  var IDLE_REVEAL = 3000;      // sans geste : éclairage complet
  var DIFFUSE_AT = 0.28;       // part éclairée qui déclenche la diffusion
  var DIFFUSE_DURATION = 2400;
  var IDLE_DURATION = 2800;
  var TOUCH_DURATION = 2400;
  var FOLLOW_TAU = 150;        // souplesse du suivi de la souris
  var PAINT_R = 0.22;          // rayon du pinceau (part de la largeur)
  var PAINT_ALPHA = 0.1;       // intensité d'un passage (ils s'additionnent)
  var HEAD_SMALL = 0.08;       // petite lumière qui se promène
  var HEAD_BIG = 0.26;         // halo sous la souris
  var MASK_W = 320;            // résolution du masque (il est flou : inutile d'aller plus haut)

  // Courbe sinusoïdale : accélération et freinage très progressifs.
  function easeInOut(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
  function motionOn() { return root.classList.contains('has-motion'); }

  frames.forEach(function (frame) {
    var base = frame.querySelector('picture');
    var img = base && base.querySelector('img');
    if (!img) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'lamp-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    frame.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var mask = document.createElement('canvas');
    var mctx = mask.getContext('2d');
    var probe = document.createElement('canvas');
    probe.width = 32; probe.height = 20;
    var pctx = probe.getContext('2d', { willReadFrequently: true });

    frame.classList.add('is-lamp');

    var s = {
      phase: 'dormant',             // dormant → alive → revealing → done
      bornAt: 0, lastInput: 0,
      pos: { x: 0.0, y: 0.55 }, target: { x: 0.0, y: 0.55 },
      headR: 0, hover: false, lastPaint: null,
      reveal: null,                 // { x, y, start, dur, q }
      coverAt: 0, visible: false, last: 0, raf: null
    };

    /* ---------- Tailles ---------- */
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = frame.clientWidth, h = frame.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      var mh = Math.round(MASK_W * h / w);
      if (mask.width !== MASK_W || mask.height !== mh) {
        // On garde ce qui était déjà éclairé, remis à l'échelle.
        var old = document.createElement('canvas');
        old.width = mask.width; old.height = mask.height;
        if (old.width && old.height) old.getContext('2d').drawImage(mask, 0, 0);
        mask.width = MASK_W; mask.height = mh;
        if (old.width && old.height) mctx.drawImage(old, 0, 0, MASK_W, mh);
      }
    }

    /* ---------- Dessin ---------- */
    // Une touche de lumière dans le masque (coordonnées de 0 à 1).
    function stamp(x, y, r, alpha) {
      var cx = x * mask.width, cy = y * mask.height, cr = r * mask.width;
      var g = mctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      g.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
      g.addColorStop(.3, 'rgba(255,255,255,' + (alpha * .75) + ')');
      g.addColorStop(.65, 'rgba(255,255,255,' + (alpha * .3) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      mctx.fillStyle = g;
      mctx.beginPath(); mctx.arc(cx, cy, cr, 0, Math.PI * 2); mctx.fill();
    }

    // Trait de pinceau continu entre deux positions de la souris.
    function paintTo(p) {
      var from = s.lastPaint || p;
      var dx = p.x - from.x, dy = (p.y - from.y) * mask.height / mask.width;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var steps = Math.max(1, Math.ceil(dist / (PAINT_R * 0.25)));
      for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        stamp(from.x + (p.x - from.x) * t, from.y + (p.y - from.y) * t, PAINT_R, PAINT_ALPHA);
      }
      s.lastPaint = { x: p.x, y: p.y };
    }

    function drawCover(c, W, H) {
      var nw = img.naturalWidth, nh = img.naturalHeight;
      if (!nw || !nh) return;
      var k = Math.max(W / nw, H / nh), dw = nw * k, dh = nh * k;
      c.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }

    // Lueur très douce : pas de cœur dur, un bord qui se perd.
    function glow(x, y, rad, a) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      g.addColorStop(.4, 'rgba(255,255,255,' + (a * .6) + ')');
      g.addColorStop(.75, 'rgba(255,255,255,' + (a * .18) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }

    function render() {
      var W = canvas.width, H = canvas.height;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(mask, 0, 0, W, H);
      if (s.headR > 0.5) glow(s.pos.x * W, s.pos.y * H, s.headR, .85);
      if (s.reveal) {
        // Diffusion : une lueur qui s'élargit depuis l'origine...
        var r = s.reveal, q = r.q || 0;
        var far = Math.sqrt(W * W + H * H);
        glow(r.x * W, r.y * H, far * (0.25 + 1.6 * q), 1);
        // ... et un voile de lumière qui monte partout à la fois.
        ctx.fillStyle = 'rgba(255,255,255,' + (q * q).toFixed(3) + ')';
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = 'source-in';
      drawCover(ctx, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Part de l'image déjà éclairée (0 à 1), mesurée sur un masque réduit.
    function coverage() {
      pctx.clearRect(0, 0, 32, 20);
      pctx.drawImage(mask, 0, 0, 32, 20);
      var d = pctx.getImageData(0, 0, 32, 20).data, sum = 0;
      for (var i = 3; i < d.length; i += 4) sum += d[i];
      return sum / (255 * 32 * 20);
    }

    /* ---------- Révélation complète ---------- */
    function startReveal(x, y, dur) {
      if (s.phase !== 'alive') return;
      s.phase = 'revealing';
      s.reveal = { x: x, y: y, start: performance.now(), dur: dur, q: 0 };
      run();
    }

    function finish() {
      s.phase = 'done';
      s.reveal = null;
      frame.classList.add('is-revealed');
    }

    /* ---------- Boucle ---------- */
    function wander(t) {
      var u = t / 5200;
      return { x: 0.5 - Math.cos(u) * 0.42, y: 0.55 + Math.sin(u * 2.1) * 0.16 };
    }

    function step(now) {
      s.raf = null;
      if (s.phase === 'done' || s.phase === 'dormant') return;
      if (!motionOn()) { frame.classList.add('is-revealed'); s.phase = 'done'; return; }
      if (!s.visible || document.hidden) { s.last = now; return; }
      var dt = Math.min(100, now - (s.last || now));
      s.last = now;
      var W = canvas.width;
      var t = now - s.bornAt;

      if (s.phase === 'alive') {
        var born = easeInOut(clamp01((t - BIRTH_DELAY) / BIRTH_DURATION));
        if (!s.hover) {
          var p = wander(Math.max(0, t - BIRTH_DELAY));
          s.target.x = p.x; s.target.y = p.y;
        }
        var k = 1 - Math.exp(-dt / (s.hover ? FOLLOW_TAU : 260));
        s.pos.x += (s.target.x - s.pos.x) * k;
        s.pos.y += (s.target.y - s.pos.y) * k;

        var want = (s.hover ? HEAD_BIG : HEAD_SMALL) * W * born;
        s.headR += (want - s.headR) * (1 - Math.exp(-dt / 180));

        if (s.hover) {
          paintTo(s.pos);
          if (now - s.coverAt > 250) {
            s.coverAt = now;
            if (coverage() >= DIFFUSE_AT) startReveal(s.pos.x, s.pos.y, DIFFUSE_DURATION);
          }
        } else if (canHover) {
          var quiet = now - Math.max(s.lastInput, s.bornAt + BIRTH_DELAY + BIRTH_DURATION);
          if (quiet > IDLE_REVEAL) startReveal(s.pos.x, s.pos.y, IDLE_DURATION);
        } else if (t > 500) {
          startReveal(0, 0.55, TOUCH_DURATION);
        }
      }

      if (s.phase === 'revealing') {
        var r = s.reveal;
        r.q = easeInOut(clamp01((now - r.start) / r.dur));
        s.headR *= 1 - clamp01(dt / 600);
        if (r.q >= 1) { render(); finish(); return; }
      }

      render();
      run();
    }

    function run() { if (s.raf === null) s.raf = requestAnimationFrame(step); }

    /* ---------- Gestes ---------- */
    function local(e) {
      var rect = frame.getBoundingClientRect();
      return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    }

    if (canHover) {
      frame.addEventListener('pointermove', function (e) {
        if (s.phase !== 'alive') return;
        var p = local(e);
        s.target.x = p.x; s.target.y = p.y;
        s.lastInput = performance.now();
        if (!s.hover) { s.hover = true; s.lastPaint = null; }
      }, { passive: true });
      frame.addEventListener('pointerleave', function () {
        s.hover = false; s.lastPaint = null;
        s.lastInput = performance.now();
      });
    }

    /* ---------- Démarrage ---------- */
    function begin() {
      resize();
      if (window.ResizeObserver) new ResizeObserver(function () { resize(); render(); }).observe(frame);
      new IntersectionObserver(function (entries) {
        s.visible = entries[0].isIntersecting;
        if (s.visible && s.phase === 'dormant') {
          s.phase = 'alive';
          s.bornAt = performance.now();
        }
        if (s.visible) run();
      }, { threshold: canHover ? 0.45 : 0.6 }).observe(frame);
    }
    if (img.complete && img.naturalWidth) begin();
    else img.addEventListener('load', begin, { once: true });

    document.addEventListener('visibilitychange', function () { if (!document.hidden) run(); });
    document.addEventListener('motionchange', function () {
      if (!motionOn() && s.phase !== 'done') { s.phase = 'done'; frame.classList.add('is-revealed'); }
    });
    // Retour arrière vers l'accueil (cache du navigateur) : l'image reste éclairée.
    window.addEventListener('pageshow', function (e) {
      if (e.persisted && s.phase !== 'done') { s.phase = 'done'; frame.classList.add('is-revealed'); }
    });
  });
})();
