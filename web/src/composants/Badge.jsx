// Pastille arrondie de la maquette (« 5 chambres disponibles », « Suite »…).
// Les variantes de la réception (occupée, sale, maintenance…) seront
// ajoutées avec ses écrans.
//   variante "succes"  : vert
//   variante "premium" : doré
export default function Badge({ children, variante = 'succes' }) {
  return <span className={`badge badge--${variante}`}>{children}</span>;
}
