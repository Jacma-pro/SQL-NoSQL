// Écran du squelette (phase 2) : choisir un hôtel et voir ses chambres.
// Sert surtout à prouver la chaîne complète base → API → front.
// Accessible sur /reception, en attendant les écrans réception de la maquette.
import { useEffect, useState } from 'react';
import { appelerApi as appelerApiPartage } from './api.js';

// La base stocke des codes sans accent ; l'écran affiche des libellés lisibles.
const LIBELLES_ETAT = {
  propre: 'Propre',
  sale: 'Sale',
  maintenance: 'En maintenance',
};

export default function App() {
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState('');
  const [chambres, setChambres] = useState([]);
  const [erreur, setErreur] = useState(null);

  // Même accès à l'API que le site public (src/api.js) : mêmes données.
  function appelerApi(url) {
    setErreur(null);
    return appelerApiPartage(url);
  }

  // Au chargement : liste des hôtels.
  useEffect(() => {
    appelerApi('/api/hotels')
      .then(setHotels)
      .catch((e) => setErreur(e.message));
  }, []);

  // Quand un hôtel est choisi : ses chambres.
  function choisirHotel(evenement) {
    const id = evenement.target.value;
    setIdHotel(id);
    setChambres([]);
    if (!id) return;
    appelerApi(`/api/hotels/${id}/chambres`)
      .then(setChambres)
      .catch((e) => setErreur(e.message));
  }

  return (
    <main className="squelette">
      <h1>Hôtel — Réception</h1>

      <label>
        Hôtel :{' '}
        <select value={idHotel} onChange={choisirHotel}>
          <option value="">— choisir —</option>
          {hotels.map((h) => (
            <option key={h.id_hotel} value={h.id_hotel}>
              {h.nom}
            </option>
          ))}
        </select>
      </label>

      {erreur && <p className="erreur">{erreur}</p>}

      {chambres.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Étage</th>
              <th>Catégorie</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {chambres.map((c) => (
              <tr key={c.numero}>
                <td>{c.numero}</td>
                <td>{c.etage}</td>
                <td>{c.categorie}</td>
                <td>
                  <span className={`etat etat--${c.etat}`}>
                    {LIBELLES_ETAT[c.etat] ?? c.etat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
