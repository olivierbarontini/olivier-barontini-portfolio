/*
 * contact-form.js — envoi du formulaire sans quitter la page.
 *
 * Amélioration progressive : sans JS, le formulaire s'envoie normalement
 * à Netlify Forms puis affiche /merci/. Avec JS, il s'envoie en arrière-plan
 * et un message s'affiche sur place (zone aria-live, lue par les lecteurs
 * d'écran).
 *
 * La suite (copie vers Airtable) ne se passe PAS ici, dans le navigateur :
 * elle est faite côté serveur par netlify/functions/submission-created.mjs,
 * pour ne jamais exposer de clé d'accès dans le code public.
 */
(function () {
  var form = document.querySelector('form[name="contact"]');
  if (!form || !window.fetch) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  function say(message, kind) {
    status.textContent = message;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    button.disabled = true;
    say('Envoi en cours…');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        say('Merci, votre message est bien arrivé. Je vous réponds sous 3 jours ouvrés.', 'ok');
      })
      .catch(function () {
        say("Le message n'est pas parti. Réessayez, ou écrivez-moi directement à olivier.barontini@gmail.com.", 'error');
      })
      .then(function () { button.disabled = false; });
  });
})();
