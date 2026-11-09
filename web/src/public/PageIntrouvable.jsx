// Affichée pour toute adresse qui ne correspond à aucun écran.
import Bouton from '../composants/Bouton.jsx';

export default function PageIntrouvable() {
  return (
    <main className="fiche">
      <h1 className="resultats__titre">Page introuvable</h1>
      <p className="resultats__message">Cette page n’existe pas ou n’est pas encore disponible.</p>
      <div>
        <Bouton to="/">Revenir à l’accueil</Bouton>
      </div>
    </main>
  );
}
