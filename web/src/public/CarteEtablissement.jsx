// Carte d'un hôtel : photo, nombre de chambres libres, ville, nom, adresse.
// Toute la carte est un lien vers la recherche de chambres dans cet hôtel.
import Badge from '../composants/Badge.jsx';
import Icone from '../composants/Icone.jsx';
import Photo from '../composants/Photo.jsx';
import { decouperAdresse } from '../format.js';
import { PHOTOS_HOTELS } from './images.js';
import iconeFleche from '../assets/icones/arrow-up-right.svg';

export default function CarteEtablissement({ hotel }) {
  const { rue, ville } = decouperAdresse(hotel.adresse);
  const photo = PHOTOS_HOTELS[hotel.id_hotel];
  const n = hotel.chambres_disponibles;

  return (
    <a href={`/resultats?hotel=${hotel.id_hotel}`} className="carte-etablissement">
      <div className="carte-etablissement__vue">
        {photo && (
          <Photo
            desktop={photo.desktop}
            mobile={photo.mobile}
            alt={hotel.nom}
            className="carte-etablissement__photo"
          />
        )}
        <div className="carte-etablissement__badge">
          <Badge>{n} chambre{n > 1 ? 's' : ''} disponible{n > 1 ? 's' : ''}</Badge>
        </div>
      </div>

      <div className="carte-etablissement__presentation">
        <div className="carte-etablissement__identite">
          <p className="surtitre">{ville.toUpperCase()}</p>
          <h3 className="carte-etablissement__nom">{hotel.nom}</h3>
          <p className="carte-etablissement__adresse">{rue}{ville && `, ${ville}`}</p>
        </div>
        <Icone src={iconeFleche} taille={26} />
      </div>
    </a>
  );
}
