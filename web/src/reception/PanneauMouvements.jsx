// Panneau « Arrivées du jour » ou « Départs du jour ».
//
// Les boutons Check-in / Check-out appelleront les procédures SQL check_in et
// check_out (phase 3). D'ici là, ils sont désactivés.
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import { formaterDate, formaterPrix, nombreNuits } from '../format.js';
import { ACTION_PHASE_3, STATUTS_SEJOUR } from './statutsSejour.js';

export default function PanneauMouvements({ type, mouvements }) {
  const arrivee = type === 'arrivee';
  const titre = arrivee ? 'Arrivées du jour' : 'Départs du jour';

  return (
    <section className="panneau mouvements">
      <h2 className="panneau__titre panneau__titre--moyen">
        {titre} · {mouvements.length}
      </h2>

      {mouvements.length === 0 && (
        <p className="mouvements__vide">{arrivee ? 'Aucune arrivée aujourd’hui.' : 'Aucun départ aujourd’hui.'}</p>
      )}

      {mouvements.map((m) => {
        const nuits = nombreNuits(m.arrivee, m.depart);
        return (
          <div key={m.reference} className="mouvement">
            <div className="mouvement__ligne">
              <div className="mouvement__reservation">
                <p className="mouvement__client">{m.client} · {m.numero}</p>
                <p className={`mouvement__reference ${arrivee ? 'mouvement__reference--arrivee' : ''}`}>
                  {m.reference}
                </p>
                <p className="mouvement__dates">
                  {formaterDate(m.arrivee)} → {formaterDate(m.depart)} · {nuits} nuit{nuits > 1 ? 's' : ''} ·{' '}
                  {arrivee ? `${m.voyageurs} voyageur${m.voyageurs > 1 ? 's' : ''}` : m.categorie}
                </p>
              </div>
              <Bouton
                petit
                variante={arrivee ? 'primaire' : 'secondaire'}
                disabled
                title={ACTION_PHASE_3}
              >
                {arrivee ? 'Check-in' : 'Check-out'}
              </Bouton>
            </div>

            <div className="mouvement__badges">
              <Badge variante={STATUTS_SEJOUR[m.statut].badge}>{STATUTS_SEJOUR[m.statut].libelle}</Badge>
              <Badge variante="succes">Payé · {formaterPrix(m.paye)}</Badge>
              <Badge variante={m.reste > 0 ? 'avertissement' : 'neutre'}>Reste {formaterPrix(m.reste)}</Badge>
            </div>
          </div>
        );
      })}
    </section>
  );
}
