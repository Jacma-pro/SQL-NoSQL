// Écran « Accueil » du site public (maquette : Accueil · Desktop / Mobile).
// Hôtels et catégories viennent de l'API, comme pour la réception.
import { useEffect, useState } from 'react';
import { appelerApi } from '../api.js';
import { formaterPrix } from '../format.js';
import Photo from '../composants/Photo.jsx';
import NavigationPublique from './NavigationPublique.jsx';
import RechercheSejour from './RechercheSejour.jsx';
import Introduction from './Introduction.jsx';
import CarteEtablissement from './CarteEtablissement.jsx';
import CarteChambre from './CarteChambre.jsx';
import Engagements from './Engagements.jsx';
import PiedDePage from './PiedDePage.jsx';
import herosDesktop from '../assets/images/hero-desktop.jpg';
import herosMobile from '../assets/images/hero-mobile.jpg';

export default function Accueil() {
  const [hotels, setHotels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    // Les deux appels partent en même temps.
    Promise.all([appelerApi('/api/hotels'), appelerApi('/api/categories')])
      .then(([h, c]) => {
        setHotels(h);
        setCategories(c);
      })
      .catch((e) => setErreur(e.message));
  }, []);

  // Les catégories arrivent triées par tarif croissant (ORDER BY tarif_nuit) :
  // la première est la moins chère, la dernière est mise en avant.
  const tarifMinimum = categories[0]?.tarif_nuit;
  const idPremium = categories.at(-1)?.id_categorie;

  return (
    <div className="site-public">
      <NavigationPublique />

      <main>
        <section className="heros">
          {/* Photo décorative : alt vide, le texte du héros suffit. */}
          <Photo desktop={herosDesktop} mobile={herosMobile} alt="" className="heros__photo" />
          <div className="heros__voile" />

          <div className="heros__promesse">
            <p className="heros__surtitre">DEUX MAISONS. L’ESPRIT DES ALPES.</p>
            <h1 className="heros__titre">Trouvez le séjour parfait pour votre prochaine escapade</h1>
            <p className="heros__texte">
              Deux adresses de caractère, le confort d’un accueil attentionné et les Alpes à
              portée de main.
            </p>
          </div>

          <RechercheSejour hotels={hotels} />
        </section>

        {erreur && (
          <p className="site-public__erreur" role="alert">
            Impossible de charger les établissements : {erreur}
          </p>
        )}

        <section id="etablissements" className="section">
          <Introduction
            surtitre="LE BON ENDROIT, TOUT SIMPLEMENT"
            titre="Nos établissements"
            texte="L’effervescence de la ville, la sérénité des montagnes."
          />
          <div className="grille-etablissements">
            {hotels.map((h) => (
              <CarteEtablissement key={h.id_hotel} hotel={h} />
            ))}
          </div>
        </section>

        <section id="chambres" className="section section--chambres">
          <Introduction
            surtitre="VOTRE REFUGE ALPIN"
            titre="Nos chambres"
            texte="Quatre façons de se sentir ailleurs. Toujours chez soi."
            aside={tarifMinimum && `À partir de ${formaterPrix(tarifMinimum)} / nuit`}
          />
          <div className="grille-chambres">
            {categories.map((c) => (
              <CarteChambre
                key={c.id_categorie}
                categorie={c}
                premium={c.id_categorie === idPremium}
              />
            ))}
          </div>
        </section>

        <Engagements />
      </main>

      <PiedDePage hotels={hotels} />
    </div>
  );
}
