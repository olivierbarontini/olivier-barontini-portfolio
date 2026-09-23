/*
 * motion-flag.js — chargé dans le <head>, AVANT l'affichage.
 * Une seule responsabilité : dire au CSS « les animations sont permises ».
 * Il pose .has-motion sur <html> uniquement si la personne n'a pas demandé
 * de mouvement réduit. Sans ce script (JS bloqué), rien n'est masqué :
 * les images et les textes s'affichent directement.
 */
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) document.documentElement.classList.add('has-motion');
})();
