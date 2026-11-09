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

// Galerie de la fiche chambre : la maquette ne la dessine que pour la
// Supérieure (catégorie 3). Les autres catégories affichent leur photo seule.
import superieurePrincipaleDesktop from '../assets/images/superieure-principale-desktop.jpg';
import superieurePrincipaleMobile from '../assets/images/superieure-principale-mobile.jpg';
import superieureBainDesktop from '../assets/images/superieure-bain-desktop.jpg';
import superieureBainMobile from '../assets/images/superieure-bain-mobile.jpg';
import superieurePiscineDesktop from '../assets/images/superieure-piscine-desktop.jpg';
import superieurePiscineMobile from '../assets/images/superieure-piscine-mobile.jpg';
import superieureRecapDesktop from '../assets/images/superieure-recap-desktop.jpg';
import superieureRecapMobile from '../assets/images/superieure-recap-mobile.jpg';

export const GALERIES_CATEGORIES = {
  3: {
    principale: { desktop: superieurePrincipaleDesktop, mobile: superieurePrincipaleMobile },
    vues: [
      { desktop: superieureBainDesktop, mobile: superieureBainMobile, alt: 'Salle de bain avec baignoire' },
      { desktop: superieurePiscineDesktop, mobile: superieurePiscineMobile, alt: 'Piscine de l’hôtel' },
    ],
    recapitulatif: { desktop: superieureRecapDesktop, mobile: superieureRecapMobile },
  },
};

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
