# À compléter avant publication

Tout ce qui reste à remplir est repéré de deux façons :

- dans les pages, par du texte **en doré** (classe CSS `todo`) ;
- dans le code, par un commentaire commençant par `TODO(Olivier)`.

Pour retrouver tous les emplacements d'un coup dans VS Code : `Ctrl + Maj + F`,
puis chercher `todo` (les pages) et `TODO(` (le code).

---

## 1. Identité de l'entreprise — après l'immatriculation

| Où | Quoi |
|---|---|
| Pied de page, toutes les pages | SIREN |
| `mentions-legales/index.html` | Adresse, SIREN, SIRET, code APE, téléphone |
| `mentions-legales/index.html` | Mention TVA : à retirer si vous devenez assujetti |
| `confidentialite/index.html` | Adresse du responsable du traitement |
| `cgv/index.html`, section 1 | Mêmes coordonnées que les mentions légales |

Le pied de page est recopié dans chaque fichier HTML : il faut le modifier
partout (`index.html`, `404.html`, `cgv/`, `confidentialite/`,
`mentions-legales/`, `merci/`, les deux pages de `projets/`).

## 2. Hébergeur

| Où | Quoi |
|---|---|
| `mentions-legales/index.html` | Adresse postale et téléphone de Netlify, à recopier depuis netlify.com |

## 3. Données personnelles

| Où | Quoi |
|---|---|
| `confidentialite/index.html` | Garantie de transfert annoncée par Netlify et par Airtable (terme exact) |
| `confidentialite/index.html` | Durée de conservation : trois ans par défaut, à ajuster |
| `confidentialite/index.html` | Retirer la ligne Airtable si la copie automatique n'est pas activée |

## 4. Conditions de prestation

`cgv/index.html` est un squelette : douze sections, toutes à rédiger. À faire
avant la première prestation facturée. Deux points à ne pas oublier :

- le médiateur de la consommation, obligatoire dès la première facture à un
  particulier (section 10) ;
- le droit de rétractation de quatorze jours pour les contrats conclus à
  distance avec un particulier (section 9).

## 5. Domaine et référencement

| Où | Quoi |
|---|---|
| `robots.txt` | Remplacer `VOTRE-DOMAINE.fr` |
| `sitemap.xml` | Remplacer `VOTRE-DOMAINE.fr` (six adresses) |
| En-tête de chaque page | Ajouter `<link rel="canonical">` et `og:url` |

## 6. Photo du portrait

Quand vous aurez une photo professionnelle :

1. Format 4:5, idéalement 720 × 900 px, en WebP, sous 150 ko.
2. L'enregistrer sous le même nom : `assets/img/portrait.webp`.
3. Rien d'autre à changer, sauf le texte alternatif dans `index.html`
   (repéré par le commentaire « PHOTO À REMPLACER ») si le cadrage change.

Pour convertir une image en WebP sans logiciel : squoosh.app, qui fonctionne
dans le navigateur et n'envoie rien sur Internet.

## 7. Contenus à tenir à jour

| Quoi | Où |
|---|---|
| Chiffres du projet d'Élodie | `index.html` et `projets/elodie-assistante-maternelle/index.html` |
| Chiffres du projet ST Création Paysage | `index.html` et `projets/st-creation-paysage/index.html` |
| Réponses de la FAQ | `index.html` : le texte visible **et** le bloc `FAQPage` en haut du fichier |
