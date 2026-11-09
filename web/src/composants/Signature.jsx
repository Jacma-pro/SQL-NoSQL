// Logo de la marque : montagne + « PARC & BELLEDONNE » + sous-titre.
//   variante "claire" (site public)  : icône à gauche du nom, sur fond blanc
//   variante "sombre" (réception)    : icône au-dessus du nom, sur fond foncé
import { Link } from 'react-router-dom';
import Icone from './Icone.jsx';
import iconeMontagne from '../assets/icones/mountain.svg';
import iconeMontagneBlanche from '../assets/icones/mountain-blanc.svg';

export default function Signature({ sousTitre, href = '/', variante = 'claire' }) {
  const sombre = variante === 'sombre';
  return (
    <Link to={href} className={`signature signature--${variante}`}>
      <Icone src={sombre ? iconeMontagneBlanche : iconeMontagne} taille={sombre ? 31 : 30} />
      <span className="signature__marque">
        <span className="signature__nom">PARC &amp; BELLEDONNE</span>
        <span className="signature__sous-titre">{sousTitre}</span>
      </span>
    </Link>
  );
}
