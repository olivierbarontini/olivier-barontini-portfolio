/*
 * motion-flag.js — chargé dans le <head>, AVANT l'affichage.
 * Une seule responsabilité : dire au CSS « les animations sont permises ».
 * Il pose .has-motion sur <html> sauf si :
 *  - le système demande moins de mouvement (prefers-reduced-motion) ;
 *  - la personne a mis les animations en pause avec le bouton du site
 *    (choix mémorisé dans ce navigateur, voir motion-toggle.js).
 * Sans ce script (JS bloqué), rien n'est masqué : tout s'affiche directement.
 */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = false;
  try { paused = localStorage.getItem('ob-motion') === 'paused'; } catch (e) {}
  if (!reduced && !paused) document.documentElement.classList.add('has-motion');
})();
