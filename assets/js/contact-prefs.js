/*
 * contact-prefs.js — le téléphone n'est demandé qu'à qui veut être appelé.
 *
 * Si « Être appelé » est choisi : le bloc téléphone + créneau apparaît, et
 * le numéro devient obligatoire. Sinon : le bloc est masqué et le numéro
 * n'est pas envoyé (on ne collecte pas ce dont on n'a pas besoin).
 * Sans JavaScript : le bloc reste visible et le numéro reste facultatif.
 */
(function () {
  var form = document.querySelector('form[name="contact"]');
  if (!form) return;
  var call = form.querySelector('#call');
  var tel = form.querySelector('#f-tel');
  var radios = form.querySelectorAll('input[name="preference"]');
  if (!call || !tel || !radios.length) return;

  function update() {
    var wantsCall = form.querySelector('input[name="preference"]:checked').value === 'Téléphone';
    call.hidden = !wantsCall;
    tel.required = wantsCall;
    // Masqué = non envoyé : les champs désactivés ne partent pas avec le formulaire.
    call.querySelectorAll('input').forEach(function (el) { el.disabled = !wantsCall; });
    form.classList.toggle('wants-call', wantsCall);
  }

  radios.forEach(function (r) { r.addEventListener('change', update); });
  form.addEventListener('reset', function () { setTimeout(update, 0); });
  update();
})();
