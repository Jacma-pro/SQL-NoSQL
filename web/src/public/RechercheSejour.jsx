// Formulaire « Recherche de séjour », partagé par l'accueil et les résultats.
//
// À la validation, on ouvre /resultats?hotel=1&arrivee=…&depart=…&voyageurs=1.
// Sur l'écran Résultats, le formulaire est prérempli avec ces mêmes paramètres
// (prop `initial`).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import { dateIso, dansNJours } from '../format.js';
import iconeLieu from '../assets/icones/map-pin.svg';
import iconeCalendrier from '../assets/icones/calendar-days.svg';
import iconeVoyageur from '../assets/icones/user-round.svg';
import iconeRecherche from '../assets/icones/search.svg';

// La base ne stocke pas encore la capacité des chambres : ce choix est
// transmis dans l'adresse mais ne filtre rien pour l'instant.
const CHOIX_VOYAGEURS = [1, 2, 3, 4];

export default function RechercheSejour({ hotels, initial = {} }) {
  const navigate = useNavigate();
  const aujourdhui = dateIso(new Date());
  const [idHotel, setIdHotel] = useState(initial.hotel ?? '');
  // Par défaut : arrivée aujourd'hui, départ dans 3 nuits (comme la maquette).
  const [arrivee, setArrivee] = useState(initial.arrivee ?? aujourdhui);
  const [depart, setDepart] = useState(initial.depart ?? dateIso(dansNJours(3)));
  const [voyageurs, setVoyageurs] = useState(initial.voyageurs ?? 1);
  const [erreur, setErreur] = useState(null);

  // Tant qu'aucun hôtel n'est choisi, on présélectionne le premier de la liste.
  const hotelChoisi = idHotel || (hotels[0] ? String(hotels[0].id_hotel) : '');

  function rechercher(evenement) {
    evenement.preventDefault();
    // Même règle que la contrainte CHECK (date_fin > date_debut) de la base.
    if (depart <= arrivee) {
      setErreur('La date de départ doit être après la date d’arrivée.');
      return;
    }
    const parametres = new URLSearchParams({ hotel: hotelChoisi, arrivee, depart, voyageurs });
    navigate(`/resultats?${parametres}`);
  }

  return (
    <form id="recherche" className="recherche" onSubmit={rechercher}>
      <div className="critere">
        <label htmlFor="recherche-hotel" className="critere__libelle">Établissement</label>
        <div className="critere__valeur">
          <Icone src={iconeLieu} taille={17} />
          <select
            id="recherche-hotel"
            value={hotelChoisi}
            onChange={(e) => setIdHotel(e.target.value)}
          >
            {hotels.map((h) => (
              <option key={h.id_hotel} value={h.id_hotel}>{h.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sur mobile, arrivée et départ sont côte à côte sur une même ligne. */}
      <div className="recherche__dates">
        <div className="critere">
          <label htmlFor="recherche-arrivee" className="critere__libelle">Arrivée</label>
          <div className="critere__valeur">
            <Icone src={iconeCalendrier} taille={17} className="critere__icone-date" />
            <input
              id="recherche-arrivee"
              type="date"
              min={aujourdhui}
              value={arrivee}
              onChange={(e) => { setArrivee(e.target.value); setErreur(null); }}
              required
            />
          </div>
        </div>
        <div className="critere">
          <label htmlFor="recherche-depart" className="critere__libelle">Départ</label>
          <div className="critere__valeur">
            <Icone src={iconeCalendrier} taille={17} className="critere__icone-date" />
            <input
              id="recherche-depart"
              type="date"
              min={arrivee}
              value={depart}
              onChange={(e) => { setDepart(e.target.value); setErreur(null); }}
              required
            />
          </div>
        </div>
      </div>

      <div className="critere">
        <label htmlFor="recherche-voyageurs" className="critere__libelle">Voyageurs</label>
        <div className="critere__valeur">
          <Icone src={iconeVoyageur} taille={17} />
          <select
            id="recherche-voyageurs"
            value={voyageurs}
            onChange={(e) => setVoyageurs(Number(e.target.value))}
          >
            {CHOIX_VOYAGEURS.map((n) => (
              <option key={n} value={n}>{n} adulte{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <Bouton type="submit" icone={iconeRecherche}>Rechercher</Bouton>

      {erreur && <p className="recherche__erreur" role="alert">{erreur}</p>}
    </form>
  );
}
