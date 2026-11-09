import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MiseEnPagePublique from './public/MiseEnPagePublique.jsx';
import Accueil from './public/Accueil.jsx';
import Resultats from './public/Resultats.jsx';
import FicheChambre from './public/FicheChambre.jsx';
import PageIntrouvable from './public/PageIntrouvable.jsx';
import MiseEnPageReception from './reception/MiseEnPageReception.jsx';
import TableauDeBord from './reception/TableauDeBord.jsx';
import './styles/main.scss';

// Plan des écrans. Chaque interface a sa mise en page (route parente) :
// le site public (navigation + pied de page) et la réception (barre latérale).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MiseEnPagePublique />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/resultats" element={<Resultats />} />
          <Route path="/chambres/:idCategorie" element={<FicheChambre />} />
          {/* Toute autre adresse : page introuvable, dans le cadre public. */}
          <Route path="*" element={<PageIntrouvable />} />
        </Route>

        <Route path="/reception" element={<MiseEnPageReception />}>
          <Route index element={<TableauDeBord />} />
          {/* Séjours, Fiche client, Direction : écrans suivants de la maquette. */}
          <Route path="*" element={<PageIntrouvable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
