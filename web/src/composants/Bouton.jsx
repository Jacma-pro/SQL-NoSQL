// Bouton de la maquette, partagé par le public et la réception.
//   variante "primaire"   : fond bleu, texte blanc (« Rechercher », « Check-in »)
//   variante "secondaire" : fond blanc, bordure grise (« Voir les détails », « Check-out »)
// Avec `href`, le bouton est rendu comme un lien <a> (même apparence).
import Icone from './Icone.jsx';

export default function Bouton({
  children,
  variante = 'primaire',
  icone,
  pleineLargeur = false,
  href,
  type = 'button',
  ...autres
}) {
  const classes = `bouton bouton--${variante} ${pleineLargeur ? 'bouton--pleine-largeur' : ''}`;
  const contenu = (
    <>
      {icone && <Icone src={icone} taille={16} />}
      {children}
    </>
  );

  if (href) {
    return <a href={href} className={classes} {...autres}>{contenu}</a>;
  }
  return <button type={type} className={classes} {...autres}>{contenu}</button>;
}
