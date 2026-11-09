// ============================================================================
// DONNÉES FICTIVES de la réception — provisoires.
// ============================================================================
// Les écrans de la réception ont besoin d'objets SQL qui n'existent pas encore
// (vue v_occupation_du_jour, procédures check_in / check_out, rôles : phase 3).
// En attendant, ils lisent ces données, rangées dans la même forme que les
// futures réponses de l'API : il suffira de remplacer `chargerTableauDeBord`
// par un appel à appelerApi('/api/reception/…').
//
// Les dates sont relatives au jour d'exécution (comme 02_seed.sql), pour que
// les arrivées et départs « du jour » restent cohérents quel que soit le jour.
import { dateIso, dansNJours } from '../format.js';

const jour = (n) => dateIso(dansNJours(n));

// Personne connectée (il n'y a pas de comptes en base : profil choisi au lancement).
export const SESSION = { nom: 'Élodie Martin', role: 'Responsable de réception' };

export const ETABLISSEMENTS = [
  { id_hotel: 1, nom: 'Hôtel du Parc', ville: 'Grenoble', rue: '12 avenue Félix Viallet', nombre_chambres: 12 },
  { id_hotel: 2, nom: 'Hôtel Belledonne', ville: 'Chambéry', rue: '4 place Monge', nombre_chambres: 8 },
];

// Une chambre : son état (codes de la base : propre / sale / maintenance),
// l'occupant éventuel, le client attendu aujourd'hui, et une note libre.
const CHAMBRES = {
  1: [
    { numero: 101, etage: 1, categorie: 'Simple', etat: 'propre', occupant: 'Julien Moreau' },
    { numero: 102, etage: 1, categorie: 'Simple', etat: 'sale' },
    { numero: 103, etage: 1, categorie: 'Confort', etat: 'propre' },
    { numero: 104, etage: 1, categorie: 'Confort', etat: 'maintenance', note: 'Plomberie' },
    { numero: 201, etage: 2, categorie: 'Confort', etat: 'propre', occupant: 'Inès Da Silva' },
    { numero: 202, etage: 2, categorie: 'Supérieure', etat: 'sale' },
    { numero: 203, etage: 2, categorie: 'Supérieure', etat: 'propre', attendu: 'Camille Lefèvre', salleEau: 'baignoire' },
    { numero: 204, etage: 2, categorie: 'Supérieure', etat: 'propre' },
    { numero: 301, etage: 3, categorie: 'Suite', etat: 'propre', occupant: 'Marc Bernard' },
    { numero: 302, etage: 3, categorie: 'Suite', etat: 'propre' },
    { numero: 303, etage: 3, categorie: 'Supérieure', etat: 'sale' },
    { numero: 304, etage: 3, categorie: 'Confort', etat: 'propre' },
  ],
  2: [
    { numero: 2101, etage: 1, categorie: 'Simple', etat: 'propre', occupant: 'Sarah Lambert' },
    { numero: 2102, etage: 1, categorie: 'Simple', etat: 'propre' },
    { numero: 2103, etage: 1, categorie: 'Confort', etat: 'sale' },
    { numero: 2104, etage: 1, categorie: 'Confort', etat: 'propre' },
    { numero: 2201, etage: 2, categorie: 'Confort', etat: 'propre', attendu: 'Hugo Petit' },
    { numero: 2202, etage: 2, categorie: 'Supérieure', etat: 'propre', occupant: 'Nina Roux' },
    { numero: 2203, etage: 2, categorie: 'Supérieure', etat: 'propre' },
    { numero: 2204, etage: 2, categorie: 'Suite', etat: 'maintenance', note: 'Peinture' },
  ],
};

// Séjours (statuts : codes de la base reserve / en_cours / termine / annule).
// sejour(référence, client, id client, chambre, catégorie, arrivée et départ
// en jours par rapport à aujourd'hui, statut, total, déjà payé, voyageurs)
function sejour(reference, client, idClient, numero, categorie, debut, fin, statut, total, paye, voyageurs = 1) {
  return {
    reference, client, id_client: idClient, numero, categorie,
    arrivee: jour(debut), depart: jour(fin), statut, total, paye, reste: total - paye, voyageurs,
  };
}

const SEJOURS = {
  1: [
    sejour('HDP-2026-1109', 'Camille Lefèvre', 1, 203, 'Supérieure', 0, 3, 'reserve', 528, 528),
    sejour('HDP-2026-1107', 'Julien Moreau', 2, 101, 'Simple', -2, 0, 'en_cours', 150, 150),
    sejour('HDP-2026-1108', 'Inès Da Silva', 3, 201, 'Confort', -1, 2, 'en_cours', 372, 300),
    sejour('HDP-2026-1106', 'Marc Bernard', 4, 301, 'Suite', -1, 1, 'en_cours', 550, 550, 2),
    sejour('HDP-2026-1112', 'Paul Girard', 5, 302, 'Suite', 3, 6, 'reserve', 720, 200, 2),
    sejour('HDP-2026-1114', 'Léa Fontaine', 6, 102, 'Simple', 5, 7, 'reserve', 150, 0),
    sejour('HDP-2026-1120', 'Marc Bernard', 4, 204, 'Supérieure', 11, 14, 'reserve', 450, 450),
    sejour('HDP-2026-1102', 'Paul Girard', 5, 304, 'Confort', -7, -4, 'termine', 330, 330),
    sejour('HDP-2026-1028', 'Léa Fontaine', 6, 103, 'Confort', -12, -10, 'termine', 220, 220),
    sejour('HDP-2026-1021', 'Sophie Marchand', 7, 301, 'Suite', -19, -16, 'termine', 720, 720, 2),
    sejour('HDP-2026-1015', 'Camille Lefèvre', 1, 204, 'Supérieure', -25, -23, 'termine', 328, 328),
    sejour('HDP-2026-1011', 'Thomas Rey', 8, 102, 'Simple', -29, -27, 'termine', 150, 150),
    sejour('HDP-2026-1006', 'Alice Perrin', 9, 202, 'Supérieure', -34, -31, 'termine', 450, 450),
    sejour('HDP-2026-1003', 'Julien Moreau', 2, 103, 'Confort', -37, -35, 'termine', 220, 220),
    sejour('HDP-2026-0927', 'Sophie Marchand', 7, 104, 'Confort', -43, -41, 'termine', 220, 220),
    sejour('HDP-2026-0920', 'Inès Da Silva', 3, 203, 'Supérieure', -50, -48, 'annule', 0, 0),
    sejour('HDP-2026-0915', 'Thomas Rey', 8, 303, 'Supérieure', -55, -52, 'termine', 450, 450),
    sejour('HDP-2026-0910', 'Alice Perrin', 9, 101, 'Simple', -60, -58, 'annule', 0, 0),
    sejour('HDP-2026-0902', 'Julien Moreau', 2, 302, 'Suite', -68, -65, 'termine', 720, 720),
    sejour('HDP-2026-0825', 'Léa Fontaine', 6, 204, 'Supérieure', -76, -73, 'termine', 450, 450),
    sejour('HDP-2026-0818', 'Paul Girard', 5, 201, 'Confort', -83, -80, 'termine', 330, 330),
    sejour('HDP-2026-0812', 'Marc Bernard', 4, 103, 'Confort', -89, -87, 'termine', 220, 220),
    sejour('HDP-2026-0808', 'Camille Lefèvre', 1, 201, 'Confort', -93, -91, 'termine', 248, 248),
    sejour('HDP-2026-0805', 'Sophie Marchand', 7, 303, 'Supérieure', -96, -94, 'termine', 450, 450),
  ],
  2: [
    sejour('HBE-2026-2201', 'Hugo Petit', 10, 2201, 'Confort', 0, 2, 'reserve', 220, 0, 2),
    sejour('HBE-2026-2101', 'Sarah Lambert', 11, 2101, 'Simple', -1, 3, 'en_cours', 300, 150),
    sejour('HBE-2026-2202', 'Nina Roux', 12, 2202, 'Supérieure', -2, 1, 'en_cours', 450, 450),
    sejour('HBE-2026-2104', 'Hugo Petit', 10, 2104, 'Confort', -40, -38, 'termine', 220, 220),
  ],
};

/**
 * Données du tableau de bord d'un hôtel.
 * Asynchrone, comme le sera l'appel à l'API : les écrans n'auront pas à changer.
 * Arrivées du jour = séjours réservés qui commencent aujourd'hui ;
 * départs du jour = séjours en cours qui se terminent aujourd'hui.
 */
export async function chargerTableauDeBord(idHotel) {
  const sejours = SEJOURS[idHotel] ?? [];
  const aujourdhui = jour(0);
  return {
    chambres: CHAMBRES[idHotel] ?? [],
    arrivees: sejours.filter((s) => s.statut === 'reserve' && s.arrivee === aujourdhui),
    departs: sejours.filter((s) => s.statut === 'en_cours' && s.depart === aujourdhui),
  };
}

// Prestations consommées sur un séjour (table consommer) — ici seulement pour
// la réservation à venir de Camille Lefèvre, comme dans la maquette.
SEJOURS[1][0].prestations = [
  { libelle: 'Petit-déjeuner', montant: 42 },
  { libelle: 'Parking', montant: 36 },
];

// Tarif par nuit de chaque catégorie (table categorie du seed).
const TARIFS = { Simple: 75, Confort: 110, 'Supérieure': 150, Suite: 240 };

// Clients (table client). `supprime_le` : null = fiche active, sinon date
// d'archivage (soft delete). ⚠ `adresse` et `preferences` n'existent PAS dans
// le schéma actuel : la maquette les affiche, à valider en binôme.
const CLIENTS = [
  {
    id_client: 1, prenom: 'Camille', nom: 'Lefèvre', email: 'camille.lefevre@exemple.fr',
    telephone: '+33 6 12 34 56 78', adresse: ['18 rue des Arts', '69002 Lyon, France'],
    preferences: 'Préfère une baignoire et une chambre calme. Petit-déjeuner et parking pour le séjour à venir.',
    supprime_le: null,
  },
  { id_client: 2, prenom: 'Julien', nom: 'Moreau', email: 'julien.moreau@exemple.fr', telephone: '+33 6 23 45 67 89', supprime_le: null },
  { id_client: 3, prenom: 'Inès', nom: 'Da Silva', email: 'ines.dasilva@exemple.fr', telephone: '+33 6 34 56 78 90', supprime_le: null },
  { id_client: 4, prenom: 'Marc', nom: 'Bernard', email: 'marc.bernard@exemple.fr', telephone: '+33 6 45 67 89 01', supprime_le: null },
  { id_client: 5, prenom: 'Paul', nom: 'Girard', email: 'paul.girard@exemple.fr', telephone: '+33 6 56 78 90 12', supprime_le: null },
  { id_client: 6, prenom: 'Léa', nom: 'Fontaine', email: 'lea.fontaine@exemple.fr', telephone: '+33 6 67 89 01 23', supprime_le: null },
  { id_client: 7, prenom: 'Sophie', nom: 'Marchand', email: 'sophie.marchand@exemple.fr', telephone: '+33 6 78 90 12 34', supprime_le: null },
  { id_client: 8, prenom: 'Thomas', nom: 'Rey', email: 'thomas.rey@exemple.fr', telephone: '+33 6 89 01 23 45', supprime_le: null },
  { id_client: 9, prenom: 'Alice', nom: 'Perrin', email: 'alice.perrin@exemple.fr', telephone: '+33 6 90 12 34 56', supprime_le: jour(-30) },
  { id_client: 10, prenom: 'Hugo', nom: 'Petit', email: 'hugo.petit@exemple.fr', telephone: '+33 6 01 23 45 67', supprime_le: null },
  { id_client: 11, prenom: 'Sarah', nom: 'Lambert', email: 'sarah.lambert@exemple.fr', telephone: '+33 7 12 34 56 78', supprime_le: null },
  { id_client: 12, prenom: 'Nina', nom: 'Roux', email: 'nina.roux@exemple.fr', telephone: '+33 7 23 45 67 89', supprime_le: null },
];

// Pour comparer sans tenir compte des majuscules ni des accents (« lefevre » = « Lefèvre »).
function simplifier(texte) {
  return String(texte).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Ordre d'affichage : réservés (le plus proche d'abord), puis en cours, puis
// l'historique (du plus récent au plus ancien).
const PRIORITE_STATUT = { reserve: 0, en_cours: 1, termine: 2, annule: 2 };
function comparerSejours(a, b) {
  const ecart = PRIORITE_STATUT[a.statut] - PRIORITE_STATUT[b.statut];
  if (ecart !== 0) return ecart;
  return PRIORITE_STATUT[a.statut] < 2
    ? a.arrivee.localeCompare(b.arrivee) // à venir / en cours : ordre chronologique
    : b.arrivee.localeCompare(a.arrivee); // historique : plus récent d'abord
}

/**
 * Liste paginée et filtrée des séjours d'un hôtel — imite ce que fera l'API
 * (WHERE … ILIKE …, chevauchement de période, ORDER BY, LIMIT / OFFSET).
 *
 * @param {object} criteres { recherche, du, au, statut ('' = tous), page (1, 2…), parPage }
 * @returns {{ sejours, total, totalTousStatuts }}
 *   total : nombre de séjours correspondant à tous les critères (pour la pagination)
 *   totalTousStatuts : même chose sans le filtre de statut (« Tous les statuts · 24 »)
 */
export async function chargerSejours(idHotel, { recherche = '', du, au, statut = '', page = 1, parPage = 8 }) {
  const motif = simplifier(recherche.trim());

  const correspondants = (SEJOURS[idHotel] ?? [])
    // Recherche dans le nom, le numéro de chambre et la référence.
    .filter((s) => !motif || [s.client, s.numero, s.reference].some((champ) => simplifier(champ).includes(motif)))
    // Période : le séjour chevauche [du, au].
    .filter((s) => (!au || s.arrivee <= au) && (!du || s.depart >= du));

  const filtres = correspondants
    .filter((s) => !statut || s.statut === statut)
    .sort(comparerSejours);

  const debut = (page - 1) * parPage;
  return {
    sejours: filtres.slice(debut, debut + parPage),
    total: filtres.length,
    totalTousStatuts: correspondants.length,
  };
}

/**
 * Recherche des fiches ACTIVES par nom ou prénom (l'archivage retire une
 * fiche de la liste active : WHERE supprime_le IS NULL AND nom ILIKE …).
 */
export async function chercherClients(texte) {
  const motif = simplifier(texte.trim());
  return CLIENTS
    .filter((c) => c.supprime_le === null)
    .filter((c) => !motif || simplifier(`${c.prenom} ${c.nom}`).includes(motif))
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

/**
 * Fiche d'un client, archivée ou non, avec tous ses séjours (tous hôtels
 * confondus). Pour chaque séjour : hôtel, tarif de la nuit, salle d'eau et
 * état actuel de la chambre. null si le client n'existe pas.
 */
export async function chargerFicheClient(idClient) {
  const client = CLIENTS.find((c) => c.id_client === idClient);
  if (!client) return null;

  const sejours = [];
  for (const hotel of ETABLISSEMENTS) {
    for (const s of SEJOURS[hotel.id_hotel] ?? []) {
      if (s.id_client !== idClient) continue;
      const chambre = (CHAMBRES[hotel.id_hotel] ?? []).find((c) => c.numero === s.numero);
      sejours.push({
        ...s,
        hotel: hotel.nom,
        tarif_nuit: TARIFS[s.categorie],
        salleEau: chambre?.salleEau ?? null,
        chambre, // état actuel de la chambre (pour la réservation à venir)
      });
    }
  }
  sejours.sort((a, b) => b.arrivee.localeCompare(a.arrivee));
  return { client: { ...client }, sejours };
}

// Archivage (soft delete) et restauration. En base, ce sera :
//   UPDATE client SET supprime_le = now()  WHERE id_client = $1
//   UPDATE client SET supprime_le = NULL   WHERE id_client = $1
// Ici, la modification ne vit qu'en mémoire : elle disparaît au rechargement.
export async function archiverClient(idClient) {
  const client = CLIENTS.find((c) => c.id_client === idClient);
  if (client) client.supprime_le = jour(0);
}

export async function restaurerClient(idClient) {
  const client = CLIENTS.find((c) => c.id_client === idClient);
  if (client) client.supprime_le = null;
}
