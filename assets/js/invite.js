/*
 * invite.js — ce qui mène au formulaire (voir invite.css).
 *
 *  A. Quand le formulaire arrive à l'écran : .is-arrived (une seule fois).
 *  B. Pastille « Me contacter » : visible dès la section Réalisations,
 *     masquée dès que la section Contact est à l'écran.
 *  C. Mots .lumen : s'allument en croisant le milieu de l'écran, et restent
 *     allumés.
 * Sans IntersectionObserver ou en mouvement réduit : tout reste visible
 * et statique (la pastille reste simplement absente).
 */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var motion = document.documentElement.classList.contains('has-motion');

  /* ---------- A ---------- */
  var form = document.querySelector('form[name="contact"]');
  if (form && motion) {
    form.querySelectorAll('.field input:not([type="radio"]):not([type="checkbox"]), .field textarea')
      .forEach(function (el, i) { el.style.setProperty('--i', i); });
    var fo = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      form.classList.add('is-arrived');
      fo.disconnect();
    }, { threshold: 0.35 });
    fo.observe(form);
  }

  /* ---------- B ---------- */
  var invite = document.querySelector('.invite');
  var start = document.getElementById('realisations');
  var contact = document.getElementById('contact');
  if (invite && start && contact) {
    var pastStart = false, contactVisible = false;
    function render() { invite.classList.toggle('is-shown', pastStart && !contactVisible); }

    // « Passé le début » : le haut de la section Réalisations est au-dessus
    // du bas de l'écran.
    new IntersectionObserver(function (entries) {
      var r = entries[0].boundingClientRect;
      pastStart = entries[0].isIntersecting || r.top < 0;
      render();
    }).observe(start);

    new IntersectionObserver(function (entries) {
      contactVisible = entries[0].isIntersecting;
      render();
    }, { rootMargin: '0px 0px -25% 0px' }).observe(contact);
  }

  /* ---------- C ---------- */
  if (motion) {
    var words = document.querySelectorAll('.lumen');
    var lo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-lit');
        lo.unobserve(e.target);
      });
    }, { rootMargin: '-38% 0px -38% 0px' });
    words.forEach(function (w) { lo.observe(w); });
  }
})();
