// Carte d'une catégorie de chambre : photo, nom, description, tarif.
// `premium` (la catégorie la plus chère) ajoute la bordure dorée et le badge
// de la maquette.
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import Photo from '../composants/Photo.jsx';
import { formaterPrix } from '../format.js';
import { PHOTOS_CATEGORIES } from './images.js';

export default function CarteChambre({ categorie, premium = false }) {
  const photo = PHOTOS_CATEGORIES[categorie.id_categorie];

  return (
    <article className={`carte-chambre ${premium ? 'carte-chambre--premium' : ''}`}>
      {photo && (
        <Photo
          desktop={photo.desktop}
          mobile={photo.mobile}
          alt={`Chambre ${categorie.libelle}`}
          className="carte-chambre__photo"
        />
      )}

      <div className="carte-chambre__infos">
        <div className="carte-chambre__entete">
          <h3 className="carte-chambre__nom">{categorie.libelle}</h3>
          {premium && <Badge variante="premium">{categorie.libelle}</Badge>}
        </div>
        <p className="carte-chambre__description">{categorie.description}</p>

        <hr className="separateur" />

        <p className="carte-chambre__tarif">
          <span className="carte-chambre__prix">{formaterPrix(categorie.tarif_nuit)}</span>
          <span className="carte-chambre__unite">/ nuit</span>
        </p>

        <Bouton variante="secondaire" pleineLargeur href={`/chambres/${categorie.id_categorie}`}>
          Voir les détails
        </Bouton>
      </div>
    </article>
  );
}
