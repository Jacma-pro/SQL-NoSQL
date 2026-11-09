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

// Arrivées et départs du jour (statuts : codes de la base reserve / en_cours).
const MOUVEMENTS = {
  1: {
    arrivees: [
      {
        reference: 'HDP-2026-1109', client: 'Camille Lefèvre', numero: 203, categorie: 'Supérieure',
        arrivee: jour(0), depart: jour(3), voyageurs: 1, statut: 'reserve', paye: 528, reste: 0,
      },
    ],
    departs: [
      {
        reference: 'HDP-2026-1107', client: 'Julien Moreau', numero: 101, categorie: 'Simple',
        arrivee: jour(-2), depart: jour(0), voyageurs: 1, statut: 'en_cours', paye: 150, reste: 0,
      },
    ],
  },
  2: {
    arrivees: [
      {
        reference: 'HBE-2026-2201', client: 'Hugo Petit', numero: 2201, categorie: 'Confort',
        arrivee: jour(0), depart: jour(2), voyageurs: 2, statut: 'reserve', paye: 0, reste: 220,
      },
    ],
    departs: [],
  },
};

/**
 * Données du tableau de bord d'un hôtel.
 * Asynchrone, comme le sera l'appel à l'API : les écrans n'auront pas à changer.
 */
export async function chargerTableauDeBord(idHotel) {
  return {
    chambres: CHAMBRES[idHotel] ?? [],
    arrivees: MOUVEMENTS[idHotel]?.arrivees ?? [],
    departs: MOUVEMENTS[idHotel]?.departs ?? [],
  };
}
