// Écran « Résultats » du site public (maquette : Résultats · Desktop / Mobile).
//
// Les critères viennent de l'adresse : /resultats?hotel=1&arrivee=…&depart=…&voyageurs=1
// On demande à l'API les catégories libres sur ces dates
// (GET /api/hotels/:id/disponibilites), puis on filtre et trie dans le navigateur.
import { useEffect, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { appelerApi } from '../api.js';
import { dateIso, dansNJours, decouperAdresse, formaterDate, nombreNuits } from '../format.js';
import Badge from '../composants/Badge.jsx';
import RechercheSejour from './RechercheSejour.jsx';
import FiltresResultats from './FiltresResultats.jsx';
import CarteOffre from './CarteOffre.jsx';

// `court` : libellé affiché sur mobile, où la maquette tient tout sur une ligne.
const TRIS = {
  'prix-croissant': {
    libelle: 'Prix croissant',
    court: 'Prix ↑',
    comparer: (a, b) => a.tarif_nuit - b.tarif_nuit,
  },
  'prix-decroissant': {
    libelle: 'Prix décroissant',
    court: 'Prix ↓',
    comparer: (a, b) => b.tarif_nuit - a.tarif_nuit,
  },
};

export default function Resultats() {
  const { hotels } = useOutletContext();
  const [parametres] = useSearchParams();

  // Critères de l'adresse, avec les mêmes valeurs par défaut que l'accueil.
  const idHotel = parametres.get('hotel') ?? (hotels[0] ? String(hotels[0].id_hotel) : null);
  const arrivee = parametres.get('arrivee') ?? dateIso(new Date());
  const depart = parametres.get('depart') ?? dateIso(dansNJours(3));
  const voyageurs = Number(parametres.get('voyageurs') ?? 1);

  const [offres, setOffres] = useState(null); // null = en cours de chargement
  const [categories, setCategories] = useState([]);
  const [erreur, setErreur] = useState(null);

  // Filtres et tri choisis par le visiteur.
  const [cochees, setCochees] = useState([]); // aucune case cochée = toutes les catégories
  const [prixChoisi, setPrixChoisi] = useState(null); // null = pas de limite
  const [tri, setTri] = useState('prix-croissant');

  // Toutes les catégories (pour la liste des filtres et la mise en avant de la plus chère).
  useEffect(() => {
    appelerApi('/api/categories').then(setCategories).catch((e) => setErreur(e.message));
  }, []);

  // Offres disponibles : rechargées à chaque changement de critères.
  useEffect(() => {
    if (!idHotel) return; // la liste des hôtels n'est pas encore arrivée
    setOffres(null);
    setErreur(null);
    const requete = new URLSearchParams({ arrivee, depart });
    appelerApi(`/api/hotels/${encodeURIComponent(idHotel)}/disponibilites?${requete}`)
      .then(setOffres)
      .catch((e) => {
        setErreur(e.message);
        setOffres([]);
      });
  }, [idHotel, arrivee, depart]);

  const hotel = hotels.find((h) => String(h.id_hotel) === idHotel);
  const ville = hotel ? decouperAdresse(hotel.adresse).ville : '';
  const nuits = nombreNuits(arrivee, depart);

  // Bornes du curseur de prix : du tarif le plus bas au plus haut.
  const tarifs = categories.map((c) => Number(c.tarif_nuit));
  const prixMin = tarifs.length ? Math.min(...tarifs) : 0;
  const prixMax = tarifs.length ? Math.max(...tarifs) : 0;
  const plafond = prixChoisi ?? prixMax;
  const idPremium = categories.at(-1)?.id_categorie; // triées par tarif croissant

  const offresAffichees = (offres ?? [])
    .filter((o) => cochees.length === 0 || cochees.includes(o.id_categorie))
    .filter((o) => Number(o.tarif_nuit) <= plafond)
    .sort(TRIS[tri].comparer);
  const nombreChambres = offresAffichees.reduce((total, o) => total + o.chambres_libres, 0);

  function basculerCategorie(id) {
    setCochees((actuelles) =>
      actuelles.includes(id) ? actuelles.filter((x) => x !== id) : [...actuelles, id]
    );
  }

  function reinitialiser() {
    setCochees([]);
    setPrixChoisi(null);
  }

  // On garde les critères dans le lien « Voir les détails ».
  const lienDetails = (idCategorie) => `/chambres/${idCategorie}?${parametres}`;

  return (
    <main>
      <section className="bandeau-recherche">
        <p className="fil-ariane">
          <Link to="/">Accueil</Link> / Nos chambres
        </p>
        {/* `key` : si l'adresse change, le formulaire repart des nouveaux critères. */}
        <RechercheSejour
          key={parametres.toString()}
          hotels={hotels}
          initial={{ hotel: idHotel ?? '', arrivee, depart, voyageurs }}
        />
      </section>

      <section className="resultats">
        <div className="resultats__introduction">
          <h1 className="resultats__titre">Votre parenthèse{ville && ` à ${ville}`}</h1>
          <p className="resultats__criteres">
            {hotel && `${hotel.nom} · `}
            {formaterDate(arrivee)} – {formaterDate(depart)} · {voyageurs} voyageur
            {voyageurs > 1 ? 's' : ''}
          </p>
        </div>

        <div className="resultats__corps">
          <aside className="resultats__filtres">
            <FiltresResultats
              categories={categories}
              cochees={cochees}
              onBasculer={basculerCategorie}
              prixMin={prixMin}
              prixMax={prixMax}
              prixChoisi={plafond}
              onPrix={setPrixChoisi}
              onReinitialiser={reinitialiser}
              nombreChambres={nombreChambres}
            />
          </aside>

          <div id="liste-offres" className="resultats__liste">
            <div className="resultats__outils">
              <p className="resultats__compteur">
                {nombreChambres} chambre{nombreChambres > 1 ? 's' : ''}
                <span className="desktop-seulement">
                  {' '}disponible{nombreChambres > 1 ? 's' : ''}
                </span>
                {' '}· {offresAffichees.length} catégorie{offresAffichees.length > 1 ? 's' : ''}
              </p>
              <div className="resultats__tri">
                <span className="resultats__tri-libelle desktop-seulement">Trier par</span>
                {Object.entries(TRIS).map(([cle, { libelle, court }]) => {
                  const texte = (
                    <>
                      <span className="desktop-seulement">{libelle}</span>
                      <span className="mobile-seulement">{court}</span>
                    </>
                  );
                  return cle === tri ? (
                    <Badge key={cle} variante="info">{texte}</Badge>
                  ) : (
                    <button key={cle} type="button" className="resultats__tri-option" onClick={() => setTri(cle)}>
                      {texte}
                    </button>
                  );
                })}
              </div>
            </div>

            {erreur && <p className="resultats__message resultats__message--erreur" role="alert">{erreur}</p>}
            {offres === null && !erreur && <p className="resultats__message">Recherche des chambres libres…</p>}
            {offres !== null && offresAffichees.length === 0 && !erreur && (
              <p className="resultats__message">
                Aucune chambre ne correspond à ces critères. Essayez d’autres dates ou retirez des filtres.
              </p>
            )}

            {hotel &&
              offresAffichees.map((o) => (
                <CarteOffre
                  key={o.id_categorie}
                  offre={o}
                  hotel={{ nom: hotel.nom, ville }}
                  nuits={nuits}
                  premium={o.id_categorie === idPremium}
                  lienDetails={lienDetails(o.id_categorie)}
                />
              ))}
          </div>
        </div>

        <p className="resultats__note">
          Tarifs TTC pour {voyageurs} voyageur{voyageurs > 1 ? 's' : ''}, hors prestations
          optionnelles. Les disponibilités affichées concernent les dates sélectionnées.
        </p>
      </section>
    </main>
  );
}
