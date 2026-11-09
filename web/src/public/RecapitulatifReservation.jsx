// Récapitulatif de réservation de la fiche chambre (colonne fixe sur desktop,
// en bas de page sur mobile). Le total ne compte que les nuits : dans le
// modèle de données, les prestations sont ajoutées pendant le séjour
// (table consommer), pas au moment de réserver.
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import Photo from '../composants/Photo.jsx';
import { formaterDate, formaterPrix } from '../format.js';
import iconeCadenas from '../assets/icones/lock-keyhole.svg';

export default function RecapitulatifReservation({
  photo,
  hotel,
  ville,
  categorie,
  numeroChambre, // null si aucune chambre n'est libre
  arrivee,
  depart,
  nuits,
  voyageurs,
  lienReserver,
  lienModifier,
}) {
  const total = Number(categorie.tarif_nuit) * nuits;

  return (
    <div id="recapitulatif" className="recapitulatif">
      {photo && (
        <Photo
          desktop={photo.desktop}
          mobile={photo.mobile}
          alt={`Chambre ${categorie.libelle}`}
          className="recapitulatif__photo"
        />
      )}
      <p className="surtitre">VOTRE ESCAPADE{ville && ` À ${ville.toUpperCase()}`}</p>
      <h2 className="recapitulatif__hotel">{hotel.nom}</h2>
      <p className="recapitulatif__chambre">
        {categorie.libelle}
        {numeroChambre && ` · Chambre ${numeroChambre}`}
      </p>

      <hr className="separateur" />

      <p className="recapitulatif__dates">
        <span>{formaterDate(arrivee)} → {formaterDate(depart)}</span>
        <span className="recapitulatif__point"> · </span>
        <span className="recapitulatif__duree">
          {nuits} nuit{nuits > 1 ? 's' : ''} · {voyageurs} voyageur{voyageurs > 1 ? 's' : ''}
        </span>
      </p>

      <hr className="separateur" />

      <p className="recapitulatif__ligne">
        <span>{nuits} nuit{nuits > 1 ? 's' : ''} × {formaterPrix(categorie.tarif_nuit)}</span>
        <span>{formaterPrix(total)}</span>
      </p>

      <hr className="separateur" />

      <p className="recapitulatif__total">
        <span>Total TTC</span>
        <span className="recapitulatif__montant">{formaterPrix(total)}</span>
      </p>
      <p className="recapitulatif__mention">Taxes comprises · Aucun frais caché</p>

      {numeroChambre ? (
        <Bouton to={lienReserver} pleineLargeur>Réserver</Bouton>
      ) : (
        <>
          <p className="recapitulatif__complet" role="status">
            Aucune chambre {categorie.libelle} n’est libre sur ces dates.
          </p>
          <Bouton to={lienModifier} variante="secondaire" pleineLargeur>Modifier les dates</Bouton>
        </>
      )}

      <p className="recapitulatif__securite">
        <Icone src={iconeCadenas} taille={15} />
        Paiement sécurisé et données protégées
      </p>
    </div>
  );
}
