// Écran « Fiche chambre » du site public (maquette : Fiche chambre · Desktop / Mobile).
//
// Adresse : /chambres/:idCategorie?hotel=1&arrivee=…&depart=…&voyageurs=1
// (les critères de recherche suivent depuis l'écran Résultats).
// Données : la catégorie et ses chambres libres sur la période
// (GET /api/hotels/:id/categories/:idCategorie), et les prestations.
import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { appelerApi } from '../api.js';
import { dateIso, dansNJours, decouperAdresse, formaterPrix, nombreNuits } from '../format.js';
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import GalerieChambre from './GalerieChambre.jsx';
import PlanSituation from './PlanSituation.jsx';
import RecapitulatifReservation from './RecapitulatifReservation.jsx';
import { texteAnnulation } from './annulation.js';
import { GALERIES_CATEGORIES, PHOTOS_CATEGORIES } from './images.js';

export default function FicheChambre() {
  const { hotels } = useOutletContext();
  const { idCategorie } = useParams();
  const [parametres] = useSearchParams();

  // Critères de l'adresse, avec les mêmes valeurs par défaut que l'accueil
  // (on peut arriver ici directement depuis une carte « Nos chambres »).
  const idHotel = parametres.get('hotel') ?? (hotels[0] ? String(hotels[0].id_hotel) : null);
  const arrivee = parametres.get('arrivee') ?? dateIso(new Date());
  const depart = parametres.get('depart') ?? dateIso(dansNJours(3));
  const voyageurs = Number(parametres.get('voyageurs') ?? 1);

  const [categorie, setCategorie] = useState(null);
  const [prestations, setPrestations] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    appelerApi('/api/prestations').then(setPrestations).catch((e) => setErreur(e.message));
  }, []);

  useEffect(() => {
    if (!idHotel) return; // la liste des hôtels n'est pas encore arrivée
    setCategorie(null);
    setErreur(null);
    const requete = new URLSearchParams({ arrivee, depart });
    appelerApi(
      `/api/hotels/${encodeURIComponent(idHotel)}/categories/${encodeURIComponent(idCategorie)}?${requete}`
    )
      .then(setCategorie)
      .catch((e) => setErreur(e.message));
  }, [idHotel, idCategorie, arrivee, depart]);

  const hotel = hotels.find((h) => String(h.id_hotel) === idHotel);
  // Mêmes critères pour revenir aux résultats ou continuer vers la réservation.
  const criteres = new URLSearchParams({ hotel: idHotel ?? '', arrivee, depart, voyageurs });
  const lienResultats = `/resultats?${criteres}`;

  if (erreur) {
    return (
      <main className="fiche">
        <p className="resultats__message resultats__message--erreur" role="alert">{erreur}</p>
        <Link to={lienResultats} className="fiche__retour">← Revenir aux résultats</Link>
      </main>
    );
  }
  if (!categorie || !hotel) {
    return (
      <main className="fiche">
        <p className="resultats__message">Chargement de la chambre…</p>
      </main>
    );
  }

  const { rue, ville } = decouperAdresse(hotel.adresse);
  const nuits = nombreNuits(arrivee, depart);
  const total = Number(categorie.tarif_nuit) * nuits;
  // On propose la première chambre libre de la catégorie (null si complet).
  const numeroChambre = categorie.chambres_libres[0] ?? null;
  const nbLibres = categorie.chambres_libres.length;

  const galerie = GALERIES_CATEGORIES[categorie.id_categorie];
  const photoSeule = PHOTOS_CATEGORIES[categorie.id_categorie];
  const lienReserver = `/reservation?${criteres}&categorie=${categorie.id_categorie}&chambre=${numeroChambre}`;

  return (
    <main className="fiche">
      <p className="fil-ariane">
        <Link to={lienResultats}>← Résultats</Link> / {hotel.nom} / {categorie.libelle}
      </p>

      <div className="fiche__galerie">
        {(galerie || photoSeule) && (
          <GalerieChambre
            principale={galerie?.principale ?? photoSeule}
            vues={galerie?.vues}
            alt={`Chambre ${categorie.libelle}`}
          />
        )}

        {/* Mobile uniquement : accès rapide au récapitulatif, en bas de page. */}
        <div className="fiche__acces-reservation">
          <p className="fiche__prix-nuit">{formaterPrix(categorie.tarif_nuit)} / nuit</p>
          <Bouton href="#recapitulatif">Réserver · {formaterPrix(total)}</Bouton>
        </div>
      </div>

      <div className="fiche__corps">
        <div className="fiche__presentation">
          <div className="fiche__identite">
            <p className="surtitre">
              {hotel.nom.toUpperCase()}{ville && ` · ${ville.toUpperCase()}`}
            </p>
            <h1 className="fiche__titre">{categorie.libelle}, naturellement.</h1>
            <div className="fiche__attributs">
              <Badge variante="neutre">
                {voyageurs} voyageur{voyageurs > 1 ? 's' : ''}
              </Badge>
              {nbLibres > 0 ? (
                <Badge>
                  {nbLibres} chambre{nbLibres > 1 ? 's' : ''} libre{nbLibres > 1 ? 's' : ''} sur ces dates
                </Badge>
              ) : (
                <Badge variante="premium">Complet sur ces dates</Badge>
              )}
            </div>
            <p className="fiche__description">{categorie.description}.</p>
          </div>

          <hr className="separateur" />

          <section className="fiche__section">
            <h2 className="fiche__sous-titre">À votre rythme</h2>
            <p className="fiche__texte">À demander à la réception pendant votre séjour, selon vos envies.</p>
            <ul className="prestations">
              {prestations.map((p) => (
                <li key={p.id_prestation} className="prestations__ligne">
                  <span>{p.libelle}</span>
                  <span className="prestations__prix">{formaterPrix(p.prix_unitaire)}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="separateur" />

          <section className="fiche__section">
            <h2 className="fiche__sous-titre">{ville || hotel.nom}, au pied des Alpes</h2>
            <p className="fiche__texte">
              {hotel.nom} · {rue}{ville && `, ${ville}`}
            </p>
            <PlanSituation nomHotel={hotel.nom} rue={rue} ville={ville} />
          </section>
        </div>

        <aside className="fiche__reservation">
          <RecapitulatifReservation
            photo={galerie?.recapitulatif ?? photoSeule}
            hotel={hotel}
            ville={ville}
            categorie={categorie}
            numeroChambre={numeroChambre}
            arrivee={arrivee}
            depart={depart}
            nuits={nuits}
            voyageurs={voyageurs}
            lienReserver={lienReserver}
            lienModifier={lienResultats}
          />
          <p className="fiche__annulation">{texteAnnulation(arrivee)}</p>
        </aside>
      </div>
    </main>
  );
}
