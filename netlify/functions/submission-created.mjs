/*
 * submission-created.mjs — copie chaque demande de contact dans Airtable.
 *
 * Netlify appelle cette fonction tout seul après chaque envoi valide d'un
 * formulaire (le nom du fichier est un nom réservé : ne pas le changer).
 *
 * Principe de sûreté : le message est DÉJÀ enregistré par Netlify Forms
 * avant que cette fonction ne tourne. Si Airtable est en panne ou mal
 * configuré, rien n'est perdu — la demande reste dans l'onglet Forms.
 *
 * Table Airtable attendue (noms de colonnes modifiables dans FIELDS) :
 *   Nom (texte) · Email (e-mail) · Projet (choix unique) · Message (texte long)
 *   Code postal (texte) · Préférence (choix unique) · Téléphone (téléphone)
 *   Créneau (choix unique) · Reçu le (date + heure) · Source (texte)
 *   Statut (choix unique)
 *
 * Préférence, Téléphone et Créneau servent à trier les réponses : rappel
 * téléphonique ou réponse écrite. Le Code postal sert à vérifier la zone
 * de déplacement.
 */

// Correspondance champ du formulaire -> colonne Airtable.
const FIELDS = {
  nom: 'Nom',
  email: 'Email',
  projet: 'Projet',
  message: 'Message',
  code_postal: 'Code postal',
  preference: 'Préférence',
  telephone: 'Téléphone',
  creneau: 'Créneau',
};

// Limite de longueur par sécurité (le formulaire limite déjà côté navigateur).
const clip = (value, max) => String(value ?? '').trim().slice(0, max);

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: 'Corps de requête illisible' };
  }

  // On ne traite que le formulaire de contact.
  if (!payload || payload.form_name !== 'contact') {
    return { statusCode: 200, body: 'Formulaire ignoré' };
  }

  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE } = process.env;
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE) {
    console.log('Airtable non configuré : demande conservée dans Netlify Forms uniquement.');
    return { statusCode: 200, body: 'Airtable non configuré' };
  }

  const data = payload.data || {};
  const fields = {
    [FIELDS.nom]: clip(data.nom, 120),
    [FIELDS.email]: clip(data.email, 200),
    [FIELDS.projet]: clip(data.projet, 40),
    [FIELDS.message]: clip(data.message, 5000),
    [FIELDS.code_postal]: clip(data.code_postal, 5),
    [FIELDS.preference]: clip(data.preference, 20) || 'E-mail',
    // Téléphone et créneau : envoyés seulement si l'appel a été choisi.
    ...(data.telephone ? { [FIELDS.telephone]: clip(data.telephone, 20) } : {}),
    ...(data.telephone && data.creneau ? { [FIELDS.creneau]: clip(data.creneau, 20) } : {}),
    'Reçu le': payload.created_at || new Date().toISOString(),
    Source: 'Site web',
    Statut: 'Nouveau',
  };

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // typecast : Airtable crée lui-même une option de choix manquante.
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });

    if (!res.ok) {
      console.error('Airtable a refusé la demande :', res.status, await res.text());
      return { statusCode: 502, body: 'Échec Airtable' };
    }
    return { statusCode: 200, body: 'Copié dans Airtable' };
  } catch (err) {
    console.error('Airtable injoignable :', err);
    return { statusCode: 502, body: 'Airtable injoignable' };
  }
};
