// Formulaire « Recherche de séjour » de l'accueil.
//
// C'est un formulaire HTML classique (method="get") : à la validation, le
// navigateur ouvre /resultats?hotel=1&arrivee=…&depart=…&voyageurs=1.
// L'écran Résultats lira ces paramètres (étape suivante de la maquette).
import { useState } from 'react';
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import { dateIso, dansNJours } from '../format.js';
import iconeLieu from '../assets/icones/map-pin.svg';
import iconeCalendrier from '../assets/icones/calendar-days.svg';
import iconeVoyageur from '../assets/icones/user-round.svg';
import iconeRecherche from '../assets/icones/search.svg';

// La base ne stocke pas encore la capacité des chambres : ce choix est
// transmis à l'écran suivant mais ne filtre rien pour l'instant.
const CHOIX_VOYAGEURS = [1, 2, 3, 4];

export default function RechercheSejour({ hotels }) {
  const aujourdhui = dateIso(new Date());
  const [idHotel, setIdHotel] = useState('');
  // Par défaut : arrivée aujourd'hui, départ dans 3 nuits (comme la maquette).
  const [arrivee, setArrivee] = useState(aujourdhui);
  const [depart, setDepart] = useState(dateIso(dansNJours(3)));
  const [voyageurs, setVoyageurs] = useState(1);
  const [erreur, setErreur] = useState(null);

  // Tant que les hôtels ne sont pas chargés, on présélectionne le premier.
  const hotelChoisi = idHotel || (hotels[0] ? String(hotels[0].id_hotel) : '');

  function valider(evenement) {
    // Même règle que la contrainte CHECK (date_fin > date_debut) de la base.
    if (depart <= arrivee) {
      evenement.preventDefault();
      setErreur('La date de départ doit être après la date d’arrivée.');
    }
  }

  return (
    <form
      id="recherche"
      className="recherche"
      action="/resultats"
      method="get"
      onSubmit={valider}
    >
      <div className="critere">
        <label htmlFor="recherche-hotel" className="critere__libelle">Établissement</label>
        <div className="critere__valeur">
          <Icone src={iconeLieu} taille={17} />
          <select
            id="recherche-hotel"
            name="hotel"
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
              name="arrivee"
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
              name="depart"
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
            name="voyageurs"
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
