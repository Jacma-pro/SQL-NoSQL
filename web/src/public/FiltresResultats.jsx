// Panneau « Filtres » de l'écran Résultats : catégories et prix par nuit.
// Le filtrage se fait dans le navigateur, sur les offres déjà chargées.
//
// La maquette prévoit aussi « Type de salle d'eau » et « Prestations
// incluses » : la base ne contient pas ces informations, ces filtres ne sont
// donc pas affichés (voir le compte rendu de l'étape).
import Bouton from '../composants/Bouton.jsx';
import { formaterPrix } from '../format.js';

export default function FiltresResultats({
  categories,
  cochees,
  onBasculer,
  prixMin,
  prixMax,
  prixChoisi,
  onPrix,
  onReinitialiser,
  nombreChambres,
}) {
  return (
    <div className="filtres">
      <div className="filtres__entete">
        <p className="filtres__titre">Filtres</p>
        <button type="button" className="filtres__reinitialiser" onClick={onReinitialiser}>
          Réinitialiser
        </button>
      </div>

      <fieldset className="filtres__groupe">
        <legend className="filtres__libelle">Catégorie de chambre</legend>
        {categories.map((c) => (
          <label key={c.id_categorie} className="filtres__option">
            <input
              type="checkbox"
              checked={cochees.includes(c.id_categorie)}
              onChange={() => onBasculer(c.id_categorie)}
            />
            {c.libelle} · {formaterPrix(c.tarif_nuit)}
          </label>
        ))}
      </fieldset>

      <hr className="separateur" />

      <div className="filtres__groupe">
        <label htmlFor="filtre-prix" className="filtres__libelle">Prix par nuit</label>
        <input
          id="filtre-prix"
          type="range"
          className="filtres__curseur"
          min={prixMin}
          max={prixMax}
          step={5}
          value={prixChoisi}
          onChange={(e) => onPrix(Number(e.target.value))}
        />
        <div className="filtres__bornes">
          <span>{formaterPrix(prixMin)}</span>
          <span>{formaterPrix(prixChoisi)}</span>
        </div>
      </div>

      {/* Sur mobile, les filtres sont au-dessus de la liste : ce bouton y descend. */}
      <div className="filtres__afficher">
        <Bouton href="#liste-offres" pleineLargeur>
          Afficher {nombreChambres > 1 ? `les ${nombreChambres} chambres` : `${nombreChambres} chambre`}
        </Bouton>
      </div>
    </div>
  );
}
