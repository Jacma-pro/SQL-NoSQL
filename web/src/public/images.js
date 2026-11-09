// Photos de la maquette, rattachées aux identifiants de la base.
// Les images ne sont pas stockées en base : on les associe ici à id_hotel et
// id_categorie (valeurs du seed : 1 = Hôtel du Parc, 2 = Hôtel Belledonne ;
// catégories 1 à 4 = Simple, Confort, Supérieure, Suite).
import hotel1Desktop from '../assets/images/hotel-1-desktop.jpg';
import hotel1Mobile from '../assets/images/hotel-1-mobile.jpg';
import hotel2Desktop from '../assets/images/hotel-2-desktop.jpg';
import hotel2Mobile from '../assets/images/hotel-2-mobile.jpg';
import categorie1Desktop from '../assets/images/categorie-1-desktop.jpg';
import categorie1Mobile from '../assets/images/categorie-1-mobile.jpg';
import categorie2Desktop from '../assets/images/categorie-2-desktop.jpg';
import categorie2Mobile from '../assets/images/categorie-2-mobile.jpg';
import categorie3Desktop from '../assets/images/categorie-3-desktop.jpg';
import categorie3Mobile from '../assets/images/categorie-3-mobile.jpg';
import categorie4Desktop from '../assets/images/categorie-4-desktop.jpg';
import categorie4Mobile from '../assets/images/categorie-4-mobile.jpg';

export const PHOTOS_HOTELS = {
  1: { desktop: hotel1Desktop, mobile: hotel1Mobile },
  2: { desktop: hotel2Desktop, mobile: hotel2Mobile },
};

export const PHOTOS_CATEGORIES = {
  1: { desktop: categorie1Desktop, mobile: categorie1Mobile },
  2: { desktop: categorie2Desktop, mobile: categorie2Mobile },
  3: { desktop: categorie3Desktop, mobile: categorie3Mobile },
  4: { desktop: categorie4Desktop, mobile: categorie4Mobile },
};
