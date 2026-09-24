/*
 * offer-toggle.js — « Services » en titres dépliables, sur mobile.
 *
 * Sur un écran de moins de 900 px, seuls les cinq titres sont visibles ;
 * un toucher sur un titre déplie son texte. Au-dessus de 900 px, ou sans
 * JavaScript, tout reste affiché : rien n'est jamais caché par défaut.
 * Chaque titre devient un vrai bouton (aria-expanded, aria-controls),
 * utilisable au clavier et annoncé par les lecteurs d'écran.
 */
(function () {
  var offer = document.querySelector('.offer');
  if (!offer) return;
  var items = Array.prototype.slice.call(offer.querySelectorAll('.offer-item'));
  var mobile = window.matchMedia('(max-width: 899.98px)');

  var parts = items.map(function (item, i) {
    var h = item.querySelector('h3');
    var p = item.querySelector('p');
    p.id = p.id || 'offre-detail-' + (i + 1);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'offer-toggle';
    btn.setAttribute('aria-controls', p.id);
    var label = document.createElement('span');
    label.textContent = h.textContent;
    var sign = document.createElement('span');
    sign.className = 'faq-sign';
    sign.setAttribute('aria-hidden', 'true');
    btn.appendChild(label);
    btn.appendChild(sign);

    var part = { item: item, h: h, p: p, btn: btn, text: h.textContent };
    btn.addEventListener('click', function () {
      setOpen(part, btn.getAttribute('aria-expanded') !== 'true');
    });
    return part;
  });

  function setOpen(part, open) {
    part.btn.setAttribute('aria-expanded', String(open));
    part.p.hidden = !open;
    part.item.classList.toggle('is-open', open);
  }

  function setMode() {
    var collapse = mobile.matches;
    offer.classList.toggle('is-collapsible', collapse);
    parts.forEach(function (part) {
      if (collapse) {
        if (part.btn.parentNode !== part.h) { part.h.textContent = ''; part.h.appendChild(part.btn); }
        setOpen(part, false);
      } else {
        if (part.btn.parentNode === part.h) part.h.textContent = part.text;
        part.p.hidden = false;
        part.item.classList.remove('is-open');
      }
    });
  }

  mobile.addEventListener('change', setMode);
  setMode();
})();
