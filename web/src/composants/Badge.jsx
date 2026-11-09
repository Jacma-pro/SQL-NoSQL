// Pastille arrondie de la maquette (« 5 chambres disponibles », « Suite »…).
// Les variantes propres à la réception (occupée, sale, maintenance…) seront
// ajoutées avec ses écrans.
//   variante "succes"  : vert
//   variante "premium" : doré
//   variante "info"    : bleu (tri actif, statut « Réservé »…)
//   variante "neutre"  : gris (« 1 voyageur », « Reste 0 € »…)
export default function Badge({ children, variante = 'succes' }) {
  return <span className={`badge badge--${variante}`}>{children}</span>;
}
