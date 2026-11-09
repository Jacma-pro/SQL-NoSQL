// Petites fonctions de mise en forme, partagées par les deux interfaces.

// pg renvoie les NUMERIC sous forme de texte ("75.00") pour ne pas perdre de
// précision : on le convertit en nombre seulement pour l'affichage.
const formatPrix = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

/** "75.00" → "75 €" */
export function formaterPrix(montant) {
  return formatPrix.format(Number(montant));
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

/** Aujourd'hui + n jours. */
export function dansNJours(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}
