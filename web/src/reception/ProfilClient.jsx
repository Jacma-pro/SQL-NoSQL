// Colonne de gauche de la fiche client : identité, coordonnées, bilan des
// séjours passés, et « Les petites attentions » (préférences).
import Badge from '../composants/Badge.jsx';
import Bouton from '../composants/Bouton.jsx';
import { formaterDate, formaterPrix, nombreNuits } from '../format.js';

export default function ProfilClient({ client, sejours }) {
  const initiales = `${client.prenom[0]}${client.nom[0]}`.toUpperCase();
  const archivee = client.supprime_le !== null;

  // Bilan des séjours terminés.
  const termines = sejours.filter((s) => s.statut === 'termine');
  const nuits = termines.reduce((total, s) => total + nombreNuits(s.arrivee, s.depart), 0);
  const montant = termines.reduce((total, s) => total + s.total, 0);
  const resteDu = termines.reduce((total, s) => total + s.reste, 0);
  // Premier séjour = le plus ancien (les séjours arrivent du plus récent au plus ancien).
  const premierSejour = sejours.at(-1);

  return (
    <div className="profil-client">
      <section className="panneau profil-client__carte">
        <h2 className="panneau__titre panneau__titre--moyen">{client.prenom} {client.nom}</h2>

        <div className="profil-client__identite">
          <span className="profil-client__initiales" aria-hidden="true">{initiales}</span>
          <div className="profil-client__statut">
            {archivee ? (
              <Badge variante="neutre">Fiche archivée</Badge>
            ) : (
              <Badge>Fiche active</Badge>
            )}
            {premierSejour && (
              <p className="profil-client__depuis">Premier séjour le {formaterDate(premierSejour.arrivee)}</p>
            )}
          </div>
        </div>

        <hr className="separateur" />

        <div className="profil-client__coordonnees">
          <p className="profil-client__rubrique">COORDONNÉES</p>
          <p>{client.email}</p>
          {client.telephone && <p>{client.telephone}</p>}
          {client.adresse && (
            <p>
              {client.adresse.map((ligne) => (
                <span key={ligne} className="profil-client__ligne">{ligne}</span>
              ))}
            </p>
          )}
        </div>

        <hr className="separateur" />

        <p className="profil-client__bilan">
          <span className="profil-client__ligne">
            {termines.length} séjour{termines.length > 1 ? 's' : ''} terminé{termines.length > 1 ? 's' : ''} ·{' '}
            {nuits} nuit{nuits > 1 ? 's' : ''}
          </span>
          <span className="profil-client__ligne">
            {formaterPrix(montant)} de séjours passés,{' '}
            {resteDu > 0 ? `dont ${formaterPrix(resteDu)} à régler` : 'réglés'}
          </span>
        </p>

        <Bouton
          variante="secondaire"
          pleineLargeur
          disabled
          title="Modification à brancher sur l'API (le rôle actuel est en lecture seule)"
        >
          Modifier les coordonnées
        </Bouton>
      </section>

      {client.preferences && (
        <section className="profil-client__attentions">
          <h2 className="profil-client__attentions-titre">Les petites attentions</h2>
          <p>{client.preferences}</p>
        </section>
      )}
    </div>
  );
}
