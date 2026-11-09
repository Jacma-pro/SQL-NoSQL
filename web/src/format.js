// Petites fonctions de mise en forme, partagées par les deux interfaces.

// pg renvoie les NUMERIC sous forme de texte ("75.00") pour ne pas perdre de
// précision : on le convertit en nombre seulement pour l'affichage.
const formatPrixRond = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const formatPrixCentimes = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

/** "75.00" → "75 €", mais "9.50" → "9,50 €" (on garde les centimes s'il y en a). */
export function formaterPrix(montant) {
  const nombre = Number(montant);
  return Number.isInteger(nombre) ? formatPrixRond.format(nombre) : formatPrixCentimes.format(nombre);
}

/**
 * Découpe une adresse de la base, "12 avenue Félix Viallet, 38000 Grenoble",
 * en { rue: "12 avenue Félix Viallet", ville: "Grenoble" }.
 * Si l'adresse n'a pas ce format, on la renvoie entière dans `rue`.
 */
export function decouperAdresse(adresse) {
  const morceaux = adresse.match(/^(.*),\s*\d{5}\s+(.+)$/);
  if (!morceaux) return { rue: adresse, ville: '' };
  return { rue: morceaux[1], ville: morceaux[2] };
}

/** Date locale au format attendu par <input type="date"> : "2026-11-09". */
export function dateIso(date) {
  // toISOString() passerait en UTC et pourrait décaler d'un jour : on
  // assemble donc la date à la main, dans le fuseau du navigateur.
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mois}-${jour}`;
}

/** "2026-11-09" → "09/11/2026" (sans passer par Date : pas de décalage de fuseau). */
export function formaterDate(iso) {
  const [annee, mois, jour] = iso.split('-');
  return `${jour}/${mois}/${annee}`;
}

/** Nombre de nuits entre deux dates "AAAA-MM-JJ" (départ − arrivée). */
export function nombreNuits(arrivee, depart) {
  // Calcul en UTC pour ne pas être faussé par le passage à l'heure d'hiver.
  const UN_JOUR = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(`${depart}T00:00:00Z`) - Date.parse(`${arrivee}T00:00:00Z`)) / UN_JOUR);
}

/** Aujourd'hui + n jours. */
export function dansNJours(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}
