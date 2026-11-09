// Écran « Tableau de bord » de la réception (maquette : Tableau de bord · Réception).
// Données : fictives pour l'instant (donneesFictives.js), voir l'en-tête de ce fichier.
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Badge from '../composants/Badge.jsx';
import { dateIso, formaterDate } from '../format.js';
import { chargerTableauDeBord } from './donneesFictives.js';
import { etatVisuel } from './etatsChambres.js';
import PlanChambres from './PlanChambres.jsx';
import PanneauMouvements from './PanneauMouvements.jsx';

// Carte d'indicateur : libellé, grande valeur, détail.
function Indicateur({ libelle, valeur, detail }) {
  return (
    <div className="indicateur">
      <p className="indicateur__libelle">{libelle}</p>
      <p className="indicateur__valeur">{valeur}</p>
      <p className="indicateur__detail">{detail}</p>
    </div>
  );
}

export default function TableauDeBord() {
  const { hotel } = useOutletContext();
  const [donnees, setDonnees] = useState(null);
  const [numeroSelectionne, setNumeroSelectionne] = useState(null);

  useEffect(() => {
    setDonnees(null);
    chargerTableauDeBord(hotel.id_hotel).then((d) => {
      setDonnees(d);
      // Par défaut, on sélectionne la chambre de la première arrivée du jour.
      setNumeroSelectionne(d.arrivees[0]?.numero ?? null);
    });
  }, [hotel.id_hotel]);

  if (!donnees) return <main className="reception__contenu">Chargement…</main>;

  const { chambres, arrivees, departs } = donnees;

  // --- Indicateurs du jour, calculés à partir des chambres -------------------
  const occupees = chambres.filter((c) => etatVisuel(c) === 'occupee').length;
  const tauxOccupation = chambres.length ? Math.round((occupees / chambres.length) * 100) : 0;

  const libres = chambres.filter((c) => etatVisuel(c) === 'libre');
  const libresReservees = libres.filter((c) => c.attendu);
  let detailLibres = 'Prêtes à accueillir';
  if (libresReservees.length === 1) {
    const [chambre] = libresReservees;
    detailLibres = `Dont la ${chambre.numero}, réservée à ${chambre.attendu.split(' ')[0]}`;
  } else if (libresReservees.length > 1) {
    detailLibres = `Dont ${libresReservees.length} réservées pour une arrivée`;
  }

  const aNettoyer = chambres.filter((c) => c.etat === 'sale');

  return (
    <main className="reception__contenu">
      <div className="reception__titre-page">
        <div>
          <h1 className="reception__titre">Tableau de bord</h1>
          <p className="reception__sous-titre">Le bon état de chaque chambre. Le bon accueil, au bon moment.</p>
        </div>
        <Badge variante="neutre">{formaterDate(dateIso(new Date()))}</Badge>
      </div>

      <div className="indicateurs">
        <Indicateur
          libelle="Occupation actuelle"
          valeur={`${tauxOccupation} %`}
          detail={`${occupees} chambre${occupees > 1 ? 's' : ''} occupée${occupees > 1 ? 's' : ''} sur ${chambres.length}`}
        />
        <Indicateur libelle="Libres et propres" valeur={libres.length} detail={detailLibres} />
        <Indicateur
          libelle="Arrivées / départs"
          valeur={`${arrivees.length} / ${departs.length}`}
          detail="Check-in et check-out à effectuer"
        />
        <Indicateur
          libelle="Ménage à réaliser"
          valeur={aNettoyer.length}
          detail={aNettoyer.length ? aNettoyer.map((c) => c.numero).join(' · ') : 'Tout est prêt'}
        />
      </div>

      <PlanChambres
        chambres={chambres}
        departs={departs}
        numeroSelectionne={numeroSelectionne}
        onSelectionner={setNumeroSelectionne}
      />

      <div className="mouvements-du-jour">
        <PanneauMouvements type="arrivee" mouvements={arrivees} />
        <PanneauMouvements type="depart" mouvements={departs} />
      </div>
    </main>
  );
}
