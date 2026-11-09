import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MiseEnPagePublique from './public/MiseEnPagePublique.jsx';
import Accueil from './public/Accueil.jsx';
import Resultats from './public/Resultats.jsx';
import FicheChambre from './public/FicheChambre.jsx';
import PageIntrouvable from './public/PageIntrouvable.jsx';
import App from './App.jsx';
import './styles/main.scss';

// Plan des écrans. Les écrans publics partagent la même mise en page
// (navigation + pied de page) grâce à la route parente sans `path`.
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
        {/* Réception : squelette de la phase 2, en attendant ses écrans. */}
        <Route path="/reception" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
