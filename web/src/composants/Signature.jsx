// Logo de la marque : montagne + « PARC & BELLEDONNE » + sous-titre.
// Le sous-titre change selon l'interface :
// « L’HOSPITALITÉ ALPINE » (public) ou « ESPACE RÉCEPTION » (réception).
import Icone from './Icone.jsx';
import iconeMontagne from '../assets/icones/mountain.svg';

export default function Signature({ sousTitre, href = '/' }) {
  return (
    <a href={href} className="signature">
      <Icone src={iconeMontagne} taille={30} />
      <span className="signature__marque">
        <span className="signature__nom">PARC &amp; BELLEDONNE</span>
        <span className="signature__sous-titre">{sousTitre}</span>
      </span>
    </a>
  );
}
