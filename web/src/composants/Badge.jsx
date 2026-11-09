// Pastille arrondie de la maquette, partagée par le public et la réception.
//   variante "succes"        : vert   (« 5 chambres disponibles », « Payé »)
//   variante "premium"       : doré   (« Suite »)
//   variante "info"          : bleu   (tri actif, « Réservé », « Occupée »)
//   variante "neutre"        : gris   (« 1 voyageur », « Reste 0 € »)
//   variante "avertissement" : ambre  (« Sale »)
//   variante "danger"        : rouge  (« Maintenance »)
export default function Badge({ children, variante = 'succes' }) {
  return <span className={`badge badge--${variante}`}>{children}</span>;
}
