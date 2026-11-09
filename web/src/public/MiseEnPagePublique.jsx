// Cadre commun à tous les écrans publics : barre de navigation en haut, pied
// de page en bas, et l'écran courant au milieu (<Outlet /> de react-router).
//
// La liste des hôtels est chargée une seule fois ici, puis transmise aux
// écrans via le « contexte d'outlet » : useOutletContext() dans l'écran.
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { appelerApi } from '../api.js';
import NavigationPublique from './NavigationPublique.jsx';
import PiedDePage from './PiedDePage.jsx';

export default function MiseEnPagePublique() {
  const [hotels, setHotels] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    appelerApi('/api/hotels')
      .then(setHotels)
      .catch((e) => setErreur(e.message));
  }, []);

  return (
    <div className="site-public">
      <NavigationPublique />
      {erreur && (
        <p className="site-public__erreur" role="alert">
          Impossible de charger les établissements : {erreur}
        </p>
      )}
      <Outlet context={{ hotels }} />
      <PiedDePage hotels={hotels} />
    </div>
  );
}
