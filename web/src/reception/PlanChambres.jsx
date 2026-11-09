// « Plan des chambres » : une ligne par étage, une vignette colorée par chambre.
// Cliquer sur une vignette la sélectionne et affiche son détail sous le plan.
import Badge from '../composants/Badge.jsx';
import Icone from '../composants/Icone.jsx';
import { ETATS_VISUELS, detailChambre, etatVisuel } from './etatsChambres.js';

export default function PlanChambres({ chambres, departs, numeroSelectionne, onSelectionner }) {
  // Regroupe les chambres par étage : { 1: [...], 2: [...], 3: [...] }
  const etages = {};
  for (const chambre of chambres) {
    (etages[chambre.etage] ??= []).push(chambre);
  }

  // Nombre de chambres dans chaque état, pour la légende.
  const compteurs = {};
  for (const chambre of chambres) {
    const etat = etatVisuel(chambre);
    compteurs[etat] = (compteurs[etat] ?? 0) + 1;
  }

  const selection = chambres.find((c) => c.numero === numeroSelectionne);

  return (
    <section className="panneau plan-chambres">
      <div className="plan-chambres__entete">
        <h2 className="panneau__titre">Plan des chambres</h2>
        <div className="plan-chambres__legende">
          {Object.entries(ETATS_VISUELS).map(([cle, etat]) => (
            <Badge key={cle} variante={etat.badge}>
              {etat.legende} · {compteurs[cle] ?? 0}
            </Badge>
          ))}
        </div>
      </div>

      {Object.entries(etages).map(([etage, chambresEtage]) => (
        <div key={etage} className="plan-chambres__etage">
          <div className="plan-chambres__repere">
            <span className="plan-chambres__repere-libelle">ÉTAGE</span>
            <span className="plan-chambres__repere-numero">{String(etage).padStart(2, '0')}</span>
          </div>

          {chambresEtage.map((chambre) => {
            const cle = etatVisuel(chambre);
            const etat = ETATS_VISUELS[cle];
            return (
              <button
                key={chambre.numero}
                type="button"
                className={`vignette vignette--${cle}`}
                aria-pressed={chambre.numero === numeroSelectionne}
                onClick={() => onSelectionner(chambre.numero)}
              >
                <span className="vignette__identification">
                  <span className="vignette__numero">{chambre.numero}</span>
                  <span className={`vignette__categorie ${chambre.categorie === 'Suite' ? 'vignette__categorie--suite' : ''}`}>
                    {chambre.categorie}
                  </span>
                </span>
                <span className="vignette__etat">
                  <Icone src={etat.icone} taille={14} />
                  {etat.libelle}
                </span>
                <span className="vignette__detail">
                  {chambre.occupant ?? (chambre.attendu ? `${chambre.attendu} · Arrivée` : chambre.note ?? '—')}
                </span>
              </button>
            );
          })}
        </div>
      ))}

      <p className="plan-chambres__selection" aria-live="polite">
        {selection ? detailChambre(selection, departs) : 'Sélectionnez une chambre pour afficher son détail.'}
      </p>
    </section>
  );
}
