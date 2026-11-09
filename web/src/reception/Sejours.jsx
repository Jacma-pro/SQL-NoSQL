// Écran « Séjours » de la réception (maquette : Séjours · Réception) :
// recherche, période, filtre par statut, tableau paginé, export CSV.
// Données : fictives pour l'instant (chargerSejours dans donneesFictives.js),
// filtrées et paginées comme le fera l'API (WHERE, LIMIT / OFFSET).
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import Pagination from '../composants/Pagination.jsx';
import { dansNJours, dateIso, formaterDate, formaterPrix } from '../format.js';
import { chargerSejours } from './donneesFictives.js';
import { ACTION_PHASE_3, STATUTS_SEJOUR } from './statutsSejour.js';
import iconeRecherche from '../assets/icones/search-gris.svg';
import iconeCalendrier from '../assets/icones/calendar-days-champ.svg';
import iconeExport from '../assets/icones/download.svg';
import iconeInfo from '../assets/icones/info.svg';

const PAR_PAGE = 8;

// Export CSV des séjours affichés par les filtres (toutes les pages).
// Séparateur « ; » et BOM UTF-8 pour qu'Excel en français l'ouvre correctement.
function telechargerCsv(sejours) {
  const entetes = ['Référence', 'Client', 'Chambre', 'Catégorie', 'Arrivée', 'Départ', 'Statut', 'Total', 'Payé', 'Reste'];
  const lignes = sejours.map((s) => [
    s.reference, s.client, s.numero, s.categorie, formaterDate(s.arrivee), formaterDate(s.depart),
    STATUTS_SEJOUR[s.statut].libelle, s.total, s.paye, s.reste,
  ]);
  // Chaque valeur entre guillemets (les guillemets internes sont doublés).
  const csv = [entetes, ...lignes]
    .map((ligne) => ligne.map((valeur) => `"${String(valeur).replaceAll('"', '""')}"`).join(';'))
    .join('\r\n');

  const fichier = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(fichier);
  lien.download = `sejours-${dateIso(new Date())}.csv`;
  lien.click();
  URL.revokeObjectURL(lien.href);
}

export default function Sejours() {
  const { hotel } = useOutletContext();
  const aujourdhui = dateIso(new Date());

  // Critères (par défaut : les ~3 derniers mois et les 3 prochaines semaines).
  const [recherche, setRecherche] = useState('');
  const [du, setDu] = useState(dateIso(dansNJours(-100)));
  const [au, setAu] = useState(dateIso(dansNJours(21)));
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);
  const [resultat, setResultat] = useState(null);

  // Changer un critère ramène à la première page.
  const changerCritere = (setter) => (valeur) => {
    setter(valeur);
    setPage(1);
  };

  useEffect(() => {
    chargerSejours(hotel.id_hotel, { recherche, du, au, statut, page, parPage: PAR_PAGE }).then(setResultat);
  }, [hotel.id_hotel, recherche, du, au, statut, page]);

  async function exporter() {
    const tout = await chargerSejours(hotel.id_hotel, { recherche, du, au, statut, page: 1, parPage: Infinity });
    telechargerCsv(tout.sejours);
  }

  const nombrePages = resultat ? Math.ceil(resultat.total / PAR_PAGE) : 0;
  const premier = (page - 1) * PAR_PAGE + 1;
  const dernier = resultat ? Math.min(page * PAR_PAGE, resultat.total) : 0;

  return (
    <main className="reception__contenu">
      <div className="reception__titre-page">
        <div>
          <h1 className="reception__titre">Séjours</h1>
          <p className="reception__sous-titre">Réservations, paiements et mouvements dans une seule vue.</p>
        </div>
        <Badge variante="neutre">{formaterDate(aujourdhui)}</Badge>
      </div>

      <div className="sejours__criteres">
        <div className="champ sejours__recherche">
          <label htmlFor="sejours-recherche" className="champ__libelle">Rechercher un séjour</label>
          <div className="champ__valeur">
            <Icone src={iconeRecherche} taille={16} />
            <input
              id="sejours-recherche"
              type="search"
              placeholder="Nom, chambre ou référence…"
              value={recherche}
              onChange={(e) => changerCritere(setRecherche)(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="champ sejours__periode">
          <legend className="champ__libelle">Période de séjour</legend>
          <div className="champ__valeur">
            <Icone src={iconeCalendrier} taille={16} />
            <input
              type="date"
              aria-label="Début de la période"
              value={du}
              max={au}
              onChange={(e) => changerCritere(setDu)(e.target.value)}
            />
            <span aria-hidden="true">—</span>
            <input
              type="date"
              aria-label="Fin de la période"
              value={au}
              min={du}
              onChange={(e) => changerCritere(setAu)(e.target.value)}
            />
          </div>
        </fieldset>

        <Bouton variante="secondaire" icone={iconeExport} onClick={exporter}>Exporter</Bouton>
      </div>

      {/* Filtre actif affiché comme un badge bleu, les autres comme de petits boutons. */}
      <div className="sejours__statuts" role="group" aria-label="Filtrer par statut">
        {statut === '' ? (
          <Badge variante="info">Tous les statuts · {resultat?.totalTousStatuts ?? '…'}</Badge>
        ) : (
          <Bouton petit variante="secondaire" onClick={() => changerCritere(setStatut)('')}>
            Tous les statuts
          </Bouton>
        )}
        {Object.entries(STATUTS_SEJOUR).map(([code, { libelle }]) =>
          code === statut ? (
            <Badge key={code} variante="info">{libelle} · {resultat?.total ?? '…'}</Badge>
          ) : (
            <Bouton key={code} petit variante="secondaire" onClick={() => changerCritere(setStatut)(code)}>
              {libelle}
            </Bouton>
          )
        )}
      </div>

      <div className="tableau">
        <div className="tableau__defilement">
          <table className="tableau-sejours">
            <thead>
              <tr>
                <th scope="col">Client / Réservation</th>
                <th scope="col">Chambre</th>
                <th scope="col">Arrivée / Départ</th>
                <th scope="col">Statut</th>
                <th scope="col">Reste à payer</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resultat?.sejours.map((s) => {
                // Arrivée du jour : ligne surlignée en bleu, comme dans la maquette.
                const arriveeDuJour = s.statut === 'reserve' && s.arrivee === aujourdhui;
                return (
                  <tr key={s.reference} className={arriveeDuJour ? 'est-surlignee' : ''}>
                    <td>
                      <p className="tableau-sejours__client">{s.client}</p>
                      <p className={`tableau-sejours__reference ${arriveeDuJour ? 'est-active' : ''}`}>
                        {s.reference}
                      </p>
                    </td>
                    <td>
                      <p className="tableau-sejours__chambre">{s.numero}</p>
                      <p className="tableau-sejours__secondaire">{s.categorie}</p>
                    </td>
                    <td className="tableau-sejours__dates">
                      <p>{formaterDate(s.arrivee)}</p>
                      <p className="tableau-sejours__depart">{formaterDate(s.depart)}</p>
                    </td>
                    <td>
                      <Badge variante={STATUTS_SEJOUR[s.statut].badge}>{STATUTS_SEJOUR[s.statut].libelle}</Badge>
                    </td>
                    <td>
                      <p className={`tableau-sejours__reste ${s.reste > 0 ? 'est-du' : ''}`}>
                        {formaterPrix(s.reste)}
                      </p>
                      <p className="tableau-sejours__secondaire">Total {formaterPrix(s.total)}</p>
                    </td>
                    <td>
                      <div className="tableau-sejours__actions">
                        {s.statut === 'reserve' && (
                          <>
                            <Bouton petit disabled title={ACTION_PHASE_3}>Check-in</Bouton>
                            <button type="button" className="lien-danger" disabled title={ACTION_PHASE_3}>
                              Annuler
                            </button>
                          </>
                        )}
                        {s.statut === 'en_cours' && (
                          <Bouton petit variante="secondaire" disabled title={ACTION_PHASE_3}>Check-out</Bouton>
                        )}
                        {(s.statut === 'termine' || s.statut === 'annule') && (
                          <Link to={`/reception/clients/${s.id_client}`} className="lien-discret">
                            Consulter →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {resultat?.total === 0 && (
          <p className="tableau__vide">Aucun séjour ne correspond à ces critères.</p>
        )}

        <div className="tableau__pied">
          <p className="tableau__resume">
            {resultat && resultat.total > 0
              ? `${premier}–${dernier} sur ${resultat.total} séjour${resultat.total > 1 ? 's' : ''} · ${PAR_PAGE} par page`
              : ''}
          </p>
          <Pagination page={page} nombrePages={nombrePages} onChanger={setPage} />
        </div>
      </div>

      <p className="regle">
        <Icone src={iconeInfo} taille={16} />
        Check-in pour les réservations à venir ; check-out pour les séjours en cours. Les séjours terminés
        ou annulés restent consultables.
      </p>
    </main>
  );
}
