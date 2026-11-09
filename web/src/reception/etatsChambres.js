// État « visuel » d'une chambre sur le plan, et ce qui l'accompagne à l'écran.
//
// La base ne stocke que l'état d'entretien (propre / sale / maintenance).
// Une chambre propre où dort un client s'affiche « Occupée » : on combine donc
// l'état et la présence d'un occupant.
import iconeLibre from '../assets/icones/circle-check.svg';
import iconeOccupee from '../assets/icones/user-round-plan.svg';
import iconeSale from '../assets/icones/brush-cleaning.svg';
import iconeMaintenance from '../assets/icones/wrench.svg';

export const ETATS_VISUELS = {
  libre: { libelle: 'Libre et propre', legende: '✓ Libre et propre', icone: iconeLibre, badge: 'succes' },
  occupee: { libelle: 'Occupée', legende: '● Occupée', icone: iconeOccupee, badge: 'info' },
  sale: { libelle: 'Sale', legende: '↺ Sale', icone: iconeSale, badge: 'avertissement' },
  maintenance: { libelle: 'Maintenance', legende: '⚒ Maintenance', icone: iconeMaintenance, badge: 'danger' },
};

/** Clé de ETATS_VISUELS pour une chambre. */
export function etatVisuel(chambre) {
  if (chambre.occupant) return 'occupee';
  if (chambre.etat === 'propre') return 'libre';
  return chambre.etat; // 'sale' ou 'maintenance'
}

/**
 * Phrase de détail sous le plan, pour la chambre sélectionnée, par exemple :
 * « 203 · Supérieure avec baignoire · Réservée à Camille Lefèvre · Libre et propre · Check-in à effectuer »
 */
export function detailChambre(chambre, departs) {
  const morceaux = [
    chambre.numero,
    chambre.salleEau ? `${chambre.categorie} avec ${chambre.salleEau}` : chambre.categorie,
  ];
  if (chambre.occupant) morceaux.push(`Occupée par ${chambre.occupant}`);
  if (chambre.attendu) morceaux.push(`Réservée à ${chambre.attendu}`);
  morceaux.push(ETATS_VISUELS[etatVisuel(chambre)].libelle);

  // Action attendue de la réception ou du ménage.
  if (chambre.attendu) morceaux.push('Check-in à effectuer');
  else if (departs.some((d) => d.numero === chambre.numero)) morceaux.push('Check-out à effectuer');
  else if (chambre.etat === 'sale') morceaux.push('Ménage à réaliser');
  else if (chambre.etat === 'maintenance' && chambre.note) morceaux.push(`Intervention : ${chambre.note}`);

  return morceaux.join(' · ');
}
