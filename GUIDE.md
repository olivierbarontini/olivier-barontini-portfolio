# Guide du site — mise en ligne, automatisation, entretien

Document de travail. Il complète le `README.md`, qui décrit la structure des
fichiers. Ici : ce qu'il faut faire, dans quel ordre, et ce qu'il faut
vérifier.

---

## 1. Ce que vaut le code aujourd'hui

### Organisation

Une responsabilité par fichier, aucun fichier qui en fait deux.

| Fichier | Rôle unique | Lignes |
|---|---|---|
| `tokens.css` | Couleurs, typo, espaces, courbes d'animation | 53 |
| `base.css` | Reset, focus, boutons, liens d'action | 132 |
| `thread.css` | Navigation : fil desktop et panneau mobile | 142 |
| `hero.css` | Image du Hero et halo | 86 |
| `scenes.css` | Mise en page des scènes et pied de page | 114 |
| `method.css` | Les quatre étapes | 61 |
| `faq.css` | Questions dépliables | 44 |
| `contact.css` | Formulaire | 62 |
| `cursor.css` | Curseur lumineux | 52 |
| `pages.css` | Pages projets et pages légales | 39 |
| `lamp.css` | Réalisations « de nuit », révélées par la lumière | 45 |
| `motion-flag.js` | Autoriser ou non les animations | 11 |
| `scene-reveal.js` | Apparition des scènes | 25 |
| `hero-reveal.js` | Halo du Hero | 89 |
| `thread-nav.js` | Progression, nœud actif, panneau mobile | 87 |
| `method-steps.js` | Enchaînement des étapes | 59 |
| `cursor.js` | Curseur lumineux | 54 |
| `contact-prefs.js` | Téléphone demandé seulement si l'appel est choisi | 28 |
| `contact-form.js` | Envoi du formulaire | 49 |
| `submission-created.mjs` | Copie vers Airtable (serveur) | 79 |

Total : environ 1 200 lignes, sans aucune dépendance, sans build.

### Règles tenues

- Aucune valeur de couleur, de police ou d'espacement en dur hors de
  `tokens.css`.
- Chaque script commence par un commentaire qui dit ce qu'il fait, dans
  quelles conditions il s'active, et ce qui se passe s'il ne s'active pas.
- Aucun script ne dépend d'un autre. Retirer `cursor.js` du HTML ne casse
  rien d'autre.
- Le contenu ne dépend jamais d'un effet : sans JavaScript ou en mouvement
  réduit, tout reste lisible et navigable.
- Le scroll de la page n'est jamais détourné.

### Ce qu'il faudra surveiller

| Point | Pourquoi | Quand s'en occuper |
|---|---|---|
| Duplication du HTML entre les pages | En-têtes et pieds de page sont recopiés dans chaque fichier | À la troisième étude de cas : passer à un générateur (Eleventy, Astro) |
| Textes de la FAQ écrits à deux endroits | Une fois dans la page, une fois dans les données structurées du `<head>` | À chaque modification d'une réponse : changer les deux |
| Performances non mesurées | Le halo du Hero redessine l'image en continu | Après la mise en ligne : passer Lighthouse sur mobile |
| Aucun test automatisé | Normal à cette taille | Si le site dépasse une dizaine de pages |

---

## 2. Les données du formulaire

### Le chemin d'une demande

1. Le visiteur envoie le formulaire.
2. Netlify Forms l'enregistre. **C'est la source de vérité** : même si tout
   le reste échoue, le message est là.
3. Netlify vous envoie un e-mail de notification.
4. Netlify déclenche la fonction `submission-created.mjs`.
5. La fonction copie la demande dans Airtable.

L'ordre compte : la copie Airtable est un confort, pas un maillon critique.

### Mettre Airtable en place

1. **Créer la base.** Dans Airtable, une base « Prospection », une table
   « Demandes », avec exactement ces colonnes :

| Colonne | Type |
|---|---|
| `Nom` | Texte court |
| `Email` | E-mail |
| `Projet` | Choix unique |
| `Message` | Texte long |
| `Reçu le` | Date, avec l'heure |
| `Source` | Texte court |
| `Statut` | Choix unique (Nouveau, Répondu, Devis envoyé, Gagné, Perdu) |

Les noms doivent être identiques, majuscules et accents compris. Pour en
changer, modifiez l'objet `FIELDS` en haut de `submission-created.mjs`.

2. **Créer le jeton.** Dans Airtable, menu du compte, « Builder hub », puis
   « Personal access tokens ». Portée `data.records:write`, limitée à cette
   seule base. Copiez le jeton : il ne s'affiche qu'une fois.

3. **Récupérer l'identifiant de base.** Il est dans l'URL de la base et
   commence par `app`.

4. **Déclarer les variables dans Netlify.** Site configuration, puis
   Environment variables :

```
AIRTABLE_TOKEN     le jeton copié
AIRTABLE_BASE_ID   appXXXXXXXXXXXXXX
AIRTABLE_TABLE     Demandes
```

Ne mettez jamais ces valeurs dans le code : le dépôt GitHub est public.

5. **Tester.** Envoyez-vous une demande depuis le site en ligne. Vérifiez
   dans l'ordre : l'onglet Forms de Netlify, votre boîte mail, la table
   Airtable. Si la ligne manque, ouvrez Netlify, onglet Functions,
   `submission-created` : les messages d'erreur y sont écrits en clair.

### La suite, quand vous voudrez

Une fois les demandes dans Airtable, tout devient possible sans toucher au
site : une vue « à relancer », un rappel automatique après cinq jours sans
réponse, un e-mail de confirmation personnalisé, un devis pré-rempli. C'est
exactement la démonstration que vous vendez à vos clients : faites-la
d'abord pour vous.

---

## 3. Mise en ligne

### Première fois

1. Créez un dépôt GitHub privé, poussez le dossier du site.
2. Sur app.netlify.com : Add new site, Import an existing project,
   choisissez le dépôt.
3. Build command : **vide**. Publish directory : **`.`**. Functions
   directory : `netlify/functions`. Tout est déjà écrit dans
   `netlify.toml`, Netlify le lit seul.
4. Déployez. Vérifiez la version en ligne.
5. Domain management : ajoutez votre nom de domaine, suivez les
   instructions DNS, laissez Netlify installer le certificat HTTPS.
6. Forms, puis Settings : activez la notification par e-mail.
7. Forms, puis Spam filtering : laissez le filtre actif.

### Ensuite

Chaque `git push` sur la branche principale met le site à jour en une
minute. En cas de problème, Deploys, puis un déploiement précédent, puis
« Publish deploy » : retour en arrière immédiat.

### À faire avant le premier vrai visiteur

| Tâche | Où |
|---|---|
| Remplacer `VOTRE-DOMAINE.fr` | `robots.txt` et `sitemap.xml` |
| Ajouter `<link rel="canonical">` et `og:url` | En-tête de chaque page |
| Compléter les mentions légales et la confidentialité | Voir section 5 |
| Déclarer le site dans Google Search Console | Pour suivre les arrivées |
| Créer la fiche d'établissement Google | Le plus rentable en local |

---

## 4. Sauvegardes et entretien

### Les trois copies

| Quoi | Où | Comment |
|---|---|---|
| Le code | GitHub | Chaque `git push` est une sauvegarde datée |
| Le code, copie hors ligne | Disque externe ou cloud | Une copie du dossier par mois |
| Les demandes | Airtable | Export CSV manuel, une fois par mois |

Netlify n'est pas une sauvegarde : c'est une copie de GitHub. Si vous
supprimez le dépôt, le site reste en ligne mais vous ne pouvez plus le
modifier.

### Rythme d'entretien

| Fréquence | À faire |
|---|---|
| Chaque semaine | Lire les demandes reçues, répondre, mettre le `Statut` à jour |
| Chaque mois | Relever les arrivées Google dans la Search Console, exporter Airtable |
| Chaque trimestre | Relire les textes, actualiser les chiffres des projets, vérifier que les liens externes fonctionnent |
| Une fois par an | Vérifier que le domaine se renouvelle, relire les mentions légales |

### Avant chaque modification

1. Travailler sur une copie, jamais directement sur le dossier en ligne.
2. Tester en local (`npx serve .`), sur desktop et sur téléphone.
3. Vérifier les animations réduites : réglages Windows, Accessibilité,
   Effets visuels, désactiver les animations.
4. Pousser, puis regarder le site en ligne.

---

## 5. Conformité légale

**Je ne suis pas juriste.** Ce qui suit vient de sources publiques citées, et
mérite une vérification, surtout avant la première facture.

### Ce qui est obligatoire pour un site vitrine professionnel

Les mentions légales sont imposées par la loi pour la confiance dans
l'économie numérique du 21 juin 2004, article 6-III. Elles s'appliquent à
tout site accessible au public, quelle que soit la taille de l'activité, et
leur absence est pénalement sanctionnée.

Pour un entrepreneur individuel, le site doit permettre d'identifier :

| Information | État dans le site |
|---|---|
| Nom et prénom | Présent |
| Adresse de l'entreprise | À compléter |
| Téléphone et e-mail | E-mail présent, téléphone à ajouter |
| Numéro SIREN ou SIRET | À compléter |
| Mention du statut (entrepreneur individuel) | Présent |
| TVA non applicable, article 293 B du CGI | Présent, à retirer si vous devenez assujetti |
| Directeur de la publication | Présent |
| Hébergeur : nom, adresse, téléphone | Nom présent, adresse et téléphone à recopier depuis netlify.com |

### Le RGPD, pour le formulaire

La page Confidentialité couvre désormais : le responsable du traitement, ce
qui est collecté, la finalité, la base légale, les destinataires, les
transferts hors Union européenne, la durée de conservation, les droits, et
la CNIL.

Deux points restent à vérifier par vous :

1. **Les transferts hors UE.** Netlify et Airtable sont des sociétés
   américaines. Vérifiez sur leurs sites la garantie qu'elles annoncent
   (clauses contractuelles types, ou cadre de protection des données
   UE–États-Unis) et reprenez le terme exact.
2. **La durée de conservation.** J'ai écrit trois ans. La durée annoncée doit
   être celle que vous appliquez réellement : prévoyez un ménage annuel dans
   Airtable.

Bonne nouvelle : aucun cookie, aucun traceur, donc aucun bandeau de
consentement à gérer. C'est un argument commercial, et un souci de moins.

### Ce qui manque encore, et qui n'est pas dans le site

| Obligation | Quand elle s'applique | État |
|---|---|---|
| Conditions générales de vente ou de prestation | Dès la première prestation ; obligatoires envers un consommateur, communicables sur demande entre professionnels | À rédiger |
| Médiateur de la consommation | Dès que vous facturez un particulier. Il faut adhérer à un médiateur agréé et afficher ses coordonnées sur le site, les devis et les factures. Défaut sanctionné par une amende administrative pouvant atteindre 3 000 € pour une personne physique | Emplacement prêt dans les mentions légales, adhésion à prendre |
| Droit de rétractation | Contrats conclus à distance avec un particulier | À traiter dans les CGV |
| Facturation électronique | Réception obligatoire pour les indépendants assujettis à la TVA depuis septembre 2026 ; émission ensuite | À vérifier selon votre régime de TVA |

### Ordre conseillé

1. Immatriculer la micro-entreprise, obtenir le SIREN et le SIRET.
2. Compléter les mentions légales et la confidentialité, retirer les
   passages en doré.
3. Mettre le site en ligne.
4. Avant la première facture à un particulier : adhérer à un médiateur de la
   consommation, rédiger les CGV.

Le site peut être publié avant les étapes 4. Il ne peut pas l'être sans
l'étape 2 : des mentions légales incomplètes sont, en droit, des mentions
légales absentes.

---

## 6. Rappels d'usage

- Une modification, un `git push`, un coup d'œil en ligne. Jamais trois
  modifications d'un coup sans vérifier.
- Les chiffres affichés sur le site (contrats signés, arrivées Google)
  doivent rester vrais. Mettez-les à jour, ou retirez-les.
- Ne promettez pas sur le site ce que vous ne tenez pas : délais courts,
  maintenance, réponse rapide. Ces phrases vous engagent.
- Gardez la même image de Hero : c'est votre signature visuelle. Si vous en
  changez un jour, changez-la partout le même jour.
