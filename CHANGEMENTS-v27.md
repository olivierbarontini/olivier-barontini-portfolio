# Version 27 — 24/09/2026

## Réalisations : textes et transparence
- Introduction : « Deux clients qui ne savaient pas encore ce qu'il leur fallait. »
- Élodie : elle ne voyait pas l'intérêt d'un site, a vite changé d'avis.
- ST Création Paysage : demande d'un site ET du référencement, formulée
  poliment, sans vouloir déranger (pas de citation : mots exacts non
  retrouvés). Page du projet mise à jour dans le même sens.
- Mention honnête sous chaque projet (accueil et page détaillée) :
  « Mon premier projet, réalisé pour un proche. » / « Réalisé pour des proches. »
- Pas de témoignages. Rappel : le règlement Google Maps range les liens
  familiaux parmi les conflits d'intérêts : pas d'avis de la famille sur
  la future fiche Google.

## La lampe, version 2 (`lamp.js`, `lamp.css`)
- La souris peint la lumière : ce qui est éclairé le reste.
- À partir d'un tiers éclairé : diffusion automatique (1,5 s).
- Clic : tout s'éclaire depuis le point cliqué (0,6 s), puis la page du
  projet s'ouvre. Déjà éclairée : ouverture immédiate. Ctrl/Cmd + clic et
  clavier : comportement normal d'un lien.
- Sans geste : éclairage complet après 3 s. Au doigt : dès l'arrivée.
- Le curseur affiche « Voir » sur les images (attribut data-cursor).

## Transition vers la page du projet
L'image cliquée devient la couverture de la page du projet
(View Transitions, `base.css`). Navigateurs qui ne la gèrent pas : la page
s'ouvre normalement. Désactivée en mouvement réduit et en pause.

## Bouton pause (WCAG 2.2.2)
`motion-toggle.js` : en haut à droite (desktop), dans la barre du haut
(mobile). Met en pause le halo du Hero, la lampe et les apparitions ;
choix mémorisé dans le navigateur. Masqué si le système demande déjà
moins de mouvement.

## Le fil arrive au bout
Après l'envoi réussi du formulaire, le fil se remplit et le dernier nœud
s'allume (`contact-form.js`, `thread.css`).
