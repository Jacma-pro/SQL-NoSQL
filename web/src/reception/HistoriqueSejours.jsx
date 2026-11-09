// « Historique des séjours » de la fiche client : séjours terminés ou annulés,
// paginés (5 par page) avec le composant partagé Pagination.
import { useState } from 'react';
import Badge from '../composants/Badge.jsx';
import Pagination from '../composants/Pagination.jsx';
import { formaterDate, formaterPrix } from '../format.js';
import { STATUTS_SEJOUR } from './statutsSejour.js';

const PAR_PAGE = 5;

export default function HistoriqueSejours({ sejours }) {
  const [page, setPage] = useState(1);
  const nombrePages = Math.ceil(sejours.length / PAR_PAGE);
  const affiches = sejours.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <section className="panneau historique">
      <h2 className="panneau__titre panneau__titre--moyen">Historique des séjours</h2>

      {sejours.length === 0 ? (
        <p className="mouvements__vide">Aucun séjour passé.</p>
      ) : (
        <>
          <div className="historique__entete" aria-hidden="true">
            <span className="historique__reference">RÉFÉRENCE</span>
            <span className="historique__chambre">CHAMBRE / DATES</span>
            <span className="historique__total">TOTAL</span>
            <span className="historique__statut">STATUT</span>
          </div>

          <ul className="historique__liste">
            {affiches.map((s) => (
              <li key={s.reference} className="historique__ligne">
                <span className="historique__reference">{s.reference}</span>
                <span className="historique__chambre">
                  <span className="historique__numero">{s.numero} · {s.categorie}</span>
                  <span className="historique__dates">
                    {formaterDate(s.arrivee)} → {formaterDate(s.depart)}
                  </span>
                </span>
                <span className="historique__total">{formaterPrix(s.total)}</span>
                <span className="historique__statut">
                  <Badge variante={STATUTS_SEJOUR[s.statut].badge}>{STATUTS_SEJOUR[s.statut].libelle}</Badge>
                </span>
              </li>
            ))}
          </ul>

          <Pagination page={page} nombrePages={nombrePages} onChanger={setPage} />
        </>
      )}
    </section>
  );
}
