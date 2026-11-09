// Bouton de la maquette, partagé par le public et la réception.
//   variante "primaire"   : fond bleu, texte blanc (« Rechercher », « Check-in »)
//   variante "secondaire" : fond blanc, bordure grise (« Voir les détails », « Check-out »)
// Selon les props, le même style s'applique à :
//   to   → un lien interne de l'application (<Link> de react-router, sans rechargement)
//   href → un lien classique <a> (ancres comme "/#recherche")
//   sinon → un vrai <button>
import { Link } from 'react-router-dom';
import Icone from './Icone.jsx';

export default function Bouton({
  children,
  variante = 'primaire',
  icone,
  pleineLargeur = false,
  to,
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

  if (to) {
    return <Link to={to} className={classes} {...autres}>{contenu}</Link>;
  }
  if (href) {
    return <a href={href} className={classes} {...autres}>{contenu}</a>;
  }
  return <button type={type} className={classes} {...autres}>{contenu}</button>;
}
