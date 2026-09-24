# Version 25 — 24/09/2026

## Rédaction : une seule voix, des sections explicites

Règle appliquée partout : c'est Olivier qui parle (« je »), au client (« vous »).
Chaque section suit le même modèle : étiquette (le nom de la section, le même
que dans la navigation), titre qui dit ce que la section contient, puis au
besoin une phrase d'introduction.

| Section | Avant | Après |
|---|---|---|
| Hero | « Je construis des sites qui racontent quelque chose. » | « Je crée des sites qui racontent votre activité. » + pour qui je travaille |
| Services | Titres de formes différentes (« Des sites sur mesure. », « Être trouvé. ») | Cinq verbes à l'infinitif, tous « ce que je fais pour vous » |
| Réalisations | Projets sans introduction, titre « Trouvée sur Google depuis juillet. » | Introduction « Deux sites que j'ai conçus et mis en ligne. », puis pour chaque projet : pour qui, le résultat en grand, et trois lignes « Sa demande / Ce que j'ai fait / Le résultat » |
| Méthode | « Ma façon de travailler. » | « Comment se passe un projet. », chaque étape commence par « Je » |
| Parcours | « Formé au code, épaulé par l'IA. » | « D'éducateur à développeur. » |
| Questions | Doublon « Et après la mise en ligne ? » / maintenance | Fusionnés (page et données structurées) |
| Formulaire | Choix « Gagner du temps » | Choix repris des Services : « Un site », « Être visible sur Google », « Automatiser une tâche », « Je ne sais pas encore » |

Navigation : 7 entrées au lieu de 8 (Accueil, Services, Réalisations, Méthode,
Parcours, Questions, Contact). Les deux projets sont regroupés sous
« Réalisations ».

## Design

- **Moins d'or.** L'or reste au fil de navigation et aux étiquettes. Les mots
  mis en valeur (`.lumen`) passent du gris au blanc, sans or.
- **Formulaire** : panneau de fond (`--panel`) sans bordure, champs en creux,
  choix rectangulaires neutres, bouton d'envoi clair et net, sans lueur.
  Angles à 2 px partout (`--radius`) au lieu des pastilles arrondies.
- **Scroll du contact** : la section n'est plus aimantée, le formulaire est
  plus compact et tient dans un écran de bureau, y compris en 27 pouces.
- **Navigation desktop** : au survol du fil, tout le sommaire apparaît
  (texte posé sur un voile, sans bulles) ; la section en cours est marquée.
  reflet sur l'eau, descend l'écran toutes les 22 s et éclaircit le fond et
  le texte courant. Elle passe sous le Hero, les images, les titres et le
  formulaire. Désactivée en mouvement réduit.

## Choix non retenu

Déformation ou effet loupe sur le texte : écarté. Un mot qui bouge pendant
qu'on le lit fait perdre la ligne, et c'est un problème d'accessibilité
(critère WCAG 2.2.2 sur le contenu en mouvement). La brise éclaircit sans
déplacer une seule lettre.

## À vérifier par Olivier

- La phrase du Hero sur « les indépendants et les petites entreprises » :
  à garder seulement si elle correspond à la clientèle visée.
- Les chiffres des projets sont ceux de la version 24, non modifiés.
- Tester la brise sur un vrai téléphone (fluidité, batterie).
