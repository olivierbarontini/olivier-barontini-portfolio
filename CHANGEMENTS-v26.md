# Version 26 — 24/09/2026 (essai de la piste A)

## Retiré
- La brise (`brise.css`) : fichier supprimé, liens retirés de toutes les pages.

## Hero : ouverture de la lumière
Le code du Hero n'avait pas changé entre la v24 et la v25. En revanche,
l'ouverture du halo était réglée « par image affichée » : sur un écran à
144 Hz, elle allait plus de deux fois plus vite qu'à 60 Hz, avec un départ
à pleine vitesse.
Désormais (`hero-reveal.js`) :
- 0,7 s de nuit seule, puis 3,4 s d'ouverture ;
- départ lent, fin lente (la lumière naît au lieu de surgir) ;
- même durée sur tous les écrans.
Réglages en tête du fichier : `OPEN_DELAY`, `OPEN_DURATION`, `FOLLOW_TAU`.

## Piste A : la lampe sur les réalisations
Fichiers : `assets/css/lamp.css`, `assets/js/lamp.js`, attribut `data-lamp`
sur les deux images de projets.
1. La capture arrive « de nuit ».
2. Une petite lumière naît sur son bord gauche et se promène.
3. À la souris, le halo s'élargit et suit le pointeur.
4. Quand la souris quitte l'image après l'avoir explorée, ou après
   quelques secondes sans geste, la lumière s'étend à toute l'image,
   qui reste éclairée.
Au doigt : révélation automatique quand l'image arrive au milieu de l'écran.
Mouvement réduit ou sans JavaScript : images en couleurs, rien ne bouge.

Pour retirer l'essai : supprimer `data-lamp` des deux images (ou les deux
lignes `lamp.css` / `lamp.js` dans `index.html`).

## Correction de titre (ST Création Paysage)
« Trouvée sur Google, malgré un homonyme. » devient « Leur entreprise
apparaît désormais sur Google. » : le sujet est nommé, la phrase se lit
seule. L'homonyme reste expliqué juste dessous, dans « Sa demande ».
Même titre sur l'accueil et sur la page du projet.
