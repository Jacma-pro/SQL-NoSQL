// « Archiver, sans effacer » : la suppression logique (soft delete) du projet.
// Archiver remplit client.supprime_le ; restaurer le remet à NULL. Les séjours
// ne sont jamais supprimés (clés étrangères en ON DELETE RESTRICT).
import Bouton from '../composants/Bouton.jsx';
import Icone from '../composants/Icone.jsx';
import { formaterDate } from '../format.js';
import iconeArchive from '../assets/icones/archive.svg';
import iconeArchiveGris from '../assets/icones/archive-gris.svg';

export default function ArchivageClient({ client, onArchiver, onRestaurer }) {
  const nom = `${client.prenom} ${client.nom}`;
  const archivee = client.supprime_le !== null;

  return (
    <section className="panneau archivage">
      <div className="archivage__action">
        <div className="archivage__description">
          <h2 className="archivage__titre">Archiver, sans effacer</h2>
          <p>La fiche quitte la liste active. Les coordonnées et séjours restent conservés et consultables.</p>
        </div>
        {!archivee && (
          <Bouton petit variante="secondaire" icone={iconeArchive} onClick={onArchiver}>
            Archiver la fiche
          </Bouton>
        )}
      </div>

      <hr className="separateur" />

      {/* Fiche active : aperçu de ce que donnera l'archivage. Fiche archivée : son état réel. */}
      <div className="archivage__etat">
        <Icone src={iconeArchiveGris} taille={18} />
        <div className="archivage__etat-texte">
          <p className="archivage__etat-rubrique">
            {archivee ? `ARCHIVÉE LE ${formaterDate(client.supprime_le)}` : 'APERÇU APRÈS ARCHIVAGE'}
          </p>
          <p className="archivage__etat-nom">{nom} · Fiche archivée</p>
          <p className="archivage__etat-detail">Lecture seule · Historique conservé</p>
        </div>
        {archivee ? (
          <button type="button" className="archivage__restaurer" onClick={onRestaurer}>Restaurer</button>
        ) : (
          <span className="archivage__restaurer archivage__restaurer--apercu">Restaurer</span>
        )}
      </div>
    </section>
  );
}
