import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Accueil from './public/Accueil.jsx';
import App from './App.jsx';
import './styles/main.scss';

// Choix de l'écran selon l'adresse :
//   /reception… → réception (pour l'instant, le squelette de la phase 2)
//   tout le reste → site public
// Volontairement minimal : une librairie de routage (react-router) serait une
// nouvelle dépendance, à valider avant d'ajouter les autres écrans.
const ecran = window.location.pathname.startsWith('/reception') ? <App /> : <Accueil />;

createRoot(document.getElementById('root')).render(
  <StrictMode>{ecran}</StrictMode>
);
