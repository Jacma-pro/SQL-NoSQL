// Barre de navigation du site public.
// Desktop : liens + bouton visibles. Mobile : un bouton « menu » les affiche
// sous la barre.
import { useState } from 'react';
import Signature from '../composants/Signature.jsx';
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import iconeMenu from '../assets/icones/menu.svg';

export default function NavigationPublique() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const fermerMenu = () => setMenuOuvert(false);

  return (
    <header className="navigation-publique">
      <Signature sousTitre="L’HOSPITALITÉ ALPINE" />

      <button
        type="button"
        className="navigation-publique__menu"
        aria-expanded={menuOuvert}
        aria-controls="liens-publics"
        aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={() => setMenuOuvert(!menuOuvert)}
      >
        <Icone src={iconeMenu} taille={20} />
      </button>

      <nav
        id="liens-publics"
        className={`navigation-publique__liens ${menuOuvert ? 'est-ouvert' : ''}`}
      >
        <a href="/#etablissements" onClick={fermerMenu}>Nos établissements</a>
        <a href="/#chambres" onClick={fermerMenu}>Nos chambres</a>
        <span className="navigation-publique__langue">FR · €</span>
        <Bouton href="/#recherche" onClick={fermerMenu}>Trouver une chambre</Bouton>
      </nav>
    </header>
  );
}
