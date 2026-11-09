// Cadre commun aux écrans de la réception (maquette : « Navigation réception »
// + « Sélecteur établissement ») : barre latérale foncée à gauche, sélecteur
// d'hôtel en haut, écran courant au milieu (<Outlet />).
//
// L'hôtel choisi est transmis aux écrans via useOutletContext().
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Signature from '../composants/Signature.jsx';
import Icone from '../composants/Icone.jsx';
import { ETABLISSEMENTS, SESSION } from './donneesFictives.js';
import iconeTableau from '../assets/icones/layout-dashboard.svg';
import iconeSejours from '../assets/icones/calendar-range.svg';
import iconeClients from '../assets/icones/users-round.svg';
import iconeDirection from '../assets/icones/chart-no-axes-combined.svg';
import iconeImmeuble from '../assets/icones/building-2.svg';
import iconeChevron from '../assets/icones/chevron-down.svg';

const LIENS = [
  { to: '/reception', libelle: 'Tableau de bord', icone: iconeTableau, end: true },
  { to: '/reception/sejours', libelle: 'Séjours', icone: iconeSejours },
  { to: '/reception/clients', libelle: 'Fiche client', icone: iconeClients },
  { to: '/reception/direction', libelle: 'Direction', icone: iconeDirection },
];

// « Lundi 09/11/2026 »
const formatJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
const formatDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
function aujourdhuiEnToutesLettres() {
  const maintenant = new Date();
  const jour = formatJour.format(maintenant);
  return `${jour.charAt(0).toUpperCase()}${jour.slice(1)} ${formatDate.format(maintenant)}`;
}

export default function MiseEnPageReception() {
  const [idHotel, setIdHotel] = useState(ETABLISSEMENTS[0].id_hotel);
  const hotel = ETABLISSEMENTS.find((h) => h.id_hotel === idHotel);

  return (
    <div className="reception">
      <aside className="reception__navigation">
        <Signature sousTitre="ESPACE RÉCEPTION" href="/reception" variante="sombre" />

        <nav className="reception__liens" aria-label="Espace réception">
          {LIENS.map((lien) => (
            // NavLink ajoute la classe "active" sur l'entrée de l'écran courant.
            <NavLink key={lien.to} to={lien.to} end={lien.end} className="reception__lien">
              <Icone src={lien.icone} taille={18} teinte />
              {lien.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="reception__session">
          <hr className="separateur" />
          <p className="reception__session-nom">{SESSION.nom}</p>
          <p className="reception__session-detail">{SESSION.role}</p>
          <p className="reception__session-detail">{aujourdhuiEnToutesLettres()}</p>
        </div>
      </aside>

      <div className="reception__espace">
        <header className="reception__entete">
          <label className="reception__etablissement">
            <Icone src={iconeImmeuble} taille={20} />
            <span className="visuellement-cache">Établissement</span>
            <select value={idHotel} onChange={(e) => setIdHotel(Number(e.target.value))}>
              {ETABLISSEMENTS.map((h) => (
                <option key={h.id_hotel} value={h.id_hotel}>{h.nom} · {h.ville}</option>
              ))}
            </select>
            <Icone src={iconeChevron} taille={16} />
          </label>
          <p className="reception__adresse">
            {hotel.nombre_chambres} chambres · {hotel.rue}
          </p>
        </header>

        <Outlet context={{ hotel }} />
      </div>
    </div>
  );
}
