// Carte d'une offre sur l'écran Résultats : une catégorie de chambre libre
// dans l'hôtel et aux dates choisies. Horizontale sur desktop (photo à
// gauche), verticale sur mobile.
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import Photo from '../composants/Photo.jsx';
import { formaterPrix } from '../format.js';
import { PHOTOS_CATEGORIES } from './images.js';

export default function CarteOffre({ offre, hotel, nuits, premium, lienDetails }) {
  const photo = PHOTOS_CATEGORIES[offre.id_categorie];
  const total = Number(offre.tarif_nuit) * nuits;

  return (
    <article className={`carte-offre ${premium ? 'carte-offre--premium' : ''}`}>
      {photo && (
        <Photo
          desktop={photo.desktop}
          mobile={photo.mobile}
          alt={`Chambre ${offre.libelle}`}
          className="carte-offre__photo"
        />
      )}

      <div className="carte-offre__infos">
        <div className="carte-offre__entete">
          <h3 className="carte-offre__nom">{offre.libelle}</h3>
          {premium && <Badge variante="premium">{offre.libelle}</Badge>}
        </div>

        <p className="carte-offre__detail">
          {hotel.nom}{hotel.ville && ` · ${hotel.ville}`}
          <br />
          {offre.description}
        </p>

        <hr className="separateur" />

        <p className="carte-offre__tarif">
          <span className="carte-offre__prix">{formaterPrix(offre.tarif_nuit)}</span>
          <span className="carte-offre__unite">/ nuit</span>
        </p>
        <p className="carte-offre__detail">
          {formaterPrix(total)} pour {nuits} nuit{nuits > 1 ? 's' : ''} · Hors prestations
        </p>

        <Bouton to={lienDetails} pleineLargeur>Voir les détails</Bouton>
      </div>
    </article>
  );
}
