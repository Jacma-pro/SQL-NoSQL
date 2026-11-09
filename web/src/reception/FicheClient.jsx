// Écran « Fiche client » de la réception (maquette : Fiche client · Réception).
//
// Adresses : /reception/clients (recherche) et /reception/clients/:idClient
// (fiche, ouverte aussi depuis « Consulter → » de l'écran Séjours).
// Données : fictives pour l'instant (donneesFictives.js).
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import { dateIso, formaterDate, formaterPrix, nombreNuits } from '../format.js';
import {
  archiverClient,
  chargerFicheClient,
  chercherClients,
  restaurerClient,
} from './donneesFictives.js';
import { ETATS_VISUELS, etatVisuel } from './etatsChambres.js';
import { ACTION_PHASE_3, STATUTS_SEJOUR } from './statutsSejour.js';
import ProfilClient from './ProfilClient.jsx';
import HistoriqueSejours from './HistoriqueSejours.jsx';
import ArchivageClient from './ArchivageClient.jsx';
import iconeRecherche from '../assets/icones/search-gris.svg';

// Panneau « Réservation à venir » (ou séjour en cours).
function ReservationAVenir({ sejour }) {
  const aujourdhui = dateIso(new Date());
  const nuits = nombreNuits(sejour.arrivee, sejour.depart);
  const prixNuits = nuits * sejour.tarif_nuit;
  const prestations = sejour.prestations ?? [];
  const reserve = sejour.statut === 'reserve';

  // Ce qu'il reste à faire pour ce séjour.
  let suite = 'Séjour en cours · Check-out à effectuer au départ';
  if (reserve) {
    suite = sejour.arrivee === aujourdhui
      ? 'Check-in à effectuer'
      : `Arrivée prévue le ${formaterDate(sejour.arrivee)}`;
  }
  const etatChambre = sejour.chambre ? ETATS_VISUELS[etatVisuel(sejour.chambre)].libelle : null;

  return (
    <section className="panneau reservation-a-venir">
      <h2 className="panneau__titre panneau__titre--moyen">
        {reserve ? 'Réservation à venir' : 'Séjour en cours'} · {sejour.reference}
      </h2>

      <div className="reservation-a-venir__detail">
        <div className="reservation-a-venir__texte">
          <p className="reservation-a-venir__chambre">
            {sejour.numero} · {sejour.categorie}
            {sejour.salleEau && ` avec ${sejour.salleEau}`}
          </p>
          <p className="reservation-a-venir__lignes">
            <span>{sejour.hotel} · {formaterDate(sejour.arrivee)} → {formaterDate(sejour.depart)}</span>
            <span>
              {sejour.voyageurs} voyageur{sejour.voyageurs > 1 ? 's' : ''} · {nuits} nuit{nuits > 1 ? 's' : ''} ×{' '}
              {formaterPrix(sejour.tarif_nuit)} = {formaterPrix(prixNuits)}
            </span>
          </p>
        </div>
        <Bouton petit variante={reserve ? 'primaire' : 'secondaire'} disabled title={ACTION_PHASE_3}>
          {reserve ? 'Check-in' : 'Check-out'}
        </Bouton>
      </div>

      <div className="mouvement__badges">
        <Badge variante={STATUTS_SEJOUR[sejour.statut].badge}>{STATUTS_SEJOUR[sejour.statut].libelle}</Badge>
        <Badge variante="succes">Payé · {formaterPrix(sejour.paye)}</Badge>
        <Badge variante={sejour.reste > 0 ? 'avertissement' : 'neutre'}>Reste {formaterPrix(sejour.reste)}</Badge>
      </div>

      <p className="reservation-a-venir__lignes reservation-a-venir__lignes--petit">
        <span>
          {prestations.map((p) => `${p.libelle} : ${formaterPrix(p.montant)} · `).join('')}
          Total : {formaterPrix(sejour.total)}
        </span>
        <span>{etatChambre ? `Chambre ${etatChambre.toLowerCase()} · ${suite}` : suite}</span>
      </p>
    </section>
  );
}

export default function FicheClient() {
  const { idClient } = useParams();
  const navigate = useNavigate();

  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState([]);
  const [fiche, setFiche] = useState(undefined); // undefined = rien de choisi, null = introuvable
  const [version, setVersion] = useState(0); // incrémentée après archivage / restauration

  // Fiche choisie dans l'adresse.
  useEffect(() => {
    if (!idClient) {
      setFiche(undefined);
      return;
    }
    chargerFicheClient(Number(idClient)).then((f) => {
      setFiche(f);
      // Arrivée depuis un lien : on affiche le nom dans le champ, comme la maquette.
      if (f) setRecherche((actuelle) => actuelle || `${f.client.prenom} ${f.client.nom}`);
    });
  }, [idClient, version]);

  // Résultats de la recherche (fiches actives seulement).
  useEffect(() => {
    chercherClients(recherche).then(setResultats);
  }, [recherche, version]);

  function rechercher(texte) {
    setRecherche(texte);
    // Si la saisie ne correspond plus à la fiche affichée, on revient à la liste.
    if (idClient) navigate('/reception/clients');
  }

  async function archiver() {
    await archiverClient(Number(idClient));
    setVersion((v) => v + 1);
  }

  async function restaurer() {
    await restaurerClient(Number(idClient));
    setVersion((v) => v + 1);
  }

  const aujourdhui = dateIso(new Date());
  // Réservation à venir la plus proche, sinon séjour en cours.
  const sejours = fiche?.sejours ?? [];
  const prochaine =
    sejours.filter((s) => s.statut === 'reserve' && s.depart >= aujourdhui).at(-1) ??
    sejours.find((s) => s.statut === 'en_cours');
  const passes = sejours.filter((s) => s.statut === 'termine' || s.statut === 'annule');

  return (
    <main className="reception__contenu">
      <div className="reception__titre-page">
        <div>
          <h1 className="reception__titre">Fiche client</h1>
          <p className="reception__sous-titre">Une relation suivie, du premier séjour au prochain retour.</p>
        </div>
        <Badge variante="neutre">{formaterDate(aujourdhui)}</Badge>
      </div>

      <div className="fiche-client__recherche">
        <div className="champ fiche-client__champ">
          <label htmlFor="client-recherche" className="champ__libelle">Rechercher par nom</label>
          <div className="champ__valeur">
            <Icone src={iconeRecherche} taille={16} />
            <input
              id="client-recherche"
              type="search"
              placeholder="Nom ou prénom…"
              value={recherche}
              onChange={(e) => rechercher(e.target.value)}
            />
          </div>
        </div>
        <Badge variante="neutre">
          {fiche?.client.supprime_le
            ? 'Fiche archivée · hors de la liste active'
            : `${resultats.length} fiche${resultats.length > 1 ? 's' : ''} trouvée${resultats.length > 1 ? 's' : ''}`}
        </Badge>
      </div>

      {/* Sans fiche choisie : la liste des fiches correspondant à la recherche. */}
      {!idClient && (
        <div className="fiche-client__resultats">
          {resultats.map((c) => (
            <Bouton key={c.id_client} petit variante="secondaire" to={`/reception/clients/${c.id_client}`}>
              {c.prenom} {c.nom}
            </Bouton>
          ))}
        </div>
      )}

      {fiche === null && <p className="mouvements__vide">Cette fiche client n’existe pas.</p>}

      {fiche && (
        <div className="fiche-client">
          <ProfilClient client={fiche.client} sejours={sejours} />

          <div className="fiche-client__dossier">
            {prochaine && <ReservationAVenir sejour={prochaine} />}
            <HistoriqueSejours key={fiche.client.id_client} sejours={passes} />
            <ArchivageClient client={fiche.client} onArchiver={archiver} onRestaurer={restaurer} />
          </div>
        </div>
      )}
    </main>
  );
}
