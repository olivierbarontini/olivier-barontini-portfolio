# Site d'Olivier Barontini — développeur web

Site statique (HTML, CSS, JavaScript), sans framework ni étape de build.
Déployable tel quel sur Netlify.

## Le concept en une phrase

Un fil doré relie tout : il part de l'image des Moires (Hero), devient la
navigation (le fil sur le bord gauche), et chaque nœud mène à une scène qui
porte **une seule idée**.

## Structure

```
index.html                         accueil : 7 scènes, une idée chacune
projets/<client>/index.html        une étude de cas par client
mentions-legales/  confidentialite/  merci/  404.html
assets/
  css/  tokens.css     couleurs, typo, espaces, mouvement (seule source)
        base.css       reset, focus, boutons, icônes
        thread.css     navigation : fil (desktop) / panneau (mobile)
        hero.css       image révélée par le halo
        scenes.css     mise en page des scènes + pied de page
        method.css     les 4 étapes, une à la fois
        contact.css    formulaire
        pages.css      pages secondaires
        cursor.css     curseur « point de lumière »
  js/   motion-flag.js     autorise ou non les animations (dans le <head>)
        thread-nav.js      progression du fil, nœud actif, panneau mobile
        hero-reveal.js     halo qui suit le pointeur / tourne seul
        scene-reveal.js    apparition des scènes
        method-steps.js    enchaînement des étapes au scroll
        contact-form.js    envoi du formulaire sans rechargement
        cursor.js          curseur lumineux (souris uniquement)
  img/  fonts/
netlify/functions/submission-created.mjs   copie des demandes vers Airtable
_headers   en-têtes de sécurité (CSP stricte)
```

## Règles tenues partout

- **Rien ne dépend de l'effet** : sans JavaScript ou avec « réduire les
  animations », tout le contenu est visible, l'image est entière, les
  étapes sont une simple liste.
- **Le scroll n'est jamais détourné** : les animations suivent le scroll
  natif ; l'aimantation des scènes est en mode `proximity`.
- **Accessibilité** : lien d'évitement, focus visible, noms accessibles sur
  toutes les icônes, contrastes AA, panneau mobile fermable avec Échap.
- **Aucun service tiers au chargement** : police auto-hébergée, aucun
  cookie, aucun traceur (CSP `self` uniquement).

## Invitations vers le formulaire (v21)

- `assets/css/invite.css` et `assets/js/invite.js` : tracé doré des champs à
  l'arrivée du formulaire, pastille « Me contacter » (mobile et tablette),
  mots qui s'allument à la lecture (`<span class="lumen">`, un par
  paragraphe au plus, huit au total : ne pas en ajouter sans raison).
- Le Hero desktop reste sans appel à l'action ; le lien « Me contacter »
  du Hero n'existe que sous 900 px.
- La hiérarchie des boutons du site est écrite en tête de `invite.css`.

## Formulaire → Airtable

1. Netlify Forms enregistre chaque message (détection automatique au
   déploiement). Activer les notifications e-mail dans *Forms > Settings*.
2. `submission-created.mjs` est appelée automatiquement après chaque envoi
   et copie la demande dans Airtable.
3. Créer dans Airtable une table (ex. « Demandes ») avec les colonnes :
   `Nom`, `Email`, `Projet` (choix unique), `Message` (texte long),
   `Reçu le` (date et heure), `Source`, `Statut` (choix unique).
4. Créer un jeton personnel Airtable (droit `data.records:write`, limité à
   cette base), puis ajouter dans Netlify les variables
   `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE`.

Si Airtable échoue, rien n'est perdu : la demande reste dans Netlify Forms.

## Voir aussi `GUIDE.md` (mise en ligne, automatisation, sauvegardes, conformité)

## Reste à faire (marqué `TODO` ou en doré dans les pages)

- Nom de domaine : `canonical`, `og:url`, `robots.txt`, `sitemap.xml`.
- SIRET et adresse de l'hébergeur dans les mentions légales.
- Durée de conservation des données dans la page confidentialité.
- Retirer la ligne Airtable de la page confidentialité si non activé.

## Tester en local

```bash
python3 -m http.server 8000     # puis http://localhost:8000
```
Le formulaire ne s'envoie réellement qu'une fois déployé sur Netlify.
