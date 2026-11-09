// Conditions d'annulation affichées sous le récapitulatif (règle de la maquette,
// reprise de l'idée « Annulation avec frais » de projet.md) :
//   plus de 7 jours avant l'arrivée → gratuit
//   de 2 à 7 jours                 → 50 % du séjour
//   moins de 2 jours               → 100 % (non remboursable)
import { dateIso, formaterDate, nombreNuits } from '../format.js';

export const REGLE_ANNULATION =
  'Annulation gratuite à plus de 7 jours. De 2 à 7 jours : 50 %. À moins de 2 jours : 100 %.';

/** Part du séjour retenue si l'on annulait aujourd'hui (0, 50 ou 100). */
export function fraisAnnulation(arrivee) {
  const joursAvantArrivee = nombreNuits(dateIso(new Date()), arrivee);
  if (joursAvantArrivee > 7) return 0;
  if (joursAvantArrivee >= 2) return 50;
  return 100;
}

/** Phrase complète : la règle, puis ce qu'elle donne pour cette arrivée. */
export function texteAnnulation(arrivee) {
  const frais = fraisAnnulation(arrivee);
  const debut = `${REGLE_ANNULATION} Pour cette arrivée le ${formaterDate(arrivee)},`;
  if (frais === 0) return `${debut} l’annulation est aujourd’hui gratuite.`;
  if (frais === 50) return `${debut} une annulation coûterait aujourd’hui 50 % du séjour.`;
  return `${debut} le séjour est non remboursable.`;
}
