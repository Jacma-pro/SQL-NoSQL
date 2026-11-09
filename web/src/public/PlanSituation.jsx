// Plan de situation INDICATIF de la maquette : un dessin en CSS (rues, îlots,
// parc) avec un repère sur l'hôtel. Ce n'est pas une vraie carte : aucune
// coordonnée n'est stockée en base, et une carte interactive demanderait une
// librairie et un service externes.
import Icone from '../composants/Icone.jsx';
import iconeRepere from '../assets/icones/map-pin-blanc.svg';

// "12 avenue Félix Viallet" → "Avenue Félix Viallet" (on retire le numéro).
function nomDeRue(rue) {
  const sansNumero = rue.replace(/^\d+\s*(bis|ter)?\s*/i, '');
  return sansNumero.charAt(0).toUpperCase() + sansNumero.slice(1);
}

export default function PlanSituation({ nomHotel, rue, ville }) {
  return (
    // role="img" + aria-label : le dessin est décrit en une phrase aux lecteurs d'écran.
    <div className="plan" role="img" aria-label={`Plan indicatif : ${nomHotel}, ${rue}, ${ville}`}>
      <div className="plan__parc" />
      <div className="plan__ilot plan__ilot--haut" />
      <div className="plan__ilot plan__ilot--bas" />
      <div className="plan__avenue" />
      <div className="plan__rue" />

      <span className="plan__nom-rue">{nomDeRue(rue)}</span>
      <div className="plan__repere">
        <Icone src={iconeRepere} taille={20} />
      </div>
      <span className="plan__nom-hotel">{nomHotel}</span>
      <span className="plan__legende">Plan de situation indicatif · {ville}</span>
    </div>
  );
}
