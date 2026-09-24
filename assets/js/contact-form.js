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

    var wantsCall = form.classList.contains('wants-call');
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
        // Le fil arrive au bout : il se remplit et le dernier nœud s'allume.
        var thread = document.getElementById('thread');
        var bar = document.querySelector('.thread-progress');
        if (thread) thread.classList.add('is-complete');
        if (bar) bar.classList.add('is-complete');
        say(wantsCall
          ? 'Merci, votre demande est bien arrivée. Je vous appelle sous 3 jours ouvrés.'
          : 'Merci, votre demande est bien arrivée. Je vous réponds sous 3 jours ouvrés.', 'ok');
      })
      .catch(function () {
        say("Le message n'est pas parti. Réessayez, ou écrivez-moi directement à olivier.barontini@gmail.com.", 'error');
      })
      .then(function () { button.disabled = false; });
  });
})();
