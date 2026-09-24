# Version 28 — 24/09/2026

## Texte
Page du projet d'Élodie : « Élodie s'en est d'abord servie » devient
« Élodie a d'abord utilisé son site ». La forme d'origine était correcte,
la nouvelle évite simplement le doute à la lecture.

## Réalisations
- L'image n'est plus un lien, ni le curseur « Voir » : un clic
  n'interrompt plus la lumière. Le lien « Lire le projet en détail »
  reste le seul chemin vers la page du projet (la transition de l'image
  vers la couverture fonctionne toujours par ce lien).
- Lumière plus douce et plus diffuse (`lamp.js`) :
  - pinceau plus large et plus léger (les passages s'additionnent) ;
  - halo sous la souris sans cœur dur, suivi plus souple ;
  - diffusion finale sans bord net : une lueur qui s'élargit et un voile
    de lumière qui monte sur toute l'image, en 2,4 s (2,8 s sans geste) ;
  - courbe sinusoïdale (pas de pic de vitesse) ;
  - fin sans « flash » sombre.

## Hero (`hero-reveal.js`, `hero.css`)
- 0,9 s de nuit, puis 4,2 s d'ouverture, courbe sinusoïdale.
- Le rayon ET l'intensité montent ensemble : on ne voit plus un cercle
  net qui s'agrandit, la lumière se lève.
- Bord du halo plus progressif, halo un peu plus large pour compenser.
- Suivi du pointeur plus souple.
Réglages en tête de `hero-reveal.js` : OPEN_DELAY, OPEN_DURATION, FOLLOW_TAU.
